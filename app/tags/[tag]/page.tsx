import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

// 태그 페이지 동적 메타데이터 설정
export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `#${decodedTag} 태그 포스트 목록 - MinimaLog`,
    description: `MinimaLog에서 #${decodedTag} 태그를 가진 포스트 목록을 모아봅니다.`,
  };
}

// 정적 빌드 시 미리 태그별 페이지 생성
export async function generateStaticParams() {
  const posts = getAllPosts();
  // 모든 태그 수집 후 중복 제거
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags || []))
  );

  return allTags.map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}

export default async function TagFilterPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  
  const posts = getAllPosts();
  // 해당 태그가 포함된 포스트만 필터링
  const filteredPosts = posts.filter((post) => 
    post.tags && post.tags.map(t => t.toLowerCase()).includes(decodedTag.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* 뒤로가기 버튼 */}
      <div className="flex items-center">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          전체 글 목록으로 돌아가기
        </Link>
      </div>

      {/* 태그 헤더 */}
      <section className="py-6 border-b border-neutral-800">
        <div className="flex items-center gap-2 text-violet-400">
          <Tag className="w-6 h-6" />
          <h1 className="text-3xl font-extrabold tracking-tight">
            #{decodedTag}
          </h1>
        </div>
        <p className="mt-2 text-sm text-neutral-500">
          총 {filteredPosts.length}개의 포스트가 등록되어 있습니다.
        </p>
      </section>

      {/* 필터링된 포스트 카드 목록 */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-800 rounded-2xl">
          <p className="text-neutral-450">해당 태그를 가진 포스트가 없습니다.</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {filteredPosts.map((post) => (
            <article 
              key={post.slug}
              className="group relative flex flex-col items-start p-6 rounded-2xl border border-neutral-800 bg-[#18181b]/60 hover:bg-[#18181b]/90 hover:shadow-sm hover:shadow-neutral-900/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={post.date}>{post.date}</time>
              </div>
              
              <h2 className="mt-3 text-xl font-bold tracking-tight text-neutral-200 group-hover:text-violet-400 transition-colors">
                <Link href={`/posts/${post.slug}`}>
                  <span className="absolute inset-0 rounded-2xl" />
                  {post.title}
                </Link>
              </h2>
              
              <p className="mt-2 text-sm leading-relaxed text-neutral-500 line-clamp-2">
                {post.description || '이 포스트의 요약 설명이 없습니다.'}
              </p>
              
              {post.tags && post.tags.length > 0 && (
                <div className="relative z-10 mt-4 flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <Link
                      key={t}
                      href={`/tags/${encodeURIComponent(t)}`}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
                    >
                      <Tag className="w-3 h-3 text-neutral-500" />
                      {t}
                    </Link>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
