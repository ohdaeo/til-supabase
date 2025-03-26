# Read

- src\app\actions\todos-actions.ts

```ts
"use server";

import { createServerSideClient } from "@/lib/supabase/server";
import { Database } from "@/types/types_db";

export type TodosRow = Database["public"]["Tables"]["todos"]["Row"];
export type TodosRowInsert = Database["public"]["Tables"]["todos"]["Insert"];
export type TodosRowUpdate = Database["public"]["Tables"]["todos"]["Update"];

// 자료 Creat 기능
export async function createTodo(todos: TodosRowInsert) {
  const supabase = await createServerSideClient();

  const { data, error, status } = await supabase
    .from("todos")
    .insert([{ title: todos.title, content: todos.content }])
    .select()
    .single();

  return { data, error, status };
}

// 목록 출력하기
export async function getTodos() {
  const supabase = await createServerSideClient();
  const { data: todos, error } = await supabase.from("todos").select("*");
  return { data: todos, error };
}
```

- src\components\common\navigation\SideNavigation.tsx

```tsx
"use client";

import { getTodos, TodosRow } from "@/app/actions/todos-actions";
import styles from "@/components/common/navigation/SideNavigation.module.scss";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { log } from "console";
import { Dot, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SideNavigation = () => {
  const [todos, setTodos] = useState<TodosRow[] | null>([]);

  const fetchGetTodos = async () => {
    const { data, error, status } = await getTodos();
    // 에러 발생시
    if (error) {
      toast.error("데이터조회실패", {
        description: `데이터조회에 실패하였습니다. ${error.message}`,
        duration: 3000,
      });
      return;
    }
    // 최종 데이터
    toast.success("데이터 조회 성공", {
      description: "데이터조회에 성공하였습니다",
      duration: 3000,
    });

    setTodos(data);
  };

  useEffect(() => {
    fetchGetTodos();
  }, []);

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
      {/* 추가항목 출력 영역 */}
      <div className={styles.container_todos}>
        <div className={styles.container_todos_label}>Your Todo</div>
        <div className={styles.container_todos_list}>
          {todos?.map((item) => (
            <div
              key={item.id}
              className="flex items-center py-2 bg-[#f5f5f4] rounded-sm cursor-pointer"
            >
              <Dot className="mr-1 text-green-400" />
              <span className="text-sm">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideNavigation;
```

# DB 칼럼 변경

- content 를 contents 이름 변경한다. (jsonb 타입)
- start_date 추가 (타입 timestamptz : now())
- end_date 추가 (타입 timestamptz : now())
- `npm run generate-types` 꼭 실행

# DB 변경으로 인한 데이터 추가 부분 수정

- src\components\common\navigation\SideNavigation.tsx

```tsx
"use client";

import { createTodo, getTodos, TodosRow } from "@/app/actions/todos-actions";
import styles from "@/components/common/navigation/SideNavigation.module.scss";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { log } from "console";
import { Dot, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createBrotliCompress } from "zlib";

const SideNavigation = () => {
  const [todos, setTodos] = useState<TodosRow[] | null>([]);

  //creat
  const onCreat = async () => {
    const { data, error, status } = await createTodo({
      title: "",
      contents: JSON.stringify([]),
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
    });
    if (error) {
      toast.error("데이터 추가 실패", {
        description: `데이터 추가에 실패하였습니다. ${error.message}`,
        duration: 3000,
      });
      return;
    }
    // 최종 데이터
    toast.success("데이터 추가 성공", {
      description: "데이터 추가에 성공하였습니다",
      duration: 3000,
    });
    // 데이터 추가 성공시 할일 등록 창으로 이동
    // 주소/creat/[data.id] 이동
  };

  // read
  const fetchGetTodos = async () => {
    const { data, error, status } = await getTodos();
    // 에러 발생시
    if (error) {
      toast.error("데이터조회실패", {
        description: `데이터조회에 실패하였습니다. ${error.message}`,
        duration: 3000,
      });
      return;
    }
    // 최종 데이터
    toast.success("데이터 조회 성공", {
      description: "데이터조회에 성공하였습니다",
      duration: 3000,
    });

    setTodos(data);
  };

  useEffect(() => {
    fetchGetTodos();
  }, []);

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
          onClick={onCreat}
          className="w-full text-orange-500 border-orange-400 hover:bg-orange-50 hover:text-orange-500"
        >
          Add New Page
        </Button>
      </div>
      {/* 추가항목 출력 영역 */}
      <div className={styles.container_todos}>
        <div className={styles.container_todos_label}>Your Todo</div>
        <div className={styles.container_todos_list}>
          {todos?.map((item) => (
            <div
              key={item.id}
              className="flex items-center py-2 bg-[#f5f5f4] rounded-sm cursor-pointer"
            >
              <Dot className="mr-1 text-green-400" />
              <span className="text-sm">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideNavigation;
```

1. 데이터 추가 후 할일 여러개 등록 페이지로 이동

- http://localhost:3000/create/[id] 로 이동처리
- app/create 파일들을 /app/create/[id] 폴더로 이동
- SideNavigation.tsx 라우터 추가

```tsx
// create
const onCreate = async () => {
  const { data, error, status } = await createTodo({
    title: "",
    contents: JSON.stringify([]),
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
  });
  // 에러 발생시
  if (error) {
    toast.error("데이터 추가 실패", {
      description: `데이터 추가에 실패하였습니다. ${error.message}`,
      duration: 3000,
    });
    return;
  }
  // 최종 데이터
  toast.success("데이터 추가 성공", {
    description: "데이터 추가에 성공하였습니다",
    duration: 3000,
  });
  console.log("등록된 id ", data.id);
  // 데이터 추가 성공시 할일 등록창으로 이동시킴
  // http://localhost:3000/create/ [data.id] 로 이동
  router.push(`/create/${data.id}`);
};
```

2. 상세페이지에서 params 를 알아내서 처리

- todo-action.ts : id 에 해당하는 Row 데이터를 읽어오기

```ts
// Read 기능 id 한개
export async function getTodoId(id: number) {
  const supabase = await createServerSideClient();
  const { data, error, status } = await supabase
    .from("todos")
    .select()
    .eq("id", id)
    .single();
  return { data, error, status } as {
    data: TodosRow | null;
    error: Error | null;
    status: number;
  };
}
```

- /src/app/create/[id]/page.tsx

```tsx
const { id } = useParams();
// id 에 해당하는 Row 데이터를 읽어오기
const fetchGetTodoId = async () => {
  const { data, error, status } = await getTodoId(Number(id));
  // 에러 발생시
  if (error) {
    toast.error("데이터 호출 실패", {
      description: `데이터 호출에 실패하였습니다. ${error.message}`,
      duration: 3000,
    });
    return;
  }
  // 최종 데이터
  toast.success("데이터 호출 성공", {
    description: "데이터 호출에 성공하였습니다",
    duration: 3000,
  });
};
useEffect(() => {
  fetchGetTodoId();
}, []);
```

3. id 에 해당하는 contents[] 안의 요소에 대한 타입 정의

```tsx
// contents 배열에 대한 타입 정의
interface BoardContent {
  isCompleted: boolean;
  title: string;
  content: string;
  startDate: string | Date;
  endDate: string | Date;
  boardId: string; // 랜던함 아이디를 생성해줄 예정
}
```

4. 화면에 각 보드에 출력시킬 state

```tsx
// 데이터 출력 state
const [title, setTitle] = useState<string | null>("");
const [contents, setContents] = useState<BoardContent[]>();
const [startDate, setStarDate] = useState<string | Date>("");
const [endDate, setEndDate] = useState<string | Date>("");
```

5. page 에서 add new board 를 선택 시 할일을 여러개 추가에

- src\app\create\[id]\page.tsx

```tsx
// 컨텐츠 추가하기
const onCreateContent = () => {
  // 기본으로 추가될 내용
  const addContent: BoardContent = {
    boardId: "1111",
    title: "",
    content: "",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    isCompleted: false,
  };
  const updateContent = [...contents, addContent];
  // 서버에 Row 를 업데이트 합니다.
  console.log(updateContent);
};
```

- todos-actions
- src\app\actions\todos-actions.ts

```ts
"use server";
import { createServerSideClient } from "@/lib/supabase/server";
import { Database } from "@/types/types_db";
export type TodosRow = Database["public"]["Tables"]["todos"]["Row"];
export type TodosRowInsert = Database["public"]["Tables"]["todos"]["Insert"];
export type TodosRowUpdate = Database["public"]["Tables"]["todos"]["Update"];

// Create 기능
export async function createTodo(todo: TodosRowInsert) {
  const supabase = await createServerSideClient();
  const { data, error, status } = await supabase
    .from("todos")
    .insert([
      {
        title: todo.title,
        contents: todo.contents,
        start_date: todo.start_date,
        end_date: todo.end_date,
      },
    ])
    .select()
    .single();

  return { data, error, status };
}
// Read 기능
export async function getTodos() {
  const supabase = await createServerSideClient();
  const { data, error, status } = await supabase.from("todos").select("*");
  return { data, error, status } as {
    data: TodosRow[] | null;
    error: Error | null;
    status: number;
  };
}

// Read 기능 id 한개
export async function getTodoId(id: number) {
  const supabase = await createServerSideClient();
  const { data, error, status } = await supabase
    .from("todos")
    .select()
    .eq("id", id)
    .single();
  return { data, error, status } as {
    data: TodosRow | null;
    error: Error | null;
    status: number;
  };
}

// Update 기능 id 한개
export async function updateTodoId(id: number, contents: string) {
  const supabase = await createServerSideClient();

  const { data, error, status } = await supabase
    .from("todos")
    .update({ contents: contents })
    .eq("id", id)
    .select()
    .single();

  return { data, error, status } as {
    data: TodosRow | null;
    error: Error | null;
    status: number;
  };
}
```

6. 목록 출력하기

- src\app\create\[id]\page.tsx

```tsx
{
  /* 본문 */
}
<div className={styles.container_body}>
  {/* conents 배열의 개수 만큼 출력이 되어야 함. */}
  {contents.length == 0 ? (
    <p>없음</p>
  ) : (
    <div>
      {contents.map((item) => (
        <BasicBoard key={item.boardId} />
      ))}
    </div>
  )}
</div>;
```

7. 랜덤 아이디 (boardId) 생성하기

```bash
npm i nanoid --legacy-peer-deps
```

```tsx
import { nanoid } from 'nanoid'

boardId: nanoid(),
```

8. 목록이 없는 경우 추가

- src\app\create\[id]\page.tsx

```tsx
{
  /* 본문 */
}
<div className={styles.container_body}>
  {/* conents 배열의 개수 만큼 출력이 되어야 함. */}
  {contents.length == 0 ? (
    <div className={styles.container_body_infoBox}>
      <span className={styles.title}>There is no board yet. </span>
      <span className={styles.subTitle}>
        Click the button and start flashing!
      </span>
      <button onClick={onCreateContent} className={styles.button}>
        <Image
          src="/assets/images/round-button.svg"
          alt="add board"
          width={100}
          height={100}
        />
      </button>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-start w-full h-full gap-4">
      {contents.map((item) => (
        <BasicBoard key={item.boardId} />
      ))}
    </div>
  )}
</div>;
```

9. 첫페이지에서 Row 추가하기

- src\app\page.tsx

```tsx
"use client";

import styles from "@/app/page.module.scss";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createTodo } from "./actions/todos-actions";
import { useRouter } from "next/navigation";

function Home() {
  const router = useRouter();

  // create
  const onCreate = async () => {
    const { data, error, status } = await createTodo({
      title: "",
      contents: JSON.stringify([]),
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
    });
    // 에러 발생시
    if (error) {
      toast.error("데이터 추가 실패", {
        description: `데이터 추가에 실패하였습니다. ${error.message}`,
        duration: 3000,
      });
      return;
    }
    // 최종 데이터
    toast.success("데이터 추가 성공", {
      description: "데이터 추가에 성공하였습니다",
      duration: 3000,
    });
    console.log("등록된 id ", data.id);
    // 데이터 추가 성공시 할일 등록창으로 이동시킴
    // http://localhost:3000/create/ [data.id] 로 이동
    router.push(`/create/${data.id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.container_onBoarding}>
        <span className={styles.container_onBoarding_title}></span>
        <div className={styles.container_onBoarding_steps}>
          <span>1. Create a page</span>
          <span>2. Add boards to page</span>
        </div>
        {/* 페이지 추가 버튼 */}
        <Button
          variant={"outline"}
          onClick={onCreate}
          className="w-full bg-transparent text-orange-500 border-orange-400 hover:bg-orange-50 hover:text-orange-500"
        >
          Add New page
        </Button>
      </div>
    </div>
  );
}

export default Home;

```
