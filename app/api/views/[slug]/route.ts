import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // DB 연결 필수 토큰들이 설정되지 않았을 경우 로컬 환경 보호를 위한 조기 리턴
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.warn('Vercel KV environment variables are not configured. Returning 0 views.');
    return NextResponse.json({ views: 0, warning: 'Database not connected' });
  }

  try {
    // Redis Hash 데이터 구조 'post:views'에서 slug에 매핑된 조회수를 1 증가시킵니다.
    const newViews = await kv.hincrby('post:views', slug, 1);
    return NextResponse.json({ views: newViews });
  } catch (error) {
    console.error(`Failed to increment views for ${slug}:`, error);
    return NextResponse.json({ views: 0, error: 'Database query failed' });
  }
}
