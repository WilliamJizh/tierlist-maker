'use client'
import { ImageUpload } from "@/components/imageCropper";
import TierList from "@/components/tierList";
import { ThemeProvider } from "next-themes";

const Page = () => {
  return (
    <div>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        
        <TierList />
      </ThemeProvider>
    </div>
  );
};
export default Page;
