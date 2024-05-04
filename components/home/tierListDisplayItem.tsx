import { ListTierListsByPaginationResponse } from "@/server/tierListActions";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardDescription, CardTitle } from "../ui/card";

const TierListDisplayItem = (item: ListTierListsByPaginationResponse) => {
  const componentType = typeof window === "undefined" ? "server" : "client";
  const fallbackSrc = "/fallback.jpg";
  const coverImage =
    item.coverImage && item.coverImage !== "" ? item.coverImage : fallbackSrc;

  const nameAbbreviation = item.user?.name[0].toUpperCase();

  return (
    <Card className=" max-w-xl">
      <Link
        className="m-auto grid cursor-pointer gap-4 p-4"
        href={`/tierlist/${item.id}`}
      >
        <div className="flex items-end gap-2 border-b pb-4">
          <Avatar>
            <AvatarImage
              src={item.user?.image || ""}
              alt={`@${item.user?.name}`}
            />
            <AvatarFallback>{nameAbbreviation || "G"}</AvatarFallback>
          </Avatar>
          <div className="grid ">
            <p className="font-bold">{item.user?.name || "Guest"}</p>
            <p className="text-sm">
              {`${item.createdAt.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })} at ${item.createdAt.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "numeric",
              })}`}
            </p>
          </div>
        </div>
        {componentType === "server" ? (
          <Image
            src={coverImage}
            alt=""
            width={600}
            height={800}
            className="w-600 h-auto max-h-[800px] w-full rounded border-2 object-cover"
          />
        ) : (
          <Image
            src={coverImage}
            alt=""
            width={600}
            height={800}
            data-loaded="false"
            onLoad={(event) => {
              event.currentTarget.setAttribute("data-loaded", "true");
            }}
            className="w-800 h-auto max-h-[600px] w-full rounded border-2 object-cover data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/10"
          />
        )}

        <div className="flex flex-col pb-4">
          <p className="font-bold">{item.title}</p>
          {item.description && item.description !== "" && (
            <CardDescription className="pt-2">
              {item.description}
            </CardDescription>
          )}
        </div>
      </Link>
    </Card>
  );
};

export default TierListDisplayItem;
