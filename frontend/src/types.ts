export type ColorToken = "white" | "green" | "gray";

export interface PainelOrdem {
  numeroOF: string;
  dataInicio: string;
  codEngenharia: string;
  descricaoEngenharia: string;
  quantidade: number;
  situacaoLabel: string;
  colorToken: ColorToken;
  simulacao: string | null;
}

export interface PainelSnapshot {
  atualizadoEm: string;
  ordens: PainelOrdem[];
  fetchedAt: string;
  stale: boolean;
  error?: string;
}
