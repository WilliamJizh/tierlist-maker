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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { DNDContainer } from "./tierList";
import { createTierList } from "@/server/tierListActions";
import { title } from "process";
import { imageUpload } from "./imageUpload";
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";

type PublishProps = {
  title: string;
  content: DNDContainer[];
  getTierlistCoverImage: () => Promise<string>;
};

export function PublishTierList(props: PublishProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const containers = props.content;
  const router = useRouter();

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

  const handleGuestPublish = async () => {
    setIsPublishing(true);
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
    });
    setOpen(false);
    if (!result) {
      alert("Failed to publish tier list");
      toast({ title: "Error", description: "Failed to publish tier list" });
      return;
    }
    router.push(`/tierlist/${result[0].id}?success=true`);
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
            onClick={handleGuestPublish}
            disabled={isPublishing}
          >
            {isPublishing ? "Publishing..." : "Publish As Guest"}
          </Button>
          <Button className=" m-auto w-48 px-8" disabled>
            Sign In to Publish
          </Button>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
