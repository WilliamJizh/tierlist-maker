import TierListInfiniteScroll from "@/components/home/tierListInfiniteScroll";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col lg:flex-row">
        <div className="sticky top-0 z-40 flex w-full items-center justify-center border-b backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:h-screen lg:justify-end lg:border-r-2">
          <div className="flex h-full p-16 ">
            <div className="m-auto grid items-center justify-center">
              <h1 className="text-4xl font-bold">
                Build and Share Your Tier List
              </h1>
              <p className="text-lg text-zinc-500">
                Create your own tier list and share it with your friends.
              </p>
              <Button className="m-auto mt-6">
                <Link href={"/create"}>Create Yours</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full p-6">
          <TierListInfiniteScroll />
        </div>
      </div>
    </>
  );
}
