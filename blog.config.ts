export const blogConfig = {
  // 블로그 기본 정보
  title: 'MinimaLog',
  description: 'DB와 유지보수 스트레스가 없는 초경량 마크다운 기반 블로그',
  siteUrl: 'https://minimal-blog-topaz.vercel.app', // 사이트의 최종 도메인 주소 (sitemap 및 RSS 피드 생성에 사용)
  
  // 작성자 정보
  author: {
    name: 'saigonkim',
    email: 'studioplab@gmail.com', // 임의의 메일 주소
    intro: '외주 유지보수 스트레스가 없는 초경량 마크다운 블로그 미니멀로그입니다.',
    github: 'https://github.com/saigonkim',
  },

  // SEO 및 소셜 공유 정보 (오픈그래프용)
  seo: {
    locale: 'ko_KR',
    type: 'website',
    defaultOgImage: '/og-image.png', // public 폴더 기준 위치
  },

  // 검색 엔진 등록용 소유권 확인 토큰 (Google Search Console 등)
  verification: {
    google: 'E0NIEY5zxErpSAzgHUJcE1u9r90LNxtm7GoduBWhMZA',
  },
  
  // 광고 슬롯 활성화 여부
  ads: {
    enabled: true,
  }
};

export type BlogConfig = typeof blogConfig;
