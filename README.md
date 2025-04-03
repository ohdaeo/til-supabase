# SEO

1. 썸네일

- public\thumbnail.png

2. 파비콘

- src\app\favicon.ico

## 시작하기

#### 1. 메타데이터 설정하기 (기본)

- src\app\layout.tsx

```tsx
export const metadata: Metadata = {
  title: "Todo",
  description: "Todo Supabase",
  openGraph: {
    title: "Todo",
    description: "Todo Supabase",
    images: [{ url: "/thumbnail.png" }],
  },
};
```

#### 2. 페이지별 메타데이터 설정하기

src\app\(with-side)\layout.tsx

```tsx
export const metadata: Metadata = {
  title: "Blog",
  description: "Blog Supabase",
  openGraph: {
    title: "Blog",
    description: "Blog Supabase",
    images: [{ url: "/thumbnail.png" }],
  },
};
```

#### 3. 동적 페이지 메타데이터 설정

_next-15 깃허브 (deploy) 부분 참고하기_

## Vercel
