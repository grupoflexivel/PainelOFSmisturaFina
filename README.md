# Mistura fina - Matriz

Reescrita do painel de acompanhamento de Ordens de Fabricação (antigo `PainelOF3.html`), consumindo a API `GET /api/customas/v10/paineisOf` em vez de ser gerado direto no CSP/IRIS.

## Arquitetura

Um único serviço Node/Express (`backend/`) que:

- Consulta a API upstream periodicamente (intervalo configurável, padrão 5 min) e mantém o último resultado em cache em memória — nunca derruba o painel numa falha de rede passageira, apenas marca o dado como `stale`.
- Expõe `GET /api/painel` (dados já mapeados/formatados) e `GET /api/config` (intervalo de atualização em ms) para o frontend.
- Serve o build estático do frontend (`frontend/dist`), então em produção é só esse um processo/porta.

O frontend (`frontend/`, React + Vite + Tailwind) faz *polling* em `/api/painel` no mesmo intervalo que o backend usa para consultar a API upstream — nunca fala diretamente com a API upstream, então o token nunca chega ao navegador.

## Rodando localmente

Backend:
```bash
cd backend
npm install
cp ../.env.example .env   # preencha PAINEL_API_TOKEN
npm run dev                # http://localhost:3001 (porta do .env)
```

Frontend (com hot reload, proxying `/api` para o backend acima):
```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

Para testar o build de produção servido pelo próprio backend (sem o dev server do Vite):
```bash
cd frontend && npm run build
cd ../backend && npm run dev   # agora serve frontend/dist em http://localhost:3001
```

## Testes

```bash
cd backend && npm test
cd frontend && npm test
```

## Docker

```bash
cp .env.example .env   # preencha PAINEL_API_TOKEN
docker compose up --build
```

Sobe um único container na porta `3001` (ajustável via `PORT`/`ports` no `docker-compose.yml`).

## Configuração (variáveis de ambiente)

Veja `.env.example` para a lista completa. As mais importantes:

| Variável | Padrão | Descrição |
|---|---|---|
| `PAINEL_API_TOKEN` | — (obrigatório) | Token enviado no header `Authorization` para a API upstream. |
| `PAINEL_REFRESH_INTERVAL_MINUTES` | `5` | De quanto em quanto tempo o backend busca dados novos na API. O frontend segue esse mesmo intervalo automaticamente. |
| `PAINEL_API_BASE_URL` | `https://10.1.1.220` | Base da API upstream. |
| `PAINEL_COD_EMPRESA` / `PAINEL_TIPO_MONITOR` | `1` / `PESAGEMFINA` | Query params enviados para `/api/customas/v10/paineisOf`. |
| `PAINEL_API_TLS_REJECT_UNAUTHORIZED` | `false` | O certificado da API upstream é self-signed; mantenha `false` a menos que isso mude. |

## Mapeamento de status

A cor de cada linha é decidida pelo texto exato que a API manda em `situacaoDescricao` (tabela `CORES_POR_SITUACAO` em `backend/src/mappers.ts`, espelhada em `frontend/src/lib/situacoes.ts` pra legenda), não por um código numérico. Para o painel de Mistura Fina, a legenda tem apenas duas cores: `Geradas` em branco e `Liberadas` em verde. Se a API um dia mandar um texto diferente, a linha cai no cinza de fallback em vez de quebrar — é só adicionar a grafia nova na tabela.
