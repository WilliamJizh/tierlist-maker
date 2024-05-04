import React, { useRef, useState } from "react";
import { CropperRef, Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type ImageUploadProps = {
  onUpload: (image: string) => void;
};

export function ImageUpload(prop: ImageUploadProps) {
  const [image, setImage] = useState("");

  const [open, setOpen] = useState(false);
  const cropperRef = useRef<CropperRef>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const onConfirm = async () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (!canvas) return;
      const imgBase64 = canvas.toDataURL("image/jpeg", 0.5);
      prop.onUpload(imgBase64);
      setOpen(false);
      setImage("");
    }
  };

  const onClear = () => {
    setImage("");
  };

  const cropToSquare = async (base64Image: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject("Failed to get canvas context");
          return;
        }

        // Calculating the top left corner coordinates to center the crop area
        const x = (img.width - size) / 2;
        const y = (img.height - size) / 2;

        ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
        resolve(canvas.toDataURL()); // Converts the canvas to base64
      };
      img.onerror = reject;
      img.src = base64Image;
    });
  };

  const batchUpload = async (images: string[]) => {
    for (const image of images) {
      const croppedImage = await cropToSquare(image);
      prop.onUpload(croppedImage);
    }
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(change) => {
        setOpen(change);
        onClear();
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <p>New Item</p>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add a new item</p>
        </TooltipContent>
      </Tooltip>

      <PopoverContent className="w-80">
        {image === "" ? (
          <div className="grid w-full max-w-sm items-center gap-4 pb-4">
            <Label htmlFor="picture">Upload</Label>
            <p>Upload A Single Image</p>
            <Input
              id="picture"
              type="file"
              name="image"
              accept="image/*"
              onChange={onFileChange}
            />
            <p>Upload Multiple Images</p>
            <Input
              id="pictures"
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={(event) => {
                if (event.target.files && event.target.files.length > 0) {
                  const images: string[] = [];
                  for (let i = 0; i < event.target.files.length; i++) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      images.push(reader.result as string);
                      if (images.length === event.target.files?.length) {
                        batchUpload(images);
                      }
                    };
                    reader.readAsDataURL(event.target.files[i]);
                  }
                }
              }}
            />
          </div>
        ) : (
          <Cropper
            ref={cropperRef}
            src={image}
            className={"cropper"}
            stencilProps={{
              aspectRatio: 1 / 1,
            }}
          />
        )}
        {image && (
          <div className="flex w-full justify-center gap-2 pt-4">
            <Button onClick={onConfirm}>Confirm</Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
