export function parseQuantidadeBR(valor: string): number {
  const semSeparadorDeMilhar = valor.replaceAll(".", "");
  const comPontoDecimal = semSeparadorDeMilhar.replace(",", ".");
  return Number(comPontoDecimal);
}

export type ColorToken = "white" | "green" | "gray";

// No painel de Mistura Fina só existem duas cores operacionais:
// Geradas ficam brancas e Liberadas ficam verdes.
const CORES_POR_SITUACAO: Record<string, ColorToken> = {
  Gerada: "white",
  "Liberada Qualidade": "green",
};

export function mapSituacaoColor(situacaoDescricao: string): ColorToken {
  return CORES_POR_SITUACAO[situacaoDescricao] ?? "gray";
}

export interface OrdemFabricacaoDetailResponse {
  data: { controle?: string }[];
}

// GET /api/ppcppadrao/v10/ordemFabricacao/{numeroOF} devolve `controle` no
// formato "S-<numero da simulação>" (ex.: "S-39385") quando a OF veio de uma
// simulação. Tratamos ausência de dado e string vazia da mesma forma: sem
// simulação vinculada.
export function extractControle(response: OrdemFabricacaoDetailResponse): string | null {
  const controle = response.data[0]?.controle;
  return controle ? controle : null;
}
