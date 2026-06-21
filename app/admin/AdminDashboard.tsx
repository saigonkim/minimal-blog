'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PostMetadata } from '@/lib/posts';
import { Plus, Edit, Trash2, LogOut, FileText, Calendar, ExternalLink } from 'lucide-react';

interface AdminDashboardProps {
  posts: PostMetadata[];
  adminPassword?: string;
}

export default function AdminDashboard({ posts: initialPosts, adminPassword }: AdminDashboardProps) {
  const [posts, setPosts] = useState<PostMetadata[]>(initialPosts);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const handleLogout = () => {
    // 쿠키 제거 후 새로고침
    document.cookie = 'admin_token=; path=/; max-age=0; SameSite=Strict';
    window.location.reload();
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('정말로 이 포스트를 삭제하시겠습니까? 관련 마크다운 파일이 영구 삭제됩니다.')) {
      return;
    }

    setDeletingSlug(slug);
    try {
      const response = await fetch(`/api/posts?slug=${slug}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': adminPassword || 'admin123',
        },
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.slug !== slug));
        alert('포스트가 성공적으로 삭제되었습니다.');
      } else {
        const errorData = await response.json();
        alert(`삭제 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('삭제 요청 중 오류 발생:', error);
      alert('삭제 도중 오류가 발생했습니다.');
    } finally {
      setDeletingSlug(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 상단 액션바 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">글 관리 대시보드</h1>
          <p className="text-sm text-neutral-400 mt-1">
            작성된 로컬 마크다운 포스트를 수정하거나 삭제합니다.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/admin/write"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            새 글 작성
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg text-sm font-semibold transition-colors border border-neutral-800"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </div>

      {/* 포스트 관리 리스트 */}
      {posts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-800 rounded-2xl">
          <p className="text-neutral-400">아직 작성된 글이 없습니다. 새로운 글을 작성해 보세요!</p>
        </div>
      ) : (
        <div className="bg-[#18181b]/20 border border-neutral-800/80 rounded-2xl overflow-hidden">
          <ul className="divide-y divide-neutral-800/80">
            {posts.map((post) => (
              <li 
                key={post.slug}
                className="flex items-center justify-between p-5 hover:bg-neutral-900/20 transition-colors"
              >
                <div className="flex items-start gap-4 max-w-[70%]">
                  <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 mt-1 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-100 text-base leading-snug">
                      {post.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </span>
                      <span>•</span>
                      <span>/{post.slug}.md</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/posts/${post.slug}`}
                    target="_blank"
                    className="p-2 text-neutral-500 hover:text-neutral-200 transition-colors hover:bg-neutral-800/80 rounded-lg"
                    title="글 보기"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/write?slug=${post.slug}`}
                    className="p-2 text-neutral-400 hover:text-violet-400 transition-colors hover:bg-neutral-800/80 rounded-lg"
                    title="수정하기"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    disabled={deletingSlug === post.slug}
                    className="p-2 text-neutral-500 hover:text-rose-400 transition-colors hover:bg-rose-950/20 rounded-lg disabled:opacity-55"
                    title="삭제하기"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
