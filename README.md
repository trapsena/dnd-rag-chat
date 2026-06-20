# D&D RAG Chat

Assistente de Dungeons & Dragons construído com um backend FastAPI, um frontend React/Vite e um pipeline RAG local para responder perguntas sobre regras, lore e mecânicas do jogo.

## O que este projeto faz

Com este aplicativo você pode:

- Fazer perguntas de D&D em uma interface de chat
- Receber respostas formatadas em Markdown vindas do backend RAG
- Rolar dados localmente sem chamar a API
- Usar botões rápidos para dados comuns
- Rolar atributos de personagem com `/roll stats`
- Abrir uma janela flutuante da ficha de personagem no cabeçalho
- Abrir um painel de ajuda com os comandos de dados suportados e exemplos

O projeto foi pensado para evoluir para um companheiro de mesa mais completo, com cartões reutilizáveis, ações e citações futuras.

## Funcionalidades principais

### Chat RAG

- O FastAPI expõe um endpoint único `/ask`
- O backend carrega um banco vetorial Chroma e consulta um modelo Groq
- As respostas são renderizadas no frontend com suporte a Markdown

### Comandos locais de dados

Os comandos de dados são processados no frontend e não são enviados ao backend RAG.

Exemplos suportados:

- `/r 3d6+2`
- `/roll 2d6+5 + 1d8`
- `/roll 3d10k`
- `/roll 4d6k3`
- `/roll 2d20kh + 2`
- `/roll 4d6kl3`
- `/roll 2d20kl + 5`
- `/roll stats`

Modificadores de dados suportados:

- `kh` ou `k` - manter o maior
- `kl` - manter o menor
- `dl` ou `d` - descartar o menor
- `dh` - descartar o maior

### Rolagem de atributos

O comando `/roll stats` gera seis atributos de personagem para:

- Força
- Destreza
- Constituição
- Inteligência
- Sabedoria
- Carisma

Cada atributo usa 4d6 descartando o menor resultado.

### Janela da ficha

- O botão `Character` abre uma ficha de personagem dentro do app
- A janela pode ser arrastada e redimensionada
- O chat continua utilizável enquanto a ficha está aberta

### Painel de ajuda

- O botão `Info` abre um painel de ajuda ao lado do botão de personagem
- Ele lista todos os comandos de dados suportados
- Inclui um exemplo de rolagem de combate
- Lembra de ler a descrição de magias antes de rolar efeitos relacionados a elas

## Estrutura do projeto

- `src/backend` - aplicação FastAPI e lógica de consulta do RAG
- `src/frontend` - interface de chat em React, renderização Markdown, estilo e dados locais
- `specs` - requisitos e critérios de aceitação do projeto
- `docs` - documentação e notas de arquitetura
- `.codex` - prompts e orientações para sessões do Codex
- `tests` - notas de validação e smoke tests

## Desenvolvimento local

### Backend

Na pasta do backend:

```powershell
cd C:\Users\goten\Documents\mycloset\cod\RAG\laboratorio_inovacao_2026_1-aula10\dnd-rag-chat\src\backend
py -m uvicorn api:app --reload --host 127.0.0.1 --port 8000
```

Se `py` não estiver disponível, use o launcher do Python instalado no sistema ou ative seu ambiente virtual.

### Frontend

Na pasta do frontend:

```powershell
cd C:\Users\goten\Documents\mycloset\cod\RAG\laboratorio_inovacao_2026_1-aula10\dnd-rag-chat\src\frontend
cmd /c npm install
cmd /c npm run dev
```

Para verificar o build de produção:

```powershell
cmd /c npm run build
```

## Variáveis de ambiente

### Backend

O backend depende das variáveis do modelo e do stack de embeddings usadas pelo RAG, especialmente:

- `GROQ_API_KEY`

O conjunto exato pode variar conforme o ambiente e a configuração local.

### Frontend

O frontend pode apontar para um backend publicado configurando:

- `VITE_API_URL`

Exemplo:

```text
VITE_API_URL=https://dnd-rag-chat-production.up.railway.app
```

Se `VITE_API_URL` não estiver definido, o frontend usa `http://localhost:8000`.

## Deploy na Railway

O repositório inclui arquivos de configuração para os dois serviços:

- [src/backend/railway.json](src/backend/railway.json)
- [src/frontend/railway.json](src/frontend/railway.json)

Configuração recomendada:

### Serviço do backend

- Diretório raiz: `src/backend`
- Build: instalar as dependências do Python
- Start: executar o Uvicorn em `0.0.0.0` e `$PORT`

### Serviço do frontend

- Diretório raiz: `src/frontend`
- Build: `npm install && npm run build`
- Start: `npm run preview -- --host 0.0.0.0 --port $PORT`

Depois, configure `VITE_API_URL` no serviço do frontend com a URL do backend na Railway.

## Fluxo de inicialização

1. Leia `AGENTS.md`
2. Execute `./init.sh`
3. Inicie o backend em `src/backend`
4. Inicie o frontend em `src/frontend`

## Observações

- A lógica RAG não é um serviço separado; ela roda dentro do backend FastAPI quando `/ask` é chamado.
- O backend foi ajustado para carregar o stack RAG de forma preguiçosa, reduzindo falhas na inicialização.
- O frontend mantém a lógica de chat separada do estilo para facilitar futuras evoluções com cartões, ações e citações.
- Os metadados de recuperação são preservados para permitir citações no futuro sem reestruturar o pipeline.
