import {
  Root,
  Title,
  Description,
  Close,
  type ToastProps,
} from "@radix-ui/react-toast";
import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends ToastProps {
  titleSlot?: ReactNode;
  bodySlot?: ReactNode;
}

export const Toast = ({ className, titleSlot, bodySlot, ...props }: Props) => (
  <Root
    className={twMerge(
      `
  ml-auto grid max-w-md grid-cols-[1fr,min-content] rounded bg-slate-600 p-4 text-slate-100
  data-[state=swipe]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-toastClosed
  data-[state=open]:animate-toastOpen data-[swipe=end]:animate-toastEnd data-[swipe=move]:transition-[translate]
  `,
      className,
    )}
    {...props}
  >
    {titleSlot && <Title className="text-lg font-bold">{titleSlot}</Title>}
    {bodySlot && <Description className="">{bodySlot}</Description>}
    <Close />
  </Root>
);
