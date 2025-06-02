import { useState, type FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ModalProps = {
  className?: string;
  children?: React.ReactNode;
  description?: string;
  footer?: React.ReactNode;
  footerClassName?: string;
  title?: string;
  trigger?: React.ReactNode;
  triggerClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const Modal: FC<ModalProps> = ({
  children,
  className,
  description,
  footer,
  footerClassName,
  title,
  trigger,
  triggerClassName,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen;

  const contentClasses = cn("bg-slate-900 border-slate-500", className);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className={triggerClassName}>
        {trigger}
      </DialogTrigger>

      <DialogContent
        className={contentClasses}
      >
        {Boolean(title || description) && (
          <DialogHeader>
            {title && <DialogTitle className="text-lg font-semibold text-white">{title}</DialogTitle>}
            {description && <DialogDescription className="text-sm text-gray-400">{description}</DialogDescription>}
          </DialogHeader>
        )}

        {children}

        {footer && (
          <DialogFooter className={footerClassName}>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
