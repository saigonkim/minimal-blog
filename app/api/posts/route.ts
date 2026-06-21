import { NextRequest, NextResponse } from 'next/server';
import { savePost, deletePost } from '@/lib/posts';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

// 깃허브 API 설정 완료 여부 검증
const isGitHubConfigured = !!(GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO);

function authenticate(req: NextRequest): boolean {
  const password = req.headers.get('x-admin-password') || req.headers.get('Authorization')?.replace('Bearer ', '');
  return password === ADMIN_PASSWORD;
}

// 깃허브 레포지토리 파일의 SHA 고유 키를 가져오는 헬퍼
async function getGitHubFileSha(slug: string): Promise<string | null> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/content/${slug}.md`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'no-store',
    });
    if (res.status === 200) {
      const data = await res.json();
      return data.sha;
    }
    return null;
  } catch (err) {
    console.error('GitHub SHA 조회 실패:', err);
    return null;
  }
}

// 깃허브 파일 저장 및 업데이트 처리
async function saveGitHubFile(slug: string, fileContent: string, sha: string | null): Promise<boolean> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/content/${slug}.md`;
  
  // 마크다운 컨텐츠를 UTF-8을 감안해 base64로 인코딩
  const base64Content = Buffer.from(fileContent, 'utf-8').toString('base64');
  
  const body: any = {
    message: sha ? `fix: Update post [${slug}] via admin` : `feat: Add post [${slug}] via admin`,
    content: base64Content,
  };
  
  if (sha) {
    body.sha = sha;
  }

  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch (error) {
    console.error('GitHub API 저장 요청 실패:', error);
    return false;
  }
}

// 깃허브 파일 삭제 처리
async function deleteGitHubFile(slug: string, sha: string): Promise<boolean> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/content/${slug}.md`;
  
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `remove: Delete post [${slug}] via admin`,
        sha,
      }),
    });
    return res.ok;
  } catch (error) {
    console.error('GitHub API 삭제 요청 실패:', error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!authenticate(req)) {
    return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { slug, title, date, description, tags, content } = body;

    if (!slug || !title || !date || !content) {
      return NextResponse.json({ error: '필수 필드가 누락되었습니다.' }, { status: 400 });
    }

    const formattedSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-');

    if (!formattedSlug) {
      return NextResponse.json({ error: '올바르지 않은 슬러그 형식입니다.' }, { status: 400 });
    }

    // 마크다운 문서 생성 (frontmatter 포함)
    const fileContent = `---
title: ${JSON.stringify(title)}
date: ${JSON.stringify(date)}
description: ${JSON.stringify(description)}
tags: ${JSON.stringify(tags)}
---

${content}
`;

    // 1. GITHUB API 연동이 설정되어 있으면 GitHub 원격 파일 생성/수정 커밋 푸시
    if (isGitHubConfigured) {
      const sha = await getGitHubFileSha(formattedSlug);
      const isSuccess = await saveGitHubFile(formattedSlug, fileContent, sha);
      if (!isSuccess) {
        return NextResponse.json({ error: 'GitHub 원격 저장소에 글을 반영하지 못했습니다.' }, { status: 500 });
      }
    }

    // 2. 로컬 개발 환경에서도 동기적으로 파일을 바로 저장 (로컬 개발 편의용)
    // process.env.VERCEL이 '1'일 때는 Vercel 서버리스 위에서 도는 상태이므로 로컬 fs 쓰기를 안전하게 바이패스하거나 생략할 수 있지만, 
    // 로컬 디렉토리 에러를 피하기 위해 try-catch로 로컬 fs 쓰기를 처리해 줍니다.
    try {
      savePost({
        slug: formattedSlug,
        title,
        date,
        description: description || '',
        tags: Array.isArray(tags) ? tags : [],
        content,
      });
    } catch (fsErr) {
      console.warn('로컬 파일 저장 스킵 (서버리스 환경):', fsErr);
    }

    return NextResponse.json({ success: true, slug: formattedSlug });
  } catch (error) {
    console.error('글 저장 실패:', error);
    return NextResponse.json({ error: '글을 저장하는 도중 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!authenticate(req)) {
    return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: '슬러그가 지정되지 않았습니다.' }, { status: 400 });
    }

    // 1. GITHUB API 연동이 설정되어 있으면 GitHub 원격 파일 삭제 커밋 푸시
    if (isGitHubConfigured) {
      const sha = await getGitHubFileSha(slug);
      if (sha) {
        const isSuccess = await deleteGitHubFile(slug, sha);
        if (!isSuccess) {
          return NextResponse.json({ error: 'GitHub 원격 저장소에서 글을 삭제하지 못했습니다.' }, { status: 500 });
        }
      }
    }

    // 2. 로컬 개발 환경 동기 삭제 처리
    try {
      deletePost(slug);
    } catch (fsErr) {
      console.warn('로컬 파일 삭제 스킵 (서버리스 환경):', fsErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('글 삭제 실패:', error);
    return NextResponse.json({ error: '글을 삭제하는 도중 오류가 발생했습니다.' }, { status: 500 });
  }
}
