// src/lib/adminCommand/components/AdminCommandPalette.tsx

"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2Icon } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/_shadcn/command";
import { useAuthSession } from "@/features/core/auth/hooks/useAuthSession";
import { adminCommandRegistry } from "../registry";
import { CATEGORY_LABELS, type AdminCommand, type CommandCategory, type CommandContext } from "../types";

type AdminCommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AdminCommandPalette({ open, onOpenChange }: AdminCommandPaletteProps) {
  const { user } = useAuthSession();
  const pathname = usePathname();
  const [executingCommandId, setExecutingCommandId] = useState<string | null>(null);

  const closePalette = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const context: Omit<CommandContext, "closePalette"> | null = useMemo(() => {
    if (!user) return null;
    return { user, pathname };
  }, [user, pathname]);

  const availableCommands = useMemo(() => {
    if (!context) return [];
    return adminCommandRegistry.getAvailable(context);
  }, [context]);

  const commandsByCategory = useMemo(() => {
    const grouped = new Map<CommandCategory, AdminCommand[]>();
    for (const cmd of availableCommands) {
      const list = grouped.get(cmd.category) || [];
      list.push(cmd);
      grouped.set(cmd.category, list);
    }
    return grouped;
  }, [availableCommands]);

  const handleSelect = useCallback(
    async (command: AdminCommand) => {
      if (!context) return;

      const fullContext: CommandContext = {
        ...context,
        closePalette,
      };

      if (command.isAsync) {
        setExecutingCommandId(command.id);
        try {
          await command.execute(fullContext);
        } finally {
          setExecutingCommandId(null);
        }
      } else {
        command.execute(fullContext);
      }
    },
    [context, closePalette]
  );

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="管理者コマンド"
      description="コマンドを検索して実行"
      showCloseButton={false}
    >
      <CommandInput placeholder="コマンドを検索..." />
      <CommandList>
        <CommandEmpty>コマンドが見つかりません</CommandEmpty>
        {Array.from(commandsByCategory.entries()).map(([category, commands]) => (
          <CommandGroup key={category} heading={CATEGORY_LABELS[category]}>
            {commands.map((cmd) => (
              <CommandItem
                key={cmd.id}
                value={`${cmd.label} ${cmd.description || ""} ${cmd.keywords?.join(" ") || ""}`}
                onSelect={() => handleSelect(cmd)}
                disabled={executingCommandId !== null}
              >
                {cmd.icon && <span className="mr-2">{cmd.icon}</span>}
                <span>{cmd.label}</span>
                {cmd.description && (
                  <span className="ml-2 text-muted-foreground text-xs">{cmd.description}</span>
                )}
                {executingCommandId === cmd.id && <Loader2Icon className="ml-auto size-4 animate-spin" />}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
