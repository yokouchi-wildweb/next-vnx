'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

type CursorValue = NonNullable<CSSProperties['cursor']>

type CursorStackEntry = {
  id: symbol
  cursor: CursorValue
}

const cursorStack: CursorStackEntry[] = []
let baseCursor: string | null = null

const isBrowser = typeof document !== 'undefined'

const ensureBaseCursor = () => {
  if (!isBrowser || baseCursor !== null) return
  baseCursor = document.body.style.cursor
}

const applyCursor = () => {
  if (!isBrowser) return

  const current = cursorStack.at(-1)

  if (current) {
    document.body.style.cursor = current.cursor
  } else {
    document.body.style.cursor = baseCursor ?? ''
  }
}

const pushCursor = (entry: CursorStackEntry) => {
  if (!isBrowser) return

  ensureBaseCursor()

  const index = cursorStack.findIndex(({ id }) => id === entry.id)
  if (index > -1) {
    cursorStack.splice(index, 1)
  }

  cursorStack.push(entry)
  applyCursor()
}

const removeCursor = (id: symbol) => {
  if (!isBrowser) return

  const index = cursorStack.findIndex((entry) => entry.id === id)
  if (index === -1) return

  cursorStack.splice(index, 1)
  applyCursor()
}

export const useGlobalCursor = () => {
  const cursorIdRef = useRef<symbol | null>(null)

  const getCursorId = () => {
    if (!cursorIdRef.current) {
      cursorIdRef.current = Symbol('global-cursor')
    }
    return cursorIdRef.current
  }

  const setCursor = useCallback((cursor: CursorValue, active: boolean = true) => {
    if (!isBrowser) return

    const cursorId = getCursorId()

    if (!active) {
      removeCursor(cursorId)
      return
    }

    pushCursor({ id: cursorId, cursor })
  }, [])

  const resetCursor = useCallback(() => {
    if (!isBrowser || !cursorIdRef.current) return
    removeCursor(cursorIdRef.current)
  }, [])

  useEffect(() => {
    return () => {
      resetCursor()
    }
  }, [resetCursor])

  return { setCursor, resetCursor }
}

export type UseGlobalCursorReturn = ReturnType<typeof useGlobalCursor>
