![supabase](https://img.icons8.com/?size=100&id=sH0rW2TvYdr9&format=png&color=000000)

# SupaBase 설치

### 1. .env 셋팅

- .env.local
- .env.production

### 2. 계정생성

[supabase](https://supabase.com/)

![SUPABASE_DB_PASSWORD](https://github.com/user-attachments/assets/e4686bec-e110-4ce5-af33-f15f47ba88e8)

![NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY](https://github.com/user-attachments/assets/8bbd8ad5-3075-4923-89d7-26288ada00b6)

![SUPABASE_SERVICE_ROLE](https://github.com/user-attachments/assets/edb1385f-c8d3-4ff9-ae94-881f62657c3b)

![NEXT_PUBLIC_SUPABASE_ID](https://github.com/user-attachments/assets/66358614-0292-45fb-9ab9-52b60764aab4)

### 3. 테이블 생성

### 4. Supabase CLI 설치

```bash
npm i supabase@">=1.8.1" --save-dev --legacy-peer-deps

npx supabase login

>>> supabase 로그인 후

npm i --save @supabase/ssr --legacy-peer-deps
npm install @supabase/supabase-js --legacy-peer-deps
```

5. 테이블의 데이터 타입 자동으로 생성

- package.json 수정

```json
"scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "generate-types": "npx supabase gen types typescript --project-id zhjtibjejrywuxogpfzl --schema public > src/types/types_db.ts"
  },

```

```bash
npm run generate-types
```

- src\types\types_db.ts <- 생성됨

### 6. Supabase 활용 관련 파일 생성

- src\lib\supabase\client.ts

```tsx
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/types_db";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- src\lib\supabase\server.ts

```tsx
"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createServerSideClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
```

### 7. Next.js 의 라우터 중간 처리 파일

- src\supabase\middleware.ts
  src_middleware.ts *를 지정하지 않은 경우 페이지가 낚아채지기 때문에
  임시로 *를 넣어준다.
