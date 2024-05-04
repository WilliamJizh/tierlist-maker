"use client";

import { cn } from "@/lib/utils";
import {
  ListTierListsByPaginationResponse,
  listTierListsByPagination,
} from "@/server/tierListActions";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInView } from "react-intersection-observer";
import TierListDisplayItem from "./tierListDisplayItem";

export const LoadMore = () => {
  const { ref, inView } = useInView();
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    setIsInView(true);
  }, [inView]);

  return (
    <>
      {!isInView ? (
        <div className=" w-full py-4" ref={ref}>
          <Spinner />
        </div>
      ) : (
        <>
          <InfiniteScrollClient />
        </>
      )}
    </>
  );
};

const Spinner = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "animate-spin",
        "text-gray-800",
        "dark:text-white",
        "m-auto",
      )}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

const InfiniteScrollClient = () => {
  const pageItems = 2;
  const [hasMore, setHasMore] = useState(true);
  const [data, setData] = useState<ListTierListsByPaginationResponse[]>([]);
  const [page, setPage] = useState(2);
  const router = useRouter();

  const fetchData = async () => {
    listTierListsByPagination(page, pageItems).then((result) => {
      if (result.length === 0) {
        setHasMore(false);
        return;
      }
      setData([...data, ...result]);
      setPage(page + 1);
    });

    setPage(page + 1);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <InfiniteScroll
        dataLength={data.length}
        next={fetchData}
        hasMore={hasMore}
        loader={
          <div className=" w-full py-4">
            <Spinner />
          </div>
        }
        className="grid gap-4"
      >
        {data.map((item) => (
          <TierListDisplayItem key={item.id} {...item} />
        ))}
      </InfiniteScroll>
      {!hasMore && (
        <p className="border-t pt-2 text-center text-sm text-neutral-500">
          You have reached the end
        </p>
      )}
    </>
  );
};
