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
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
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
        className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
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
        // mt-1.5 gap between them; otherwise a slow move down closes the menu in that gap.
        "group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:before:absolute group-data-[viewport=false]/navigation-menu:before:inset-x-0 group-data-[viewport=false]/navigation-menu:before:-top-2 group-data-[viewport=false]/navigation-menu:before:h-2 group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95",
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
