import React, { useRef, useState } from "react";
import { CropperRef, Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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

  const onChange = (cropper: CropperRef) => {
    console.log(cropper.getCoordinates(), cropper.getCanvas());
  };

  const onConfirm = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (!canvas) return;
      prop.onUpload(canvas.toDataURL());
      setOpen(false);
      setImage("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-10 h-10 p-2">
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 3a1 1 0 0 1 .78.375l4 5a1 1 0 1 1-1.56 1.25L13 6.85V14a1 1 0 1 1-2 0V6.85L8.78 9.626a1 1 0 1 1-1.56-1.25l4-5A1 1 0 0 1 12 3ZM9 14v-1H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4v1a3 3 0 1 1-6 0Zm8 2a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z"
                  clip-rule="evenodd"
                />
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add New Item</p>
          </TooltipContent>
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        {image === "" ? (
          <div className="grid w-full max-w-sm items-center gap-4">
            <Label htmlFor="picture">Upload</Label>
            <Input id="picture" type="file" onChange={onFileChange} />
          </div>
        ) : (
          <Cropper
            ref={cropperRef}
            src={image}
            onChange={onChange}
            className={"cropper"}
            stencilProps={{
              aspectRatio: 1 / 1,
            }}
          />
        )}
        <div className="flex w-full justify-center pt-4">
          <Button onClick={onConfirm}>Confirm</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
