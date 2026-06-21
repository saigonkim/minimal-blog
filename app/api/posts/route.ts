import { NextRequest, NextResponse } from 'next/server';
import { savePost, deletePost, getPostBySlug } from '@/lib/posts';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

function authenticate(req: NextRequest): boolean {
  // 헤더에서 비밀번호를 가져옴
  const password = req.headers.get('x-admin-password') || req.headers.get('Authorization')?.replace('Bearer ', '');
  return password === ADMIN_PASSWORD;
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

    // 슬러그 포맷 체크 (영문, 숫자, 하이픈만 허용하도록 간단히 정규식 처리 가능)
    const formattedSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-');

    if (!formattedSlug) {
      return NextResponse.json({ error: '올바르지 않은 슬러그 형식입니다.' }, { status: 400 });
    }

    savePost({
      slug: formattedSlug,
      title,
      date,
      description: description || '',
      tags: Array.isArray(tags) ? tags : [],
      content,
    });

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

    const deleted = deletePost(slug);

    if (deleted) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 });
    }
  } catch (error) {
    console.error('글 삭제 실패:', error);
    return NextResponse.json({ error: '글을 삭제하는 도중 오류가 발생했습니다.' }, { status: 500 });
  }
}
