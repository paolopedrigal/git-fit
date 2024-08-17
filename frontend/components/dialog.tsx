import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

interface DialogProps {
  openState: boolean;
  openStateCallback: Dispatch<SetStateAction<boolean>>;
  title: string;
  description: string;
  actionDescription: string;
  actionCallback: () => void;
  isDestructive?: boolean;
}

export function Dialog(props: DialogProps) {
  return (
    <AlertDialog open={props.openState} onOpenChange={props.openStateCallback}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          <AlertDialogDescription>{props.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={
              props.isDestructive
                ? buttonVariants({ variant: "destructive" })
                : buttonVariants({ variant: "default" })
            }
            onClick={props.actionCallback}
          >
            {props.actionDescription}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
