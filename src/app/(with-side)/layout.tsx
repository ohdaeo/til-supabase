import SideNavigation from "@/components/common/navigation/SideNavigation";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Blog Supabase",
  openGraph: {
    title: "Blog",
    description: "Blog Supabase",
    images: [{ url: "/thumbnail.png" }],
  },
  other: {
    "naver-site-verification": "fbe25f61699068bf21f52c481fe3ad7a14f03747",
  },
};

// Supabase Server Side Client
import { createServerSideClient } from "@/lib/supabase/server";
import { Metadata } from "next";

export default async function Layout({ children }: { children: ReactNode }) {
  const supabase = await createServerSideClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(" session", user);
  console.log("user_metadata", user?.user_metadata);

  return (
    <>
      <SideNavigation user={user} />
      <div>{children}</div>
    </>
  );
}
