import TierList, { DNDContainer } from "@/components/tierListBuilder/tierList";
import { getTierList, listTierLists } from "@/server/tierListActions";

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const tierList = await getTierList(slug);
    if (!tierList) {
        return <div>Not found</div>;
    }

    const { title, tierListContent } = tierList as { title: string; tierListContent: DNDContainer[] };
    
    
  return (
    <div>
      <TierList starterItems={tierListContent} title={title} />
    </div>
  );
}
