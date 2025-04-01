"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BlogsRow, deleteBlog, getBlogs } from "@/app/actions/blog-action";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogsRow[] | null>([]);
  const fetchGetBlogs = async () => {
    const { data, error, status } = await getBlogs();
    if (data) {
      setBlogs(data);
    }
  };
  // 내용 삭제 : 이미지도 같이 삭제
  const deleteContent = async (_id: number) => {
    console.log("이미지 삭제처리 필요");
    const { error, status } = await deleteBlog(_id);
    if (!error) {
      fetchGetBlogs();
    }
  };

  useEffect(() => {
    fetchGetBlogs();
  }, []);

  return (
    <div className="w-[920px] h-screen bg-[#f9f9f9] border-r border-[#d6d6d6] flex items-start justify-center">
      <div className="w-full p-5">
        <h1 className="w-full text-center items-center p-2 text-2xl">
          Blog List
        </h1>
        <div className="flex flex-col w-full items-center justify-center py-2">
          {blogs &&
            blogs.map((item) => (
              <div
                className="flex w-full items-center gap-4 p-2 rounded-lg border border-gray-200 shadow-sm bg-white my-1 px-2"
                key={item.id}
              >
                <Link
                  href={`/blog/${item.id}`}
                  className="w-full cursor-pointer"
                >
                  <p className="flex-1 text-sm font-medium">{item.title}</p>
                </Link>
                <div>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="cursor-pointer"
                    onClick={(e) => {
                      deleteContent(item.id);
                      e.stopPropagation();
                    }}
                  >
                    <Trash className="w-5 h-5 text-gray-400" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
        <div className="text-right">
          <Button
            variant={"outline"}
            onClick={() => router.push("/blog/create")}
            className="border border-orange-300 text-orange-600 hover:bg-orange-200 hover:text-orange-700 cursor-pointer"
          >
            생성
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Page;
