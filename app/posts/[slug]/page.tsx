import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import TableOfContents from '@/components/TableOfContents';
import BannerSlot from '@/components/BannerSlot';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import { blogConfig } from '@/blog.config';
import ViewCounter from '@/components/ViewCounter';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 동적 SEO 메타데이터 생성
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: `포스트를 찾을 수 없습니다 - ${blogConfig.title}`,
    };
  }

  return {
    title: `${post.title} - ${blogConfig.title}`,
    description: post.description || `${post.title} 포스트 상세 보기`,
    openGraph: {
      title: `${post.title} - ${blogConfig.title}`,
      description: post.description || `${post.title} 포스트 상세 보기`,
      url: `${blogConfig.siteUrl}/posts/${slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [blogConfig.author.name],
      images: [
        {
          url: blogConfig.seo.defaultOgImage,
          alt: post.title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} - ${blogConfig.title}`,
      description: post.description || `${post.title} 포스트 상세 보기`,
      images: [blogConfig.seo.defaultOgImage],
    }
  };
}

// 정적 경로 생성을 위한 generateStaticParams 구현 (빠른 로딩 제공)
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-8">
      {/* 뒤로가기 버튼 */}
      <div className="flex items-center">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          글 목록으로 돌아가기
        </Link>
      </div>

      {/* Header 영역 */}
      <header className="py-6 border-b border-neutral-800">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-neutral-500 mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.date}>{post.date}</time>
          </div>
          <span className="text-neutral-700">•</span>
          <ViewCounter slug={post.slug} />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-200">
          {post.title}
        </h1>

        {post.description && (
          <p className="mt-4 text-base text-neutral-400 leading-relaxed border-l-2 border-neutral-700 pl-4 italic">
            {post.description}
          </p>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link 
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700/50 hover:bg-neutral-700 transition-colors"
              >
                <Tag className="w-3.5 h-3.5 text-neutral-500" />
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* 2열 구조 레이아웃 (본문 + TOC) */}
      <div className="flex gap-8 items-start">
        <section className="flex-1 min-w-0 py-2">
          <MarkdownRenderer content={post.content} />
        </section>
        <TableOfContents />
      </div>

      {/* 하단 광고 배너 슬롯 */}
      <BannerSlot type="bottom" id="post-bottom-banner" />
    </article>
  );
}
