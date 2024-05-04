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
    <div className="grid justify-center gap-4 px-2 lg:justify-start">
      {tierlists}
      <LoadMore />
    </div>
  );
};

export const InitialServerRender = async (page: number, pageItems: number) => {
  const data = await listTierListsByPagination(page, pageItems);

  return {
    tierlists: (
      <>
        {data.map((item) => (
          <TierListDisplayItem key={item.id} {...item} />
        ))}
      </>
    ),
  };
};

export default TierListInfiniteScroll;
