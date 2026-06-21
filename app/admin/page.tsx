import { cookies } from 'next/headers';
import { getAllPosts } from '@/lib/posts';
import LoginForm from './LoginForm';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic'; // 쿠키를 활용하므로 항상 다이나믹하게 렌더링되도록 보장

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  const isAuthenticated = token === ADMIN_PASSWORD;

  if (!isAuthenticated) {
    return <LoginForm adminPassword={ADMIN_PASSWORD} />;
  }

  const posts = getAllPosts();

  return <AdminDashboard posts={posts} adminPassword={ADMIN_PASSWORD} />;
}
