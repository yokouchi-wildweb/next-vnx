"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Tabs, TabsList, TabsTrigger } from "@/components/_shadcn/tabs"
import { Flex } from "@/components/Layout/Flex"
import { Span } from "@/components/TextBlocks/Span"
import { cn } from "@/lib/cn"

type PageTabMatcher = (pathname: string) => boolean

export type PageTabItem = {
  value: string
  label: ReactNode
  href: string
  icon?: ReactNode
  matcher?: PageTabMatcher
  prefetch?: boolean
  replace?: boolean
  scroll?: boolean
  target?: string
  className?: string
}

type PageTabsProps = {
  tabs: PageTabItem[]
  className?: string
  listClassName?: string
  ariaLabel?: string
}

export function PageTabs({
  tabs,
  className,
  listClassName,
  ariaLabel = "ページ内タブ",
}: PageTabsProps) {
  const pathname = usePathname()

  if (!tabs.length) {
    return null
  }

  const resolvedValue =
    tabs.find((tab) => (tab.matcher ? tab.matcher(pathname) : pathname === tab.href))?.value ??
    tabs[0]!.value

  return (
    <nav aria-label={ariaLabel}>
      <Tabs value={resolvedValue} className={cn("w-full", className)}>
        <TabsList className={cn("w-full", listClassName)}>
          {tabs.map((tab) => {
            const isActive = tab.value === resolvedValue

            return (
              <TabsTrigger key={tab.value} value={tab.value} asChild className={tab.className}>
                <Link
                  href={tab.href}
                  prefetch={tab.prefetch}
                  replace={tab.replace}
                  scroll={tab.scroll}
                  target={tab.target}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Flex align="center" justify="center" gap="xs" className="w-full">
                    {tab.icon}
                    <Span weight="medium" className="truncate">
                      {tab.label}
                    </Span>
                  </Flex>
                </Link>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>
    </nav>
  )
}
