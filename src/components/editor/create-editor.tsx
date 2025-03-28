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
import { toast } from "sonner";

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
      title,
      content,
    });
    if (!title || !content) {
      toast.error("내용과 제목을 입력해주세요.");
      return;
    }

    toast.success("글이 성공적으로 등록되었습니다.");
    // 내용 초기화
    setTitle("");
    setContent("");
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
