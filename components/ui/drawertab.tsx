import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type drawerTabProps = {
  children: React.ReactNode;
  buttonText: string;
};

export function DrawerTab(props: drawerTabProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">{props.buttonText}</Button>
      </DrawerTrigger>
      <DrawerContent>{props.children}</DrawerContent>
    </Drawer>
  );
}
