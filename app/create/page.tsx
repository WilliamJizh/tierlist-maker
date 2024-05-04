"use client";
import TierList from "@/components/tierListBuilder/tierList";
import { useEffect, useState } from "react";

export default function Page() {
  
  const [tierListContent, setTierListContent] = useState<string | null>("");
  const [title, setTitle] = useState<string | null>("");
  
  useEffect(() => {
    setTierListContent(localStorage?.getItem("tierListContent"));
    setTitle(localStorage?.getItem("title"));
  }, []);
  if (typeof window === "undefined") return null;

  if (!tierListContent || !title) {
    return (
      <div>
        <TierList />
      </div>
    );
  }

  const tierlist = JSON.parse(tierListContent);

  return (
    <div>
      <TierList starterItems={tierlist} title={title} />
    </div>
  );
}
