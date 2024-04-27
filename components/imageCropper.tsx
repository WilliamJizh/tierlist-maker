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
        <Button variant="outline">Add Item</Button>
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
