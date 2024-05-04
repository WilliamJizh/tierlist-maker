"use client";
import TierList from "@/components/tierListBuilder/tierList";
import { useEffect, useState } from "react";
import { json } from "stream/consumers";

export default function Page() {
  const [tierListContent, setTierListContent] = useState<string | null>("");
  const [title, setTitle] = useState<string | null>("");

  useEffect(() => {
    setTierListContent(localStorage?.getItem("tierListContent"));
    setTitle(localStorage?.getItem("title"));
  }, []);
  if (typeof window === "undefined") return null;

  const safeParseJson = (json: string | null) => {
    try {
      return JSON.parse(json || "");
    } catch (e) {
      return null;
    }
  };

  return (
    <div>
      <TierList
        starterItems={safeParseJson(tierListContent)}
        title={title || null}
      />
    </div>
  );
}
