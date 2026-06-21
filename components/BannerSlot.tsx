'use client';

import React, { useState, useEffect } from 'react';

interface Banner {
  id: string;
  title: string;
  url: string;
  pcImage: string;
  mobileImage: string;
  alt: string;
}

const BANNERS: Banner[] = [
  {
    id: 'minimal-arcade',
    title: 'Minimal Arcade',
    url: 'https://minimal-arcade-777.web.app/',
    pcImage: '/images/banners/minimal_arcade_pc.png',
    mobileImage: '/images/banners/minimal_arcade_mobile.png',
    alt: 'Minimal Arcade - 설치 없는 미니멀 웹 게임 포털'
  },
  {
    id: 'tensec-check',
    title: 'TenSec Check',
    url: 'https://tensec-check.vercel.app/',
    pcImage: '/images/banners/tensec_check_pc.png',
    mobileImage: '/images/banners/tensec_check_mobile.png',
    alt: 'TenSec Check - AI 등기부 10초 해독 및 전세 안전 점수 분석'
  },
  {
    id: 'lotto-lab',
    title: 'Lotto Lab',
    url: 'https://lotto-lab-sand.vercel.app/',
    pcImage: '/images/banners/lotto_lab_pc.png',
    mobileImage: '/images/banners/lotto_lab_mobile.png',
    alt: '로또 랩 - 데이터 분석 및 알고리즘 기반 번호 추천 연구소'
  },
  {
    id: 'daily-analects',
    title: 'Daily Analects',
    url: 'https://daily-analects.vercel.app/',
    pcImage: '/images/banners/daily_analects_pc.png',
    mobileImage: '/images/banners/daily_analects_mobile.png',
    alt: '하루의 시작 논어 한 구절 - 매일 아침 전해지는 삶의 지혜'
  },
  {
    id: 'cute-pen-decorator',
    title: 'Cute Pen Decorator',
    url: 'https://cute-pen-decorator.vercel.app/',
    pcImage: '/images/banners/cute_pen_decorator_pc.png',
    mobileImage: '/images/banners/cute_pen_decorator_mobile.png',
    alt: '나만의 비즈펜 꾸미기 - 귀여운 파츠로 볼펜을 제작하는 DIY 힐링 게임'
  }
];

interface BannerSlotProps {
  id?: string;
  className?: string;
  type?: 'inline' | 'sidebar' | 'bottom';
}

export default function BannerSlot({ id = 'default-banner', className = '', type = 'inline' }: BannerSlotProps) {
  const [activeBanner, setActiveBanner] = useState<Banner | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const randomIndex = Math.floor(Math.random() * BANNERS.length);
    setActiveBanner(BANNERS[randomIndex]);
  }, []);

  const layoutMargin = type === 'bottom' ? 'mt-12 mb-6' : 'my-8';

  // 클라이언트 마운트 전에는 레이아웃 시프트 방지를 위한 스켈레톤 렌더링
  if (!isMounted || !activeBanner) {
    return (
      <div className={`w-full overflow-hidden rounded-xl border border-neutral-900 bg-neutral-950/20 animate-pulse ${layoutMargin} ${className}`}>
        {/* PC 뷰포트 스켈레톤 (3.4:1 비율) */}
        <div className="hidden md:block w-full aspect-[3.4/1]" />
        {/* 모바일 뷰포트 스켈레톤 (1:1 비율) */}
        <div className="block md:hidden w-full aspect-square" />
      </div>
    );
  }

  return (
    <div
      id={id}
      className={`w-full overflow-hidden rounded-xl border border-neutral-850 bg-neutral-950 flex items-center justify-center transition-all duration-300 hover:border-neutral-700 hover:shadow-[0_0_20px_rgba(139,92,246,0.08)] ${layoutMargin} ${className}`}
    >
      <a
        href={activeBanner.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block w-full h-full group"
      >
        {/* PC View: 가로형 3.4:1 비율로 중앙 배너 박스만 크롭하여 보여줌 */}
        <div className="hidden md:block w-full aspect-[3.4/1] overflow-hidden relative">
          <img
            src={activeBanner.pcImage}
            alt={activeBanner.alt}
            className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-[1.015] group-hover:brightness-110 active:scale-[0.995]"
            loading="lazy"
          />
          {/* 호버 시 은은한 조명 테두리 효과 */}
          <div className="absolute inset-0 border border-violet-500/0 group-hover:border-violet-500/20 rounded-xl transition-all duration-300 pointer-events-none" />
        </div>

        {/* Mobile View: 1:1 정사각형 비율로 가득 채워서 보여줌 */}
        <div className="block md:hidden w-full aspect-square overflow-hidden relative">
          <img
            src={activeBanner.mobileImage}
            alt={activeBanner.alt}
            className="w-full h-full object-cover object-center transition-all duration-500 group-hover:brightness-110 active:scale-[0.995]"
            loading="lazy"
          />
          <div className="absolute inset-0 border border-violet-500/0 group-hover:border-violet-500/20 rounded-xl transition-all duration-300 pointer-events-none" />
        </div>

        {/* Sponsor 태그 배지 */}
        <span className="absolute top-3 right-3 z-10 px-1.5 py-0.5 rounded bg-neutral-950/80 text-[10px] font-bold tracking-wider text-neutral-500 uppercase pointer-events-none border border-neutral-800/50">
          Sponsor
        </span>
      </a>
    </div>
  );
}

