import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPostBySlug } from '@/lib/posts';
import WriteClient from './WriteClient';

export const dynamic = 'force-dynamic'; // 쿠키와 쿼리를 활용하므로 항상 다이나믹하게 렌더링되도록 보장

interface WritePageProps {
  searchParams: Promise<{
    slug?: string;
  }>;
}

export default async function WritePage({ searchParams }: WritePageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  const isAuthenticated = token === ADMIN_PASSWORD;

  // 인증 실패 시 로그인 페이지(/admin)로 강제 이동
  if (!isAuthenticated) {
    redirect('/admin');
  }

  const { slug } = await searchParams;
  let post = null;

  if (slug) {
    post = getPostBySlug(slug);
    if (!post) {
      redirect('/admin'); // 해당 포스트가 없으면 관리자 대시보드로 돌아감
    }
  }

  return <WriteClient post={post} adminPassword={ADMIN_PASSWORD} />;
}
