import { NextResponse } from 'next/server';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { blogConfig } from '@/blog.config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const posts = getAllPosts();
  const siteUrl = blogConfig.siteUrl;

  const rssItems = posts
    .map((post) => {
      const postUrl = `${siteUrl}/posts/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();
      
      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.description || ''}]]></description>
      ${(post.tags || []).map(t => `<category><![CDATA[${t}]]></category>`).join('\n      ')}
    </item>`;
    })
    .join('\n');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${blogConfig.title}]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[${blogConfig.description}]]></description>
    <language>ko-KR</language>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <generator>MinimaLog RSS Generator</generator>
${rssItems}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      'x-vercel-skip-toolbar': '1',
    },
  });
}
