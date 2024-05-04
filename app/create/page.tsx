"use client";
import TierList from "@/components/tierListBuilder/tierList";

export default function Page() {
  const tierListContent = localStorage?.getItem("tierListContent");
  const title = localStorage?.getItem("tierListTitle");

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
