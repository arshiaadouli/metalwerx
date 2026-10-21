"use client"

import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

function AccordionItem({ className, ...props }) {
  return (
    <AccordionPrimitive.Item className={cn("border-b border-rule", className)} {...props} />
  )
}

// The plus turns into a cross as its answer opens.
function AccordionTrigger({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group/trigger flex flex-1 cursor-pointer items-start justify-between gap-6 py-4 text-left leading-snug font-bold text-ink [font-stretch:104%] transition-colors duration-150 hover:text-ink-soft",
          className,
        )}
        {...props}
      >
        {children}
        <Plus
          aria-hidden="true"
          strokeWidth={2}
          className="mt-[0.2em] size-5 shrink-0 text-ink-muted transition-transform duration-200 ease-out-expo group-data-[state=open]/trigger:rotate-45 group-data-[state=open]/trigger:text-ink"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
