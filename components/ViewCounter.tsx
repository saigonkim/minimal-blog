'use client';

import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

interface ViewCounterProps {
  slug: string;
}

export default function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // 상세 페이지 진입 시 POST 요청을 보내 조회수를 1 올리고 최신 값을 받아옵니다.
    const incrementViews = async () => {
      try {
        const response = await fetch(`/api/views/${slug}`, {
          method: 'POST',
        });
        if (response.ok) {
          const data = await response.json();
          if (typeof data.views === 'number') {
            setViews(data.views);
          }
        }
      } catch (error) {
        console.error('Failed to increment and fetch views:', error);
      }
    };

    incrementViews();
  }, [slug]);

  // 로딩 중일 때는 깔끔한 대시 기호 혹은 숨김 처리
  const displayViews = views !== null ? `${views.toLocaleString()}` : '--';

  return (
    <div className="inline-flex items-center gap-1.5 text-sm text-neutral-500">
      <Eye className="w-4 h-4 text-neutral-550" />
      <span>조회수 {displayViews}회</span>
    </div>
  );
}
