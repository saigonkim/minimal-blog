'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PostMetadata } from '@/lib/posts';
import BannerSlot from '@/components/BannerSlot';
import { Calendar, Tag, Search, X } from 'lucide-react';

interface SearchablePostListProps {
  posts: PostMetadata[];
}

export default function SearchablePostList({ posts }: SearchablePostListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // 검색 필터링 (제목, 요약, 태그 기준 매칭)
  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const matchesTitle = post.title.toLowerCase().includes(query);
    const matchesDescription = post.description?.toLowerCase().includes(query);
    const matchesTags = post.tags?.some((tag) => tag.toLowerCase().includes(query));

    return matchesTitle || matchesDescription || matchesTags;
  });

  return (
    <div className="space-y-8">
      {/* Search Input Box */}
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="제목, 본문 요약, 태그 검색..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-800 bg-[#18181b]/30 text-neutral-250 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-500 transition-all text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-350 transition-colors"
            aria-label="검색어 지우기"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 필터링 결과 피드백 */}
      {searchQuery && (
        <p className="text-xs text-neutral-500">
          &apos;{searchQuery}&apos; 검색 결과: 총 {filteredPosts.length}개의 포스트를 찾았습니다.
        </p>
      )}

      {/* 포스트 카드 목록 */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-neutral-800 rounded-2xl">
          <p className="text-neutral-500">일치하는 포스트가 없습니다.</p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 text-sm font-semibold text-violet-400 hover:underline"
            >
              검색 초기화
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-8">
          {filteredPosts.map((post, index) => (
            <div key={post.slug}>
              <article 
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
                    {post.tags.map((tag) => (
                      <Link 
                        key={tag}
                        href={`/tags/${encodeURIComponent(tag)}`}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
                      >
                        <Tag className="w-3 h-3 text-neutral-500" />
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </article>

              {/* 검색 필터링 중이 아닐 때만 첫 번째 글 아래 광고 노출 */}
              {!searchQuery && index === 0 && (
                <BannerSlot type="inline" id="main-list-banner" className="my-6" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
