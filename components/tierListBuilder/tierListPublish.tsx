"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createTierList } from "@/server/tierListActions";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";
import { imageUpload } from "./imageUpload";
import { DNDContainer } from "./tierList";

type PublishProps = {
  title: string;
  content: DNDContainer[];
  getTierlistCoverImage: () => Promise<string>;
};

export function PublishTierList(props: PublishProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUserPublishing, setIsUserPublishing] = useState(false);
  const containers = props.content;
  const router = useRouter();

  const { user } = useKindeBrowserClient();

  const handleImageUpload = async () => {
    const imgUploadPremises: Promise<void>[] = [];
    containers.forEach((container) => {
      container.items.forEach(async (item) => {
        if (!item.src.startsWith("data:image")) return;
        const imgPromise = imageUpload(item.src).then((newSrc) => {
          item.src = newSrc;
        });
        imgUploadPremises.push(imgPromise);
      });
    });
    await Promise.all(imgUploadPremises);
  };

  const handleCoverImageUpload = async () => {
    const coverImage = await props.getTierlistCoverImage();
    if (!coverImage.startsWith("data:image")) {
      return coverImage;
    }

    return imageUpload(coverImage);
  };

  const handlePublish = async (guest: boolean) => {
    guest ? setIsPublishing(true) : setIsUserPublishing(true);

    const imageUploadPromises = [];
    let coverImage = "";

    imageUploadPromises.push(handleImageUpload());
    imageUploadPromises.push(
      handleCoverImageUpload().then((result) => {
        coverImage = result;
      }),
    );

    await Promise.all(imageUploadPromises);

    const contentJson = JSON.parse(JSON.stringify(containers));
    const result = await createTierList({
      title: props.title,
      content: contentJson,
      description: description,
      coverImage: coverImage,
      guest: guest,
      userId: user?.id,
      userName: `${user?.given_name} ${user?.family_name}`,
      userImage: user?.picture || undefined,
    });
    setOpen(false);
    if (!result) {
      alert("Failed to publish tier list");
      toast({ title: "Error", description: "Failed to publish tier list" });
      return;
    }
    localStorage.removeItem("tierListContent");
    localStorage.removeItem("tierListTitle");
    localStorage.removeItem("tierListDescription");
    router.push(`/tierlist/${result[0].id}?success=true`);
  };

  const handleLocalStorage = () => {
    const contentString = JSON.stringify(props.content);
    localStorage.setItem("tierListContent", contentString);
    localStorage.setItem("tierListTitle", props.title);
    localStorage.setItem("tierListDescription", description);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Publish</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Publish Tier List</DialogTitle>
          <DialogDescription>
            Well done! Now you can publish your tier list.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="Describe your tier list here..."
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          value={description}
        />

        <div className="grid gap-4 py-4">
          <Button
            className=" m-auto w-48 px-8"
            onClick={() => handlePublish(true)}
            disabled={isPublishing}
          >
            {isPublishing ? "Publishing..." : "Publish As Guest"}
          </Button>
          {user ? (
            <>
              <Button
                className="m-auto h-auto w-48 text-wrap px-8"
                onClick={() => handlePublish(false)}
                disabled={isUserPublishing}
              >
                {isUserPublishing
                  ? `Publishing`
                  : `Publish As ${user.given_name} ${user.family_name}`}
              </Button>
                {/* <Button className="m-auto h-auto w-48 text-wrap px-8">
                  <LogoutLink
                    postLogoutRedirectURL="/create"
                    onClick={handleLocalStorage}
                  >
                    Log out
                  </LogoutLink>
                </Button> */}
            </>
          ) : (
            <Button className=" m-auto w-48 px-8">
              <LoginLink
                postLoginRedirectURL="/create"
                onClick={handleLocalStorage}
              >
                Sign In to Publish
              </LoginLink>
            </Button>
          )}
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
