"use server";
import { createServerSideClient } from "@/lib/supabase/server";
import { Database } from "@/types/types_db";
export type BlogsRow = Database["public"]["Tables"]["blog"]["Row"];
export type BlogsRowInsert = Database["public"]["Tables"]["blog"]["Insert"];
export type BlogsRowUpdate = Database["public"]["Tables"]["blog"]["Update"];

// Create 기능
export async function createBlog(blog: BlogsRowInsert) {
  const supabase = await createServerSideClient();
  // 현재 로그인한 사용자 정보 가져오기
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      data: null,
      error: userError || new Error("User not authenticated"),
      status: 401,
    };
  }
  const { data, error, status } = await supabase
    .from("blog")
    .insert([
      {
        title: blog.title,
        content: blog.content,
        user_id: user.id,
        user_email: user.email,
      },
    ])
    .eq("user_id", user.id) // 로그인 사용자 정보
    .select()
    .single();

  return { data, error, status };
}
// Read 기능
export async function getBlogs() {
  const supabase = await createServerSideClient();
  // 현재 로그인한 사용자 정보 가져오기
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      data: null,
      error: userError || new Error("User not authenticated"),
      status: 401,
    };
  }

  const { data, error, status } = await supabase
    .from("blog")
    .select("*")
    .eq("user_id", user.id) // 로그인 사용자 정보
    .order("id", { ascending: false });

  return { data, error, status } as {
    data: BlogsRow[] | null;
    error: Error | null;
    status: number;
  };
}

// Read 기능 id 한개
export async function getBlogId(id: number) {
  const supabase = await createServerSideClient();
  // 현재 로그인한 사용자 정보 가져오기
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      data: null,
      error: userError || new Error("User not authenticated"),
      status: 401,
    };
  }

  const { data, error, status } = await supabase
    .from("blog")
    .select()
    .eq("user_id", user.id) // 로그인 사용자 정보
    .eq("id", id)
    .single();
  return { data, error, status } as {
    data: BlogsRow | null;
    error: Error | null;
    status: number;
  };
}

// Update 기능 id 한개
export async function updateBlogId(id: number, title: string, content: string) {
  const supabase = await createServerSideClient();
  // 현재 로그인한 사용자 정보 가져오기
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      data: null,
      error: userError || new Error("User not authenticated"),
      status: 401,
    };
  }

  const { data, error, status } = await supabase
    .from("blog")
    .update({ content: content, title: title })
    .eq("user_id", user.id) // 로그인 사용자 정보
    .eq("id", id)
    .select()
    .single();

  return { data, error, status } as {
    data: BlogsRow | null;
    error: Error | null;
    status: number;
  };
}

// Row 삭제 기능
export async function deleteBlog(id: number) {
  const supabase = await createServerSideClient();
  // 현재 로그인한 사용자 정보 가져오기
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      data: null,
      error: userError || new Error("User not authenticated"),
      status: 401,
    };
  }

  const { error, status } = await supabase
    .from("blog")
    .delete()
    .eq("user_id", user.id) // 로그인 사용자 정보
    .eq("id", id);

  return { error, status } as {
    error: Error | null;
    status: number;
  };
}
