import { Tabs as TabsPrimitive } from "radix-ui"
import type * as React from "react"

import { cn } from "@/lib/utils"
import { Separator } from "./separator"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2 justify-start items-start relative overflow-x-auto overflow-y-hidden pb-2", className)}
      {...props}
    >
      {props.children}
      <Separator className="absolute top-[33px] left-0" />
    </TabsPrimitive.Root>
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(

        "inline-flex w-fit items-center justify-center relative",
        "h-auto gap-1 sm:gap-2 rounded-none bg-transparent text-foreground",
        // className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "cursor-pointer hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:hover:bg-accent",
        "relative inline-flex items-center justify-center rounded-sm px-2 py-1.5 text-sm font-medium whitespace-nowrap transition-all outline-none hover:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 ",
        "after:absolute after:-bottom-px after:left-1/2 after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-transparent after:transition-[width] after:duration-300 after:ease-in-out after:z-10",
        "data-[state=active]:after:w-full data-[state=active]:after:bg-primary",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
