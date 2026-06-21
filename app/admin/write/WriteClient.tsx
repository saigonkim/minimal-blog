'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/lib/posts';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { ArrowLeft, Save, Eye, Edit3, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface WriteClientProps {
  post: Post | null;
  adminPassword?: string;
}

export default function WriteClient({ post, adminPassword }: WriteClientProps) {
  const router = useRouter();
  const isEditMode = !!post;

  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [date, setDate] = useState(post?.date || '');
  const [description, setDescription] = useState(post?.description || '');
  const [tagsInput, setTagsInput] = useState(post?.tags?.join(', ') || '');
  const [content, setContent] = useState(post?.content || '');
  
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isSaving, setIsSaving] = useState(false);

  // 새 글 등록 시 기본 오늘 날짜 YYYY-MM-DD 삽입
  useEffect(() => {
    if (!isEditMode && !date) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setDate(`${yyyy}-${mm}-${dd}`);
    }
  }, [isEditMode, date]);

  // 제목 입력 시 슬러그 자동 추천 생성 (영문/숫자/하이픈만)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEditMode) {
      const suggestedSlug = val
        .toLowerCase()
        .replace(/[^a-zA-Z0-9가-힣\s-]/g, '') // 특수문자 제거
        .trim()
        .replace(/\s+/g, '-'); // 공백을 하이픈으로
      setSlug(suggestedSlug);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !date || !content) {
      alert('필수 입력값을 채워주세요.');
      return;
    }

    setIsSaving(true);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword || 'admin123',
        },
        body: JSON.stringify({
          slug,
          title,
          date,
          description,
          tags,
          content,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('포스트가 저장되었습니다.');
        router.push('/admin');
        router.refresh();
      } else {
        alert(`저장 실패: ${data.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('글 저장 실패:', error);
      alert('저장 요청 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Link 
            href="/admin" 
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {isEditMode ? '포스트 수정' : '새 포스트 작성'}
          </h1>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-55 shadow-sm"
        >
          <Save className="w-4 h-4" />
          {isSaving ? '저장 중...' : '포스트 저장'}
        </button>
      </div>

      {/* Editor & Preview Split Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[60vh] items-stretch">
        
        {/* Form Panel */}
        <form onSubmit={handleSave} className="space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                제목 *
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="포스트 제목을 입력하세요"
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#18181b]/50 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm font-semibold"
                required
              />
            </div>

            {/* Slug & Date Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                  슬러그 (영문/숫자/하이픈) *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                  placeholder="hello-world"
                  disabled={isEditMode}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#18181b]/50 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                  작성일 (YYYY-MM-DD) *
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="2026-06-21"
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#18181b]/50 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                포스트 요약 설명
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="리스트에 노출될 포스트의 짧은 요약글을 적어주세요"
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#18181b]/50 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                태그 (쉼표로 구분)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Nextjs, Minimal, VibeCoding"
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#18181b]/50 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm"
              />
            </div>

            {/* Markdown Editor Textarea */}
            <div className="flex-1 flex flex-col min-h-[300px]">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  마크다운 본문 *
                </label>
                <div className="flex lg:hidden items-center border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`px-3 py-1 flex items-center gap-1 ${activeTab === 'write' ? 'bg-violet-600 text-white' : 'bg-transparent'}`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    에디터
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 flex items-center gap-1 ${activeTab === 'preview' ? 'bg-violet-600 text-white' : 'bg-transparent'}`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    프리뷰
                  </button>
                </div>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="마크다운 양식으로 본문을 작성하세요... (이미지는 ![](/images/photo.jpg) 형태로 연결 가능)"
                className={`w-full flex-1 p-4 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#18181b]/50 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm font-mono leading-relaxed min-h-[300px] ${activeTab === 'preview' ? 'hidden lg:block' : ''}`}
                required
              />
            </div>
          </div>
        </form>

        {/* Live Preview Panel */}
        <div className={`flex flex-col border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-[#18181b]/20 rounded-2xl p-6 min-h-[400px] lg:min-h-full ${activeTab === 'write' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-neutral-100 dark:border-neutral-850/80 text-sm font-semibold text-neutral-400">
            <Sparkles className="w-4 h-4 text-violet-500" />
            실시간 프리뷰 (Live Preview)
          </div>
          <div className="flex-1 overflow-y-auto max-h-[70vh] pr-2">
            {content.trim() ? (
              <MarkdownRenderer content={content} />
            ) : (
              <p className="text-sm text-neutral-400 dark:text-neutral-600 italic">본문 내용을 입력하면 여기에 실시간으로 변환 렌더링됩니다.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
