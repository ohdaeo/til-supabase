# Blog

1. blog 접속시 목록 출력
2. 목록 선택시 blog/[id] 로 이동
3. 상세내용에서 삭제/수정 버튼 출력

## 폴더구조

1. list : src\app\blog\edit\page.tsx : 주소/blog
2. read : src\app\blog\[id]\page.tsx : 주소/blog/1
3. create : src\app\blog\create\page.tsx : 주소/blog/create
4. edit : src\app\blog\edit\[id]\page.tsx : 주소/blog/edit/1

### 1. List Page

- src\app\blog\page.tsx

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BlogsRow, getBlogs } from "@/app/actions/blog-action";

const Page = () => {
  const [blogs, setBlogs] = useState<BlogsRow[] | null>([]);

  const fetchGetBlogs = async () => {
    const { data, error, status } = await getBlogs();
    if (data) {
      setBlogs(data);
    }
  };

  useEffect(() => {
    fetchGetBlogs();
  }, []);

  return (
    <div className="w-[920px] h-screen bg-[#f9f9f9] border-r border-[#d6d6d6] flex items-start justify-center">
      <div className="w-full">
        <div>
          {blogs?.map((item) => (
            <div key={item.id}>
              <Link href={`/blog/${item.id}`}>{item.title}</Link>
            </div>
          ))}
        </div>
        <div>
          <Link href="/blog/create">생성</Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
```

### 2. Read Page

- src\app\blog\[id]\page.tsx

```tsx
"use client";

import { deleteBlog, getBlogId } from "@/app/actions/blog-action";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  // 무조건 id string 입니다.
  const { id } = useParams();
  const [title, setTitle] = useState<string | null>("");
  const [date, setDate] = useState<string>("");
  const [content, setContent] = useState<string | null>("");

  const fetchGetBlogId = async (_id: string) => {
    const { data, error, status } = await getBlogId(Number(_id));

    // 타입 가드 적용
    if (data) {
      setTitle(data.title);
      setDate(data.created_at);
      setContent(data.content);
    }
  };
  // 내용 삭제 : 이미지도 같이 삭제
  const deleteContent = async () => {
    console.log("이미지 삭제처리 필요");
    const { error, status } = await deleteBlog(Number(id));
    if (!error) {
      router.push("/blog");
    }
  };
  useEffect(() => {
    fetchGetBlogId(id as string);
  }, []);
  return (
    <div className="w-[920px] h-screen bg-[#f9f9f9] border-r border-[#d6d6d6] flex items-start justify-center">
      <div className="w-full flex flex-col p-4">
        <h1 className="w-full text-center text-xl mb-4 font-bold">Blog Read</h1>
        <div className="space-y-4">
          <div className="text-lg font-semibold mb-2">{title}</div>
          <div className="text-gray-600 text-sm mb-4">{date.split("T")[0]}</div>
          <div
            className="editor ProseMirror"
            dangerouslySetInnerHTML={{ __html: content || "" }}
          ></div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
            onClick={() => router.push(`/blog/edit/${id}`)}
          >
            수정
          </Button>
          <Button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors cursor-pointer"
            onClick={() => deleteContent()}
          >
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
```

### 3. Edit Page

- src\app\blog\edit\[id]\page.tsx

```tsx
import styles from "@/components/editor/editor.module.css";

import { BlogsRow, updateBlogId } from "@/app/actions/blog-action";
import { useEffect, useRef, useState } from "react";
import Toolbar from "./toolbar";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import { deleteFile, uploadFile } from "@/app/actions/blog-storage-action";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/utils/storage-utils";

const EditEditor = ({ blog }: { blog: BlogsRow }) => {
  const router = useRouter();
  // html 태그 참조
  const titleInputRef = useRef<HTMLInputElement>(null);

  const { id, content, title, created_at } = blog;
  const [tempTitle, setTempTitle] = useState<string>(title ? title : "");
  const [tempContent, setTempContent] = useState<string>(
    content ? content : ""
  );
  // 서버에 저장된 이미지 관리하는 법

  // 1. 삭제 예정 이미지 URL 을 저장하는 배열
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  // 2. 새로이 업로드 되는 이미지 URL 을 저장하는 배열
  const [newUploadImages, setNewUploadImages] = useState<string[]>([]);

  // 3. 기존 내용에서 포함된 Image URL 을 추출함.
  const handleImageDelete = async (imageUrl: string) => {
    console.log("handleImageDelete : ", imageUrl);
    // 사용자가 추가한 이미지 목록
    if (newUploadImages.includes(imageUrl)) {
      // 새로 업로드된 이미지인 경우
      setNewUploadImages((prev) => prev.filter((url) => url !== imageUrl));
      // 서버에서도 즉시 삭제
      const fileNameMatch = imageUrl.match(/([^\/]+)$/);
      if (fileNameMatch) {
        const fileName = fileNameMatch[1];
        await deleteFile(fileName);
      }
    } else {
      // 기존 이미지인 경우 삭제 예정 목록에 추가
      setImagesToDelete((prev) => [...prev, imageUrl]);
    }
  };

  useEffect(() => {
    console.log("삭제 예정 이미지 목록 : ", imagesToDelete);
  }, [imagesToDelete]);

  useEffect(() => {
    console.log("신규 업로드 예정 이미지 목록 : ", newUploadImages);
  }, [newUploadImages]);

  // Tiptap 에디터 생성
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
    content: tempContent,
    editorProps: {
      handleKeyDown: (view, event) => {
        if (event.key === "Delete" || event.key === "Backspace") {
          const { from, to } = view.state.selection;

          // 선택 영역이 있는 경우 (드래그 선택 또는 Ctrl+A)
          if (from !== to) {
            view.state.doc.nodesBetween(from, to, (node) => {
              if (node.type.name === "image") {
                const imageUrl = node.attrs.src;
                if (imageUrl.includes("supabase")) {
                  console.log("선택 영역 내 이미지 삭제:", imageUrl);
                  // 새글 등록시 진행했었던 부분
                  // deleteImageFromSupabase(imageUrl);
                  // 목록을 모은 구조
                  handleImageDelete(imageUrl);
                }
              }
              return true; // 계속 순회
            });
          } else {
            // 단일 위치에서의 삭제
            const pos = event.key === "Delete" ? from : from - 1;
            const node = view.state.doc.nodeAt(pos);

            if (node?.type.name === "image") {
              const imageUrl = node.attrs.src;
              if (imageUrl.includes("supabase")) {
                console.log("단일 이미지 삭제:", imageUrl);
                // 새글 등록시 진행했었던 부분
                // deleteImageFromSupabase(imageUrl);
                // 목록을 모은 구조
                handleImageDelete(imageUrl);
              }
            }
          }
        }
        return false; // 기본 키보드 동작 허용
      },
    },
  });

  // 사용자가 새로운 이미지를 추가할 때 실행되는 함수
  const handleImageUpload = async (file: File) => {
    console.log("이미지 업로드 시 :", file);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // uploadFile에 FormData 전달
      const result = await uploadFile(formData);

      // 이미지 URL 생성
      const imageUrl = getImageUrl(result?.path ?? "");

      // 새로 업로드된 이미지 URL 추적
      setNewUploadImages((prev) => [...prev, imageUrl]);

      return imageUrl;
    } catch (error) {
      console.error("Image upload error:", error);
      return null;
    }
  };

  // Supabase 에서 이미지 삭제하는 함수
  const deleteImageFromSupabase = async (imageUrl: string) => {
    console.log("삭제될 이미지 파일명 추출 : ", imageUrl);
    try {
      // URL에서 파일명만 추출
      const fileNameMatch = imageUrl.match(/([^\/]+)$/);
      if (fileNameMatch) {
        const fileName = fileNameMatch[1]; // "slide-3.png"
        console.log("Deleting image from Supabase:", fileName);
        await deleteFile(fileName); // await로 삭제 완료 대기
      }
    } catch (error) {
      console.error("Error deleting image from Supabase:", error);
    }
  };

  const handleSave = () => {
    // 업데이트

    if (!tempTitle.trim()) {
      alert("제목을 입력해 주세요.");
      // 태그에 포커스 이동시켜주기
      titleInputRef.current?.focus();
      return;
    }

    // getHtml 메서드 이용한 내용 파악
    const html = editor?.getHTML();
    // 내용이 비어있는지 체크
    const isEmpty = editor?.isEmpty;
    // 내용이 없다면
    if (isEmpty || !html?.trim()) {
      alert("내용을 입력해주세요.");
      editor?.commands.focus();
      return;
    }

    // 업데이트 진행
    fetchUpdateBolg();
  };

  const fetchUpdateBolg = async () => {
    // 1. 업데이트 하기전에 삭제 이미지들은 삭제 처리 부터 처리
    // 반복문으로 삭제 실행
    for (const imageUrl in imagesToDelete) {
      const fileNameMatch = imageUrl.match(/([^\/]+)$/);
      if (fileNameMatch) {
        const fileName = fileNameMatch[1];
        await deleteFile(fileName);
      }
    }

    // 2. blog 내용 업데이트
    const html = editor?.getHTML();
    const { data, error, status } = await updateBlogId(
      id,
      tempTitle,
      html as string
    );

    if (error) {
      alert(error.message);
      return;
    }

    if (data) {
      router.push(`/blog/${id}`);
    }
  };

  const handleCancel = async () => {
    // 취소
    // 현재 에디터 내용에서 모든 이미지 찾기
    if (editor) {
      const deletePromises: Promise<void>[] = [];

      editor.state.doc.descendants((node) => {
        if (node.type.name === "image") {
          const imageUrl = node.attrs.src;
          if (imageUrl.includes("supabase")) {
            console.log("작성 취소로 인한 이미지 삭제:", imageUrl);
            deletePromises.push(deleteImageFromSupabase(imageUrl));
          }
        }
        return true; // 계속 순회
      });

      // 모든 이미지 삭제 완료 대기
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
        console.log(`총 ${deletePromises.length}개의 이미지 삭제 완료`);
      }
    }
    router.push("/blog");
  };
  return (
    <div>
      <div>
        <input
          ref={titleInputRef}
          type="text"
          value={tempTitle}
          onChange={(e) => setTempTitle(e.target.value)}
          placeholder="제목을 입력하세요."
        />
      </div>
      <div className={styles.editor}>
        {editor && (
          <Toolbar editor={editor} onImageUpload={handleImageUpload} />
        )}
        <EditorContent
          editor={editor}
          onClick={() => editor?.commands.focus()}
        />
      </div>
      <div>
        <Button variant={"ghost"} type="button" onClick={handleSave}>
          수정
        </Button>
        <Button variant={"ghost"} type="button" onClick={handleCancel}>
          취소
        </Button>
      </div>
    </div>
  );
};

export default EditEditor;
```
