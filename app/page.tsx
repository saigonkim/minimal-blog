import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import SearchablePostList from '@/components/SearchablePostList';
import { blogConfig } from '@/blog.config';

export const dynamic = 'force-dynamic'; // 항상 서버에서 최신 마크다운 파일을 읽도록 설정

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="space-y-12">
      {/* Blog Intro Hero */}
      <section className="py-6 border-b border-neutral-800">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          {blogConfig.title} Thoughts
        </h1>
        <p className="mt-4 text-base text-neutral-500 max-w-2xl leading-relaxed">
          {blogConfig.author.intro} 
          설정 파일 수정만으로 관리되는 초경량 0원 블로그 플랫폼입니다.
        </p>
      </section>

      {/* 포스트가 없는 경우 */}
      {posts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-neutral-800 rounded-2xl">
          <p className="text-neutral-500">등록된 포스트가 없습니다.</p>
          <Link 
            href="/admin/write" 
            className="mt-4 inline-flex items-center text-sm font-semibold text-violet-400 hover:underline"
          >
            첫 글 작성하러 가기 &rarr;
          </Link>
        </div>
      ) : (
        <SearchablePostList posts={posts} />
      )}
    </div>
  );
}
