import { ThemeProvider } from "@/components/theme-provider";
import TierList from "@/components/tierList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    // <ThemeProvider
    //   attribute="class"
    //   defaultTheme="dark"
    //   enableSystem
    //   disableTransitionOnChange
    // >
    //   <main className="flex min-h-screen flex-col items-center justify-between p-24">
    //     <p className=" font-bold text-6xl">TierList Maker</p>
    //     <Button>
    //       <Link href="/tier">Create a new tierlist</Link>
    //     </Button>
    //   </main>
    // </ThemeProvider>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <TierList />
    </ThemeProvider>
  );
}
