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

## Vercel Deoploy

**주의사항**

1. 환경변수 세팅하기

## 네이버 서치 어드바이저 등록하기

[Search Advisor](https://searchadvisor.naver.com/)

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
  other: {
    "naver-site-verification": "19f2bd8a123ea45b6f67c018910c8123b3a18dc45",
  },
};
```

- public\robots.txt

```txt
# *
User-agent: *
Allow: /

# Host
Host: https://til-supabase-omega.vercel.app

# Sitemaps
Sitemap: https://til-supabase-omega.vercel.app/sitemap.xml

```

- public\sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://til-supabase-omega.vercel.app">
<sitemap><loc>https://til-supabase-omega.vercel.app/sitemap-0.xml</loc></sitemap>
</sitemapindex>
```

- public\sitemap-0.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
<url><loc>https://til-supabase-omega.vercel.app</loc><lastmod>2023-09-11T23:52:17.732Z</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>
<url><loc>https://til-supabase-omega.vercel.app/blog</loc><lastmod>2023-09-11T23:52:17.732Z</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>
<url><loc>https://til-supabase-omega.vercel.app/todos</loc><lastmod>2023-09-11T23:52:17.732Z</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>
</urlset>
```
