import {
  ListTierListsByPaginationResponse,
  listTierLists,
  listTierListsByPagination,
} from "@/server/tierListActions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import TierListDisplayItem from "./tierListDisplayItem";

import { LoadMore } from "./loadMore";

const TierListInfiniteScroll = async () => {
  const { tierlists } = await InitialServerRender(1, 2);
  return (
    <>
      {tierlists}
      <LoadMore />
    </>
  );
};

export const InitialServerRender = async (page: number, pageItems: number) => {
  const data = await listTierListsByPagination(page, pageItems);

  return {
    tierlists: (
      <div className="grid justify-center gap-4 p-4 px-6 lg:justify-start">
        {data.map((item) => (
          <TierListDisplayItem key={item.id} {...item} />
        ))}
      </div>
    ),
  };
};

export default TierListInfiniteScroll;
