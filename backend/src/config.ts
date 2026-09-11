import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  PAINEL_API_BASE_URL: z.string().url().default("https://10.1.1.220"),
  PAINEL_API_TOKEN: z.string().min(1, "PAINEL_API_TOKEN é obrigatório"),
  PAINEL_COD_EMPRESA: z.string().default("1"),
  PAINEL_TIPO_MONITOR: z.string().default("PESAGEMFINA"),
  PAINEL_REFRESH_INTERVAL_MINUTES: z.coerce.number().positive().default(5),
  // A API expõe HTTPS num IP interno com certificado que o próprio time confirmou
  // ser self-signed (curl só funciona com -k). Mantemos a validação de TLS
  // desligada por padrão para esse upstream específico, mas dá pra ligar de volta
  // via env assim que houver um certificado confiável.
  PAINEL_API_TLS_REJECT_UNAUTHORIZED: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
});

export type Config = z.infer<typeof envSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("\n");
    throw new Error(`Configuração inválida:\n${issues}`);
  }
  return result.data;
}
