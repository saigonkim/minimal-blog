import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { blogConfig } from '@/blog.config';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = getAllPosts();
  const siteUrl = blogConfig.siteUrl;

  // 1. 포스트 상세 페이지들
  const postUrls = posts.map((post) => ({
    url: `${siteUrl}/posts/${post.slug}`,
    lastModified: new Date(post.date || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 2. 고유 태그 목록 및 태그별 페이지들
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags || []))
  );
  
  const tagUrls = allTags.map((tag) => ({
    url: `${siteUrl}/tags/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  // 3. 메인 홈 페이지
  const routes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
  ];

  return [...routes, ...postUrls, ...tagUrls];
}
