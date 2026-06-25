import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // DB 연결 필수 토큰들이 설정되지 않았을 경우 빈 객체 리턴
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return NextResponse.json({});
  }

  try {
    // 'post:views' 해시에 저장된 모든 slug와 조회수 데이터를 가져옵니다.
    const allViews = await kv.hgetall('post:views');
    return NextResponse.json(allViews || {});
  } catch (error) {
    console.error('Failed to fetch all views:', error);
    return NextResponse.json({});
  }
}
