import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import BannerSlot from '@/components/BannerSlot';
import { Calendar, Tag } from 'lucide-react';

export const dynamic = 'force-dynamic'; // 항상 서버에서 최신 마크다운 파일을 읽도록 설정

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="space-y-12">
      {/* Blog Intro Hero */}
      <section className="py-6 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Minimalist Thoughts
        </h1>
        <p className="mt-4 text-base text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed">
          외주 유지보수 스트레스가 없는 초경량 마크다운 블로그 <strong>MinimaLog</strong>입니다. 
          DB 없이 마크다운 파일로 자유롭고 빠르게 글을 기록합니다.
        </p>
      </section>

      {/* 포스트가 없는 경우 */}
      {posts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
          <p className="text-neutral-500 dark:text-neutral-400">등록된 포스트가 없습니다.</p>
          <Link 
            href="/admin/write" 
            className="mt-4 inline-flex items-center text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline"
          >
            첫 글 작성하러 가기 &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid gap-8">
          {posts.map((post, index) => (
            <div key={post.slug}>
              <article 
                className="group relative flex flex-col items-start p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800/60 bg-white dark:bg-[#18181b]/40 hover:bg-neutral-50 dark:hover:bg-[#18181b]/70 hover:shadow-sm dark:hover:shadow-neutral-900/30 transition-all duration-300"
              >
                <div className="flex items-center gap-3 text-xs text-neutral-400 dark:text-neutral-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <time dateTime={post.date}>{post.date}</time>
                </div>
                
                <h2 className="mt-3 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  <Link href={`/posts/${post.slug}`}>
                    <span className="absolute inset-0 rounded-2xl" />
                    {post.title}
                  </Link>
                </h2>
                
                <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 line-clamp-2">
                  {post.description || '이 포스트의 요약 설명이 없습니다.'}
                </p>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="relative z-10 mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                      >
                        <Tag className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>

              {/* 목록 첫 번째 글 아래 광고 슬롯 자동 배치 (확장성 고려) */}
              {index === 0 && (
                <BannerSlot type="inline" id="main-list-banner" className="my-6" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
