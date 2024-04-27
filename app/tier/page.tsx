'use client'
import { ImageUpload } from "@/components/imageCropper";
import TierList from "@/components/tierList";
import { ModeToggle } from "@/components/ui/modeToggleButton";
import { ThemeProvider } from "next-themes";

const Page = () => {
  return (
    <div>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ModeToggle />
        <TierList />
      </ThemeProvider>
    </div>
  );
};
export default Page;
