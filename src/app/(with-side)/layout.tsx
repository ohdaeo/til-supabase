import SideNavigation from "@/components/common/navigation/SideNavigation";
import { ReactNode } from "react";

// Supabase Server Side Client
import { createServerSideClient } from "@/lib/supabase/server";

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
