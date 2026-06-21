'use client';

import React from 'react';

interface BannerSlotProps {
  id?: string;
  className?: string;
  type?: 'inline' | 'sidebar' | 'bottom';
}

export default function BannerSlot({ id = 'default-banner', className = '', type = 'inline' }: BannerSlotProps) {
  // 실제 광고가 주입될 위치
  // 향후 Google AdSense, 카카오 애드핏, 혹은 커스텀 배너 스크립트를 로드할 수 있습니다.
  
  const typeStyles = {
    inline: 'w-full min-h-[100px] my-8',
    sidebar: 'w-full min-h-[250px] my-4',
    bottom: 'w-full min-h-[120px] mt-12 mb-6',
  };

  return (
    <div
      id={id}
      className={`relative overflow-hidden rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 flex items-center justify-center transition-all ${typeStyles[type]} ${className}`}
    >
      {/* 배경 장식 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-cyan-500/5 dark:from-violet-500/10 dark:via-fuchsia-500/10 dark:to-cyan-500/10 blur-sm pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center gap-1 p-4 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Sponsor / Advertisement
        </span>
        <p className="text-xs text-neutral-400 dark:text-neutral-600">
          광고 또는 추천 링크 영역입니다. (BannerSlot)
        </p>
      </div>
      
      {/* 엣지 광택 효과 */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
    </div>
  );
}
