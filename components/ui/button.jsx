import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Flat, square-cornered plates, like cut sheet. One action colour (copper) for
// the thing the page most wants done; everything else is an ink outline or a
// plain text button. The on-rack variants sit on the dark rack field.
const buttonVariants = cva(
  "inline-flex cursor-pointer select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-[2px] font-bold [font-stretch:104%] transition-[background-color,color,box-shadow,transform] duration-150 ease-out-expo active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-[1.125em] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-action text-action-ink hover:bg-action-hover",
        outline: "bg-transparent text-ink shadow-[inset_0_0_0_1.5px_var(--ink)] hover:bg-ink hover:text-ground",
        quiet: "bg-transparent text-ink underline-offset-[0.22em] hover:underline",
        rack: "bg-rack-ink text-rack hover:bg-white",
        "rack-outline": "bg-transparent text-rack-ink shadow-[inset_0_0_0_1.5px_var(--rack-ink)] hover:bg-rack-ink hover:text-rack",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
      },
      size: {
        sm: "h-10 px-4 text-[0.9375rem]",
        default: "h-12 px-5 text-base",
        lg: "h-14 px-7 text-[1.0625rem]",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
