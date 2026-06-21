import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMetadata {
  title: string;
  date: string;
  description: string;
  tags: string[];
  slug: string;
}

export interface Post extends PostMetadata {
  content: string;
}

const contentDirectory = path.join(process.cwd(), 'content');

// content 디렉토리가 존재하는지 보장
function ensureContentDirectory() {
  if (!fs.existsSync(contentDirectory)) {
    fs.mkdirSync(contentDirectory, { recursive: true });
  }
}

// 모든 포스트 목록을 가져옴 (날짜 최신순 정렬)
export function getAllPosts(): PostMetadata[] {
  ensureContentDirectory();
  
  const fileNames = fs.readdirSync(contentDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      const { data } = matter(fileContents);
      
      return {
        slug,
        title: data.title || '무제',
        date: data.date || '',
        description: data.description || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
      } as PostMetadata;
    });

  // 날짜 내림차순 정렬 (최신글이 위로)
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else if (a.date > b.date) {
      return -1;
    } else {
      return 0;
    }
  });
}

// 특정 슬러그의 포스트 상세 정보 가져옴
export function getPostBySlug(slug: string): Post | null {
  ensureContentDirectory();
  const fullPath = path.join(contentDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    slug,
    title: data.title || '무제',
    date: data.date || '',
    description: data.description || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    content,
  };
}

// 포스트 저장 또는 업데이트
export function savePost(post: Omit<Post, 'slug'> & { slug: string }): void {
  ensureContentDirectory();
  const { slug, title, date, description, tags, content } = post;
  
  // 마크다운 형식으로 포맷팅 (frontmatter 조립)
  const fileContent = `---
title: ${JSON.stringify(title)}
date: ${JSON.stringify(date)}
description: ${JSON.stringify(description)}
tags: ${JSON.stringify(tags)}
---

${content}
`;

  const fullPath = path.join(contentDirectory, `${slug}.md`);
  fs.writeFileSync(fullPath, fileContent, 'utf8');
}

// 포스트 삭제
export function deletePost(slug: string): boolean {
  ensureContentDirectory();
  const fullPath = path.join(contentDirectory, `${slug}.md`);
  
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    return true;
  }
  return false;
}
