<svg role="img" viewBox="0 0 24 24" width="100" xmlns="http://www.w3.org/2000/svg"><title>shadcn/ui</title><path d="M22.219 11.784 11.784 22.219c-.407.407-.407 1.068 0 1.476.407.407 1.068.407 1.476 0L23.695 13.26c.407-.408.407-1.069 0-1.476-.408-.407-1.069-.407-1.476 0ZM20.132.305.305 20.132c-.407.407-.407 1.068 0 1.476.408.407 1.069.407 1.476 0L21.608 1.781c.407-.407.407-1.068 0-1.476-.408-.407-1.069-.407-1.476 0Z"/></svg>

# shadcn ui

[shadcn UI](https://ui.shadcn.com/)

### 설치

```bash

npx shadcn@latest init

Ok to proceed? (y)

√ Which color would you like to use as the base color? » Neutral

√ How would you like to proceed? » Use --legacy-peer-deps

Success! Project initialization completed.
You may now add components.
```

[sass](https://nextjs.org/docs/app/building-your-application/styling/sass)

```bash
npm install --save-dev sass
```

#### 기본 예제

1. 페이지 만들기

- src\app\page.tsx

```tsx
import styles from "@/app/page.module.scss";

function page() {
  return (
    <div className={styles.container}>
      <div className={styles.container_onBoarding}>
        <span className={styles.container_onBoarding_title}></span>
        <div className={styles.container_onBoarding_steps}>
          <span>1. Create a page</span>
          <span>2. Add boards to page</span>
        </div>
        {/* 페이지 추가 버튼 */}
      </div>
    </div>
  );
}

export default page;
```

- src\app\page.module.scss

  **주의사항**
  Watching 꼭 클릭하기 ! !!

2. 버튼 컴포넌트 설치하기

```bash
npx shadcn@latest add button
```

- src\components\ui\button.tsx ⬅ 생성됨.

```tsx
<Button
  variant={"outline"}
  className="w-full bg-transparent text-orange-500 border-orange-400 hover:bg-orange-50 hover:text-orange-500"
>
  Add New page
</Button>
```

3. 글꼴 설정하는 방법

```tsx
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Todo",
  description: "Todo supbase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${roboto.variable} antialiased`}>{children}</body>
    </html>
  );
}
```

4. globals.css 설정하기

- src\app\globals.css

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    @apply bg-background text-foreground;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
}
```

#### 심화예제

1. navigation 레이아웃

- src\app : page 관련 사항
- /src/components 폴더 활용
- `/src/components/common/navigation/SideNavigation.tsx 파일 생성`
- `/src/components/common/navigation/SideNavigation.module.scss 파일 생성`

2. SideNavigation 작업
   [lucide](https://lucide.dev/icons)

- src\components\common\navigation\SideNavigation.tsx

```tsx
import styles from "@/components/common/navigation/SideNavigation.module.scss";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SideNavigation = () => {
  return (
    <div className={styles.container}>
      {/* 검색창 */}
      <div className={styles.container_search_searchBox}>
        <Button variant={"outline"} size={"icon"}>
          <Search className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default SideNavigation;
```

3. layout 배치

- src\app\layout.tsx

```tsx
return (
  <html lang="ko">
    <body className={`${roboto.variable} antialiased`}>
      <SideNavigation />
      {children}
    </body>
  </html>
);
```

4. shadcn input 배치
   [shadcn input](https://ui.shadcn.com/docs/components/input)

```bash
npx shadcn@latest add input
```

- src\components\common\navigation\SideNavigation.tsx

```tsx
import styles from "@/components/common/navigation/SideNavigation.module.scss";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SideNavigation = () => {
  return (
    <div className={styles.container}>
      {/* 검색창 */}
      <div className={styles.container_searchBox}>
        <Input
          type="text"
          placeholder="검색어를 입력하세요"
          className="focus-visible:right"
        />
        <Button variant={"outline"} size={"icon"}>
          <Search className="w-4 h-4" />
        </Button>
      </div>
      {/* page 추가 버튼 */}
      <div className={styles.container_buttonBox}>
        <Button
          variant={"outline"}
          className="w-full text-orange-500 border-orange-400 hover:bg-orange-50 hover:text-orange-500"
        >
          Add New Page
        </Button>
      </div>
    </div>
  );
};

export default SideNavigation;
```
