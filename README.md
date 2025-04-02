![react-query](https://ckck803.github.io/images/react/react-query/react-query.png)

# React Query

[TanStack Query](https://tanstack.com/query/v5)
[TanStack Query Overview](https://tanstack.com/query/v5/docs/framework/react/overview)

## 셋팅

1. TanStack Query 설치

```bash
npm install @tanstack/react-query --legacy-peer-deps
```

2. DevTool 설치

```bash
npm i @tanstack/react-query-devtools --legacy-peer-deps
```

## 개념

- 데이터를 쉽게 가져오고, 자동으로 업데이트해 주는 도구 라이브러리입니다.
- `fresh` 한 데이터 : 최신 데이터
- `stale` 한 데이터 : 기존 데이터 (상해버린 데이터)
- 서버 상태를 불러오고, 캐싱하고, 지속적으로 동기화하고 업데이트 도움 라이브러리
- 캐싱기능과, Window Focus Reftching 등의 기능이 존재

## 환경설정

### 1. ReactQueryProvider 생성

- src\providers\ReactQueryProvider.tsx

```tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const queryClient = new QueryClient();
export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Dev Tool : React Query DevTools 를 셋팅 */}
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
  );
}
```

### 2. ReactQueryProvider 적용하기

앱 전체에 활용할 것

- src\app\layout.tsx

```tsx
import ReactQueryProvider from "@/providers/ReactQueryProvider";

return (
  <html lang="ko">
    <body className={`${roboto.variable}  antialiased`}>
      <ReactQueryProvider>{children}</ReactQueryProvider>
      <Toaster />
    </body>
  </html>
);
```

### 3. 기본예제

1. Server Action 생성하기

- src\app\actions\test-action.ts

```tsx
"use server";

const TODOS: string[] = [];
// 할일 목록 가져오기
export const getTodos = async (): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return TODOS;
};

// 할일 목록 추가하기
export const createTodos = async (data: string): Promise<string[]> => {
  // 서버 지연효과 (1초)
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // 새로운 todo를 추가합니다
  TODOS.push(data);
  return TODOS;
};
```

2. test router 생성하기

- 주소/test
- src\app\test\page.tsx

```tsx
export default function Page() {
  return (
    <div>
      <h1>Test Todo</h1>
    </div>
  );
}
```

3. **useQuery** 활용하기

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { getTodos } from "../actions/test-action";

export default function Page() {
  // 데이터 가져오기
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["uniq"],
    queryFn: getTodos,
  });

  return (
    <div>
      <h1>Test Todo</h1>
      {isLoading && <div>데이터 로딩중 . . .</div>}
      {error && <div>에러가 발생했습니다. error code : {error.message}</div>}
      {data && (
        <div>
          {data.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**const { data, isLoading, error, refetch } = useQuery()**

data - 가져온 데이터 (성공 시 데이터 저장)
isLoading - 데이터를 가지고 오는 중일경우 true
error - 에러가 발생하면 에러 정보가 담겨있음
refetch - 데이터를 다시 가져오도록 함수 호출

```tsx
<button onClick={() => refetch()}>다시 호출하기</button>
```

**옵션 설명**

1. queryKey

- 데이터를 구분하기 위한 이름 값 (유일값) ,
- 중복된 이름이여도 요청은 한번만 하기 때문에 의미없는 API 호출을 방지한다.
- 각 사용자 별 목록을 별도로 관리할수 있다.

```tsx
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["uniq", userId],
  // 유저 아이디의 값이 1인경우 queryKey의 값은 ["uniq", 1]이 된다.
  queryFn: getTodos,
});
```

2. staleTime

- 일정한 시간만큼 데이터를 가져오지않는다.
- 일정한 시간 동안 캐싱되어있는 데이터를 사용한다.

```tsx
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["uniq"],
  queryFn: getTodos,
  staleTime: 5000,
});
```

3. refetchInterval

- 일정한 시간만큼 데이터를 가져오지않는다.
- 일정한 시간 동안 캐싱되어있는 데이터를 사용한다.

```tsx
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["uniq"],
  queryFn: getTodos,
  refetchInterval: 5000,
});
```

4. enabled

- 조건에 따라서 true 인 경우 데이터를 가져온다.

```tsx
// 데이터 가져오기
const [isFetch, setIsFetch] = useState<boolean>(false);
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["uniq"],
  queryFn: getTodos,
  enabled: isFetch,
});
```

5. refetchOnWindowFocus

- 웹브라우저 윈도우가 포커스 된 경우 데이터 새로고침 여부

```tsx
// 데이터 가져오기
const [isFetch, setIsFetch] = useState<boolean>(false);
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["uniq"],
  queryFn: getTodos,
  refetchOnWindowFocus: true,
});
```

6. refetchOnMount

- 마운트 될 때 데이터를 새로고침 한다.

```tsx
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["uniq"],
  queryFn: getTodos,
  refetchOnMount: true,
});
```

7. refetchOnReconnect

- 네트워크가 다시 연결 될 때 데이터를 새로고침 한다.

```tsx
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["uniq"],
  queryFn: getTodos,
  refetchOnReconnect: true,
});
```

8. refetchIntervalInBackground

- 배경에서 데이터를 새로고침 한다.

```tsx
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["uniq"],
  queryFn: getTodos,
  refetchIntervalInBackground: true,
});
```

9. gcTime

- 데이터를 캐시에 보관하는 시간을 의미한다

```tsx
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["uniq"],
  queryFn: getTodos,
  gcTime: 1000 * 60 * 5, // 5분
});
```

10. retry

- 데이터를 가져오다 실패했을 경우 재실행할 횟수

```tsx
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["uniq"],
  queryFn: getTodos,
  retry: 3,
});
```

11. retryDelay

- 재실행 대기 시간

```tsx
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["uniq"],
  queryFn: getTodos,
  retry: 3,
  retryDelay: 3000,
});
```

### 4. useMutation()

- 데이터를 생성, 수정, 삭제 등의 작업을 처리한다.
- 데이터를 변경하는 작업.
- mutaion.mutate(데이터) 데이터를 서버로 보내는 경우 `createMutaion.mutate()`
- mutaion.data : 성공 시 반환되는 데이터
- mutaion.isLoading : 서버 작업 요청 중이면 `true`
- mutaion.isError : 에러가 발생하면 `true`
- mutaion.isSuccess : 성공하면 `true`
- mutaion.isPending : 연결 시도중이면 `true`

- src\app\test\page.tsx

```tsx
"use client";

import { useState } from "react";
import { createTodos, getTodos } from "@/app/actions/test-action";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [testInput, setTestInput] = useState<string>("");

  // 데이터 가져오기
  const [isFetch, setIsFetch] = useState<boolean>(false);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["uniq"],
    queryFn: getTodos,
    retryDelay: 3000,
  });

  // 데이터 추가하기
  const createMutaion = useMutation({
    mutationFn: async () => {
      if (testInput.trim() === "") {
        alert("할일을 입력 해 주세요");
        return;
      }
      await createTodos(testInput);
    },
    onSuccess: () => {
      setTestInput("");
      refetch();
    },
    onError: (error) => {
      console.log("데이터 추가 실패", error.message);
    },
  });

  return (
    <div>
      <h1>Test Todo</h1>
      <div>
        <input
          type="text"
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
        <Button
          disabled={createMutaion.isPending}
          onClick={() => createMutaion.mutate()}
          className="ml-2"
        >
          {createMutaion.isPending ? "추가중" : "할일추가"}
        </Button>
      </div>
      <div>
        <Button onClick={() => refetch()}>다시 호출하기</Button>
      </div>
      {isLoading && <div>데이터 로딩중 . . .</div>}
      {error && <div>에러가 발생했습니다. error code : {error.message}</div>}
      {data && (
        <div>
          {data.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

1. onSuccss 성공 후 실행함수

```tsx
// 데이터 추가하기
const createMutaion = useMutation({
  onSuccess: () => {
    setTestInput("");
    refetch();
  },
});
```

2. onError 실패 시 실행 핸들러

```tsx
const createMutaion = useMutation({
onError: (error) => {
  console.log("데이터 추가 실패", error.message);
};
})
```

3. onSettled 성공, 실패 상관없이 무조건 실행

```tsx
const createMutaion = useMutation({
  onSettled: () => {
    console.log("어떠한 상황에서도 실행된다");
  },
});
```

4. mutateAsync 비동기 실행

```tsx
// mutateAsync 사용하기
const mutation = useMutation({
  mutationFn: createTodos,
});
const handleAdd = async () => {
  try {
    const now = await mutation.mutateAsync("Add Todo");
    console.log("데이터", now);
    queryClient.refetchQueries({ queryKey: ["uniq"] });
  } catch (error) {
    console.log("error", error);
  }
};
```
