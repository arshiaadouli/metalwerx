"use client"

import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

function AccordionItem({ className, ...props }) {
  return (
    <AccordionPrimitive.Item className={cn("border-b", className)} {...props} />
  )
}

function AccordionTrigger({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

// forceMount keeps closed panels in the page's HTML, so crawlers that don't run
// JavaScript still read every FAQ answer; data-[state=closed]:hidden hides them
// with CSS instead. A panel then can't animate closed, only open.
function AccordionContent({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Content
      forceMount
      className="overflow-hidden text-sm data-[state=closed]:hidden data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
