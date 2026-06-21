---
title: "나의 첫 번째 초경량 블로그 포스트"
date: "2026-06-20"
description: "DB 없이 마크다운 파일로만 구동되는 미니멀 블로그 개발기입니다."
tags: ["Nextjs","VibeCoding","Minimal"]
---


여기서부터는 본문 내용입니다.

이 블로그는 Next.js App Router와 로컬 파일 시스템(.md)을 연결하여 구축된 초경량 블로그입니다. 
데이터베이스 연결도 없고, 복잡한 관리 툴도 필요 없습니다. 오직 마크다운 파일만 생성하고 편집하면 됩니다.

## 특징

1. **DB Free**: 유지보수 비용이 0원입니다.
2. **Markdown native**: 글 작성이 편리하며 이식성이 높습니다.
3. **Ultra Lightweight**: Tailwind CSS와 Next.js 정적 렌더링으로 극도로 빠릅니다.

### 이미지 렌더링 테스트
![대체 텍스트](/images/photo.jpg)

### 링크 활성화 테스트
이것은 [구글 바로가기](https://google.com) 링크입니다.

### 코드 하이라이팅 테스트
```javascript
const greet = (name) => {
  console.log(`Hello, ${name}! Welcome to MinimaLog.`);
};
greet("Developer");
```

