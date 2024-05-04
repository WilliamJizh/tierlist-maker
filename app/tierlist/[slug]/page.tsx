import TierList, { DNDContainer } from "@/components/tierListBuilder/tierList";
import { toast } from "@/components/ui/use-toast";
import { getTierList, listTierLists } from "@/server/tierListActions";
import { useSearchParams } from "next/navigation";

export default async function Page({ params, searchParams }: { params: { slug: string }, searchParams: { success: string }}) {
  const { slug } = params;
  const { success } = searchParams;

  const successBool = success === "true";
  

  const tierList = await getTierList(slug);
  if (!tierList) {
    return <div>Not found</div>;
  }

  const { title, tierListContent } = tierList as {
    title: string;
    tierListContent: DNDContainer[];
  };

  return (
    <div>
      <TierList starterItems={tierListContent} title={title} success={successBool}/>
    </div>
  );
}
