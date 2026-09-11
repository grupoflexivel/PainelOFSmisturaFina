import type { ColorToken } from "../types";

// Fonte única de cor por status: a legenda e as linhas da tabela usam
// exatamente a mesma classe de fundo (definida em src/index.css), para nunca
// ficarem em tons diferentes.
export const BG_CLASS: Record<ColorToken, string> = {
  white: "bg-st-gerada-fill",
  green: "bg-st-liberada-fill",
  gray: "bg-surface-2",
};

// Faixa lateral da linha: mesma família de cor do fundo, um tom mais forte.
export const BORDER_CLASS: Record<ColorToken, string> = {
  white: "border-l-st-gerada-rail",
  green: "border-l-st-liberada-rail",
  gray: "border-l-ink-faint",
};

export function bgClassFor(colorToken: ColorToken): string {
  return BG_CLASS[colorToken] ?? BG_CLASS.gray;
}

export function borderClassFor(colorToken: ColorToken): string {
  return BORDER_CLASS[colorToken] ?? BORDER_CLASS.gray;
}
