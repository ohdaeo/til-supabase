# KKO 인증

[참조](https://www.youtube.com/watch?v=iWQEK8pS2kU)

[개발자 센터](https://developers.kakao.com/)

1. Rest Api, Secret Code, Redirect URI 설정

## 진행순서

### 1. 카카오 로그인 코드 추가

- src\lib\supabase\actions.ts

```ts
const signInWithKakao = signInWith("kakao");

export { signInWithGoogle, signInWithKakao, signOut };
```

### 2. 카카오 로그인 버튼 추가

- src\components\auth\loginform.tsx

```tsx
"use client";

import { signInWithGoogle, signInWithKakao } from "@/lib/supabase/actions";

const handleKakaoLogin = async () => {
  try {
    setIsLoading(true);
    await signInWithKakao();
    toast.success("로그인 성공!", {
      description: "메인 페이지로 이동합니다.",
    });

    // router.push("/dashboard");
    // router.refresh();
  } catch (error) {
    toast.error("로그인 실패", {
      description: "Kakao 로그인 중 오류가 발생했습니다.",
    });
  } finally {
    setIsLoading(false);
  }
};

<Button
  variant="outline"
  type="button"
  className="w-full"
  onClick={handleKakaoLogin}
  disabled={isLoading}
>
  Kakao로 계속하기
</Button>;
```
