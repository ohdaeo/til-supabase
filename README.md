# Create

```bash
npx shadcn@latest add sonner
```

### 2. Toast 적용하기

- src\app\layout.tsx

```tsx
// shadcn/ui
import { Toaster } from "@/components/ui/sonner";

<body className={`${roboto.variable} antialiased`}>
  <SideNavigation />
  {children}
  <Toaster />
</body>;
```

### 3. Toast 출력하기

- src\components\common\dialog\MarkdownDialog.tsx

```tsx
"use client";

import styles from "@/components/common/dialog/MarkdownDialog.module.scss";
import { Button } from "@/components/ui/button";

// Markdown Editor
import MDEditor from "@uiw/react-md-editor";

// shadcn
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@radix-ui/react-checkbox";
import LabelCalendar from "../calendar/LabelCalendar";
import { useState } from "react";
import { toast } from "sonner";

const MarkdownDialog = () => {
  // 에디터의 내용
  const [content, setContent] = useState<string | undefined>("");
  const [title, setTitle] = useState<string | undefined>("");

  // todo 작성
  const onSubmit = () => {
    if (!title || !content) {
      toast.error("없잖수", {
        description: "아무것도 없잖수",
        duration: 3000,
      });
      return;
    }
    toast.success("됐슈", {
      description: "글이 등록 됐잖슈",
      duration: 3000,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="w-full block text-center font-normal text-gray-400 hover:text-gray-500 cursor-pointer">
          Add Content
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-fit min-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            <div className={styles.dialog_titleBoc}>
              <Checkbox className="w-5 h-5" />
              <input
                type="text"
                placeholder=" Write a title for your board"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.dialog_titleBox_title}
              />
            </div>
          </DialogTitle>
          <div className={styles.dialog_calendarBox}>
            <LabelCalendar label="From" required={false} />
            <LabelCalendar label="To" required={false} />
          </div>
          <Separator />
          {/* 마크다운 입력 영역 */}
          <div className={styles.dialog_markdown}>
            <MDEditor height={"100%"} value={content} onChange={setContent} />
          </div>
        </DialogHeader>

        <DialogFooter>
          <div className={styles.dialog_buttonBox}>
            <Button
              variant={"ghost"}
              className="font-normal text-gray-400 hover:text-gray-500 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              variant={"ghost"}
              onClick={onSubmit}
              className="font-normal border-orange-500 bg-orange-400 text-white hover:bg-orange-500 hover:text-white"
            >
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MarkdownDialog;
```

### 4. Supabase 연동하기 - actions 생성

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
```

- src\components\common\dialog\MarkdownDialog.tsx
