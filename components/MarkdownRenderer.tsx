import React from 'react';
import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
}

// marked 옵션 설정 (기본 보안 및 링크 타겟 설정 등 추가 가능)
marked.setOptions({
  gfm: true,
  breaks: true,
});

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // 마크다운 파싱 (marked.parse에 async: false를 사용하여 동기식 문자열 반환 보장)
  const rawHtml = marked.parse(content, { async: false }) as string;

  return (
    <div 
      className="prose prose-neutral prose-invert max-w-none 
        prose-headings:font-bold 
        prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
        prose-p:leading-relaxed prose-p:text-neutral-300
        prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline
        prose-img:rounded-2xl prose-img:shadow-md
        prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800 prose-pre:rounded-xl
        prose-code:text-violet-400 prose-code:bg-neutral-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
        prose-blockquote:border-l-4 prose-blockquote:border-violet-500 prose-blockquote:bg-violet-500/5 prose-blockquote:px-4 prose-blockquote:py-1 prose-blockquote:rounded-r-lg"
      dangerouslySetInnerHTML={{ __html: rawHtml }}
    />
  );
}
