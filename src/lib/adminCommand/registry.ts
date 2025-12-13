// src/lib/adminCommand/registry.ts

import type { AdminCommand, CommandCategory, CommandContext } from "./types";

/**
 * 登録されたコマンドを管理するレジストリ
 */
class AdminCommandRegistry {
  private commands: Map<string, AdminCommand> = new Map();

  /**
   * コマンドを登録する
   */
  register(command: AdminCommand): void {
    if (this.commands.has(command.id)) {
      console.warn(`[AdminCommandRegistry] コマンド "${command.id}" は既に登録されています。上書きします。`);
    }
    this.commands.set(command.id, command);
  }

  /**
   * 複数のコマンドを一括登録する
   */
  registerAll(commands: AdminCommand[]): void {
    for (const command of commands) {
      this.register(command);
    }
  }

  /**
   * コマンドを取得する
   */
  get(id: string): AdminCommand | undefined {
    return this.commands.get(id);
  }

  /**
   * 全コマンドを取得する
   */
  getAll(): AdminCommand[] {
    return Array.from(this.commands.values());
  }

  /**
   * カテゴリ別にコマンドを取得する
   */
  getByCategory(category: CommandCategory): AdminCommand[] {
    return this.getAll().filter((cmd) => cmd.category === category);
  }

  /**
   * 利用可能なコマンドのみを取得する
   */
  getAvailable(context: Omit<CommandContext, "closePalette">): AdminCommand[] {
    return this.getAll().filter((cmd) => {
      if (!cmd.isAvailable) return true;
      return cmd.isAvailable(context);
    });
  }

  /**
   * コマンドを削除する
   */
  unregister(id: string): boolean {
    return this.commands.delete(id);
  }

  /**
   * 全コマンドを削除する
   */
  clear(): void {
    this.commands.clear();
  }
}

/**
 * グローバルなコマンドレジストリインスタンス
 */
export const adminCommandRegistry = new AdminCommandRegistry();

/**
 * コマンドを登録するヘルパー関数
 */
export function registerAdminCommand(command: AdminCommand): void {
  adminCommandRegistry.register(command);
}

/**
 * 複数コマンドを登録するヘルパー関数
 */
export function registerAdminCommands(commands: AdminCommand[]): void {
  adminCommandRegistry.registerAll(commands);
}
