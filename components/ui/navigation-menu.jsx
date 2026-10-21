"use client"

import { useRef } from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

// viewport={false} drops the shared viewport, so each dropdown opens under its
// own trigger instead of at the left edge of the menu.
function NavigationMenu({ className, children, viewport = true, ...props }) {
  return (
    <NavigationMenuPrimitive.Root
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative z-10 flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.List
      className={cn(
        "group flex flex-1 list-none items-center justify-center space-x-1",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.Item className={cn("relative", className)} {...props} />
  )
}

const navigationMenuTriggerStyle = cva(
  // focus-visible rather than focus, so a trigger clicked with the mouse doesn't
  // stay highlighted after its menu closes.
  "group inline-flex h-10 w-max cursor-pointer items-center justify-center rounded-[2px] px-3 text-[0.9375rem] font-semibold text-ink transition-colors duration-150 hover:bg-sunk disabled:pointer-events-none disabled:opacity-45 data-[state=open]:bg-sunk"
)

// Radix opens a menu on hover and toggles it on every click, so the click that
// usually follows a hover shut the menu again. The first mouse click after the
// pointer arrives now leaves a hover-opened menu open; further clicks, taps and
// the keyboard still toggle it.
function NavigationMenuTrigger({ className, children, onPointerEnter, onPointerDown, onClick, ...props }) {
  const pointerType = useRef("")
  const clickedSinceEnter = useRef(false)

  return (
    <NavigationMenuPrimitive.Trigger
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      onPointerEnter={(event) => {
        clickedSinceEnter.current = false
        onPointerEnter?.(event)
      }}
      onPointerDown={(event) => {
        pointerType.current = event.pointerType
        onPointerDown?.(event)
      }}
      onClick={(event) => {
        onClick?.(event)
        // A keyboard-triggered click has detail 0.
        const isMouse = event.detail > 0 && pointerType.current === "mouse"
        const hoverOpened =
          isMouse && !clickedSinceEnter.current && event.currentTarget.dataset.state === "open"
        if (isMouse) clickedSinceEnter.current = true
        // Radix skips its toggle when the default is prevented.
        if (hoverOpened) event.preventDefault()
      }}
      {...props}
    >
      {children}{" "}
      <ChevronDown
        className="relative top-px ml-1 size-3.5 text-ink-muted transition-transform duration-200 ease-out-expo group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.Content
      className={cn(
        "left-0 top-0 w-full md:absolute md:w-auto",
        // In the shared viewport, content slides in from the side of the previous item.
        "group-data-[viewport=true]/navigation-menu:data-[motion^=from-]:animate-in group-data-[viewport=true]/navigation-menu:data-[motion^=to-]:animate-out group-data-[viewport=true]/navigation-menu:data-[motion^=from-]:fade-in group-data-[viewport=true]/navigation-menu:data-[motion^=to-]:fade-out group-data-[viewport=true]/navigation-menu:data-[motion=from-end]:slide-in-from-right-52 group-data-[viewport=true]/navigation-menu:data-[motion=from-start]:slide-in-from-left-52 group-data-[viewport=true]/navigation-menu:data-[motion=to-end]:slide-out-to-right-52 group-data-[viewport=true]/navigation-menu:data-[motion=to-start]:slide-out-to-left-52",
        // Without it, each item gets its own panel below its trigger. Radix closes the menu
        // 150ms after the pointer leaves trigger and content, so the ::before strip fills the
        // mt-2 gap between them; otherwise a slow move down closes the menu in that gap.
        // The panel drops 4px from its trigger and fades in; it leaves faster.
        "group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-2 group-data-[viewport=false]/navigation-menu:origin-top-left group-data-[viewport=false]/navigation-menu:rounded-[2px] group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:border-rule group-data-[viewport=false]/navigation-menu:bg-raised group-data-[viewport=false]/navigation-menu:text-ink group-data-[viewport=false]/navigation-menu:shadow-[0_1px_2px_rgb(0_0_0/0.06),0_16px_36px_-10px_rgb(0_0_0/0.22)] group-data-[viewport=false]/navigation-menu:before:absolute group-data-[viewport=false]/navigation-menu:before:inset-x-0 group-data-[viewport=false]/navigation-menu:before:-top-2.5 group-data-[viewport=false]/navigation-menu:before:h-2.5 group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=open]:slide-in-from-top-1 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:data-[state=open]:duration-150 group-data-[viewport=false]/navigation-menu:data-[state=closed]:duration-100",
        className
      )}
      {...props}
    />
  )
}

const NavigationMenuLink = NavigationMenuPrimitive.Link

function NavigationMenuViewport({ className, ...props }) {
  return (
    <div className={cn("absolute left-0 top-full flex justify-center")}>
      <NavigationMenuPrimitive.Viewport
        className={cn(
          "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
          className
        )}
        {...props}
      />
    </div>
  )
}

function NavigationMenuIndicator({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.Indicator
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
