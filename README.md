# tiptap 내용 supabase 에 저장하기

## UI 추가하기

- src\components\editor\create-editor.tsx

```tsx
"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// css
import styles from "@/components/editor/editor.module.css";

// extension : 내용 정렬
import TextAlign from "@tiptap/extension-text-align";
// extension : color
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
// extension : code block, background
import { common, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
// extension : Link
import Link from "@tiptap/extension-link";
// extension : Image
import Image from "@tiptap/extension-image";

import Toolbar from "./toolbar";
// Sahdcn
import { Button } from "@/components/ui/button";

export const CreateEditor = () => {
  // 배경색
  const lowlight = createLowlight(common);
  const CustomHighlight = Highlight.configure({
    multicolor: true,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph", "blockquote"],
        alignments: ["left", "center", "right"],
      }),
      Color,
      TextStyle,
      CodeBlockLowlight.configure({
        lowlight: lowlight,
      }),
      CustomHighlight,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "cursor-pointer text-blue-500 hover:underline",
        },
      }),

      Image,
    ],
    content: "<p>안녕하세요.</p>",
  });
  return (
    <div className="w-[95%] flex flex-col bg-white my-3 p-3">
      <h3>블로그 작성하기</h3>
      <div className="w-full flex-col items-center justify-center">
        <div className="w-full my-2">
          <input className="w-full p-2 border-2 border-gray-300 rounded-md" />
        </div>
        <div className={styles.editor}>
          {editor && <Toolbar editor={editor} />}
          <EditorContent editor={editor} />
        </div>
        <div className="flex w-full items-center justify-center p-2">
          <Button type="button" className="px-4 py-2">
            Add Blog
          </Button>
        </div>
      </div>
    </div>
  );
};
```

- src\components\editor\editor.module.css

# Supabase 테이블 추가

- blog 테이블 및 blog-data 저장소 생성

```bash
npm run generate-types
```

## 블로그용 액션 추가하기

- src\app\actions\blog-action.ts

```ts
"use-server";

import { createServerSideClient } from "@/lib/supabase/server";
import { Database } from "@/types/types_db";
export type TodosRow = Database["public"]["Tables"]["blog"]["Row"];
export type TodosRowInsert = Database["public"]["Tables"]["blog"]["Insert"];
export type TodosRowUpdate = Database["public"]["Tables"]["blog"]["Update"];

// Create 기능
export async function createBlog(blog: TodosRowInsert) {
  const supabase = await createServerSideClient();
  const { data, error, status } = await supabase
    .from("blog")
    .insert([
      {
        title: blog.title,
        content: blog.content,
      },
    ])
    .select()
    .single();

  return { data, error, status };
}
// Read 기능
export async function getBlogs() {
  console.log("getblogs =============");
  const supabase = await createServerSideClient();
  const { data, error, status } = await supabase
    .from("blog")
    .select("*")
    .order("id", { ascending: false });
  return { data, error, status } as {
    data: TodosRow[] | null;
    error: Error | null;
    status: number;
  };
}

// Read 기능 id 한개
export async function getBlogId(id: number) {
  const supabase = await createServerSideClient();
  const { data, error, status } = await supabase
    .from("blog")
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
export async function updateBlogId(id: number, title: string, content: string) {
  const supabase = await createServerSideClient();

  const { data, error, status } = await supabase
    .from("blog")
    .update({ title: title, content: content })
    .eq("id", id)
    .select()
    .single();

  return { data, error, status } as {
    data: TodosRow | null;
    error: Error | null;
    status: number;
  };
}
// Title 업데이트 함수

// Update 기능 id 한개
export async function updateTodoIdTitle(
  id: number,
  title: string,
  startDate: Date | undefined,
  endDate: Date | undefined
) {
  const supabase = await createServerSideClient();

  const { data, error, status } = await supabase
    .from("todos")
    .update({
      title: title,
      start_date: startDate?.toISOString(),
      end_date: endDate?.toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  return { data, error, status } as {
    data: TodosRow | null;
    error: Error | null;
    status: number;
  };
}
// Row 삭제 기능
export async function deleteBlog(id: number) {
  const supabase = await createServerSideClient();
  const { error, status } = await supabase.from("blog").delete().eq("id", id);

  return { error, status } as {
    error: Error | null;
    status: number;
  };
}
```

## Row 추가하기 적용

- create-editor.tsx

```tsx
"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// css
import styles from "@/components/editor/editor.module.css";

// extension : 내용 정렬
import TextAlign from "@tiptap/extension-text-align";
// extension : color
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
// extension : code block, background
import { common, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
// extension : Link
import Link from "@tiptap/extension-link";
// extension : Image
import Image from "@tiptap/extension-image";

import Toolbar from "./toolbar";
// Sahdcn
import { Button } from "@/components/ui/button";
import { createBlog } from "@/app/actions/blog-action";
import { useState } from "react";

export const CreateEditor = () => {
  // 내용
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  // 배경색
  const lowlight = createLowlight(common);
  const CustomHighlight = Highlight.configure({
    multicolor: true,
  });
  // 에디터
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph", "blockquote"],
        alignments: ["left", "center", "right"],
      }),
      Color,
      TextStyle,
      CodeBlockLowlight.configure({
        lowlight: lowlight,
      }),
      CustomHighlight,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "cursor-pointer text-blue-500 hover:underline",
        },
      }),
      Image,
    ],
    content: content, // 초기값
    // 내용 갱신시 실행
    onUpdate({ editor }) {
      // 내용읽기
      setContent(editor.getHTML());
    },
  });

  const onSubmit = async () => {
    const { data, error, status } = await createBlog({
      content: content,
      title: title,
    });
    console.log(data);
    console.log(error);
    console.log(status);
  };

  return (
    <div className="w-[95%] flex flex-col bg-white my-3 p-3">
      <h3>블로그 작성하기</h3>
      <div className="w-full flex-col items-center justify-center">
        <div className="w-full my-2">
          <input
            className="w-full p-2 border-2 border-gray-300 rounded-md"
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.editor}>
          {editor && <Toolbar editor={editor} />}
          <EditorContent editor={editor} />
        </div>
        <div className="flex w-full items-center justify-center p-2">
          <Button type="button" className="px-4 py-2" onClick={onSubmit}>
            Add Blog
          </Button>
        </div>
      </div>
    </div>
  );
};
```
