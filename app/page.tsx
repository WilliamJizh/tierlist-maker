import TierListInfiniteScroll from "@/components/home/tierListInfiniteScroll";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col lg:flex-row">
        <div className="sticky top-0 z-40 flex w-full items-center justify-center border-b backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:h-screen lg:justify-end lg:border-b-0 lg:border-r">
          <div className="flex h-full max-w-md p-8">
            <div className="m-auto grid items-center justify-center">
              <div className="pointer-events-none absolute z-10 h-64 w-64 rounded-full bg-gradient-to-b from-white/30 to-transparent blur-3xl"></div>
              <h1 className="text-4xl font-bold">Making A Tier List?</h1>
              <p className="mt-2 text-zinc-400">
                A tier list is a concept originating in video game culture where
                playable characters or other in-game elements are subjectively
                ranked by their respective viability as part of a list.
              </p>
              <Button className="m-auto mt-6" asChild>
                <Link href={"/create"}>Create Your List</Link>
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
