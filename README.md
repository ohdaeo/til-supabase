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

![Image](https://github.com/user-attachments/assets/592e9aca-5a23-45f2-bada-f188cbeea7f1)
![Image](https://github.com/user-attachments/assets/8ce14679-f32a-4b59-9c62-df455b3260a4)
![Image](https://github.com/user-attachments/assets/79e0d0b2-0de0-4e8e-bef3-8ae854db8148)

2. Supabase SNS 로그인 vercel 에 적용하기

[Google Cloud](https://cloud.google.com/developers?hl=ko)

![Image](https://github.com/user-attachments/assets/bdb7291b-4e1f-41a4-892f-ea5d8301260e)
![Image](https://github.com/user-attachments/assets/83789596-35eb-4945-96f6-ae42dcf6b2ff)
![Image](https://github.com/user-attachments/assets/8d807b57-5235-45ce-89b8-7b05a38b7154)
![Image](https://github.com/user-attachments/assets/a89c5091-55d0-47d0-99ab-e925aef32749)

## 네이버 서치 어드바이저 등록하기

[Search Advisor](https://searchadvisor.naver.com/)

![Image](https://github.com/user-attachments/assets/94a33025-1de0-45ad-bc8d-bf2ebb70ca76)
![Image](https://github.com/user-attachments/assets/1c1042fe-aabe-4890-abbc-8e3fa1a26c7a)
![Image](https://github.com/user-attachments/assets/8f3ffb73-37d2-49c0-80bf-9e97a16e6b22)

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

![Image](https://github.com/user-attachments/assets/d62647fc-3b3d-4d7c-97d5-6c91b768ea04)
![Image](https://github.com/user-attachments/assets/31c54362-eef6-45b0-b503-12cd08358df4)

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

## 구글 검색 엔진 등록하기

[google search-console](https://search.google.com/search-console/about)

![Image](https://github.com/user-attachments/assets/2a73e3cf-f221-4d59-8b7b-4373bdb8f7f8)
![Image](https://github.com/user-attachments/assets/63125e06-bcbd-416c-849c-df2c7fa130a7)

**선택사항**
![Image](https://github.com/user-attachments/assets/946762dc-1f58-466d-80a0-971bbf7110d0)

파일 업로드 형식 : public\google48ff0047aa45c5d9.html 파일 저장

태그 업로드 형식 :

- src\app\layout.tsx

```tsx
other: {
    "naver-site-verification": "19f2bd8a317ea75b6f21c013056c817b3a18dc86",
    "google-site-verification": "Of5oAjxfTAPJP3XewbIBdKzIgAqOtwLTr5XcJrJUz60",
  },
```

![Image](https://github.com/user-attachments/assets/8504c3ac-2f76-4d70-927f-c5badeba15cc)

**로그인 안해도 xml, robots.txt 접근**

- src\middleware.ts

```ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sitemap-0.xml.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- src\app\auth\callback\route.ts

```ts
import { NextRequest, NextResponse } from "next/server";
import { createServerSideClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createServerSideClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // 👇 여기가 추가된 에러 메시지 반환 부분입니다
      return new Response("❌ Supabase 인증 에러: " + error.message, {
        status: 500,
      });
    }

    // ✅ 성공 시 정상 리디렉션 처리
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";

    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${next}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // code 값 자체가 없는 경우
  return new Response("❌ 인증 코드 없음 (Missing ?code=)", {
    status: 400,
  });
}
```
