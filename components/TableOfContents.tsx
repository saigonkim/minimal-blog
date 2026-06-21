'use client';

import React, { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // 본문 마크다운 렌더러 영역에서 h2, h3 태그 쿼리
    const prose = document.querySelector('.prose');
    if (!prose) return;

    const headings = prose.querySelectorAll('h2, h3');
    const tocItems: TocItem[] = [];

    headings.forEach((heading, index) => {
      const text = heading.textContent || '';
      // ID가 존재하지 않으면 고유 ID 부여 (스크롤 앵커용)
      let id = heading.id;
      if (!id) {
        id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-')}`;
        heading.id = id;
      }

      tocItems.push({
        id,
        text,
        level: heading.tagName === 'H2' ? 2 : 3,
      });
    });

    setToc(tocItems);

    // 스크롤 트래킹을 위한 IntersectionObserver 구성
    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -70% 0px', // 화면 상단 부근을 통과할 때 감지
      threshold: 0.1,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
      observer.disconnect();
    };
  }, []);

  if (toc.length === 0) return null;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 85; // 헤더 바 높이만큼 오프셋 확보
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveId(id);
    }
  };

  return (
    <aside className="w-56 shrink-0 sticky top-24 self-start hidden lg:block border-l border-neutral-850 pl-4 py-1 text-xs">
      <h3 className="font-bold text-neutral-450 uppercase tracking-wider mb-4">
        목차 (TOC)
      </h3>
      <ul className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
        {toc.map((item) => (
          <li 
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
            className="transition-all"
          >
            <a
              href={`#${item.id}`}
              onClick={(e) => handleLinkClick(e, item.id)}
              className={`block hover:text-violet-400 leading-relaxed truncate transition-colors ${
                activeId === item.id 
                  ? 'text-violet-400 font-bold border-l border-violet-500 pl-1 -ml-[17px]' 
                  : 'text-neutral-500'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
