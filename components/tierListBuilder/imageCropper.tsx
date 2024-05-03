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

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
            <Input
              id="picture"
              type="file"
              name="image"
              accept="image/*"
              onChange={onFileChange}
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
          <div className="flex w-full justify-center pt-4 gap-2">
            <Button onClick={onConfirm}>Confirm</Button>
            <Button onClick={onClear}>Cancel</Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
