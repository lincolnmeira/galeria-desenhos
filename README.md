# galeria-desenhos

Plataforma web para artista digital divulgar e vender desenhos originais e receber encomendas sob medida. Inclui painel administrativo para gestão de status (disponível, pendente, reservado, vendido) e fila de prioridade para encomendas.

[Visão geral dos diagramas](docs/galeria-desenhos-diagramas.drawio)

## Status do projeto

🚧 Em desenvolvimento — construído publicamente como projeto de portfólio e aprendizado full stack.

- [x] Fase 0 — Modelagem (UML / ER)
- [x] Fase 1 — Setup do repositório
- [x] Fase 2 — Modelagem do banco de dados
- [x] Fase 3 — API: CRUD de desenhos
- [x] Fase 4 — API: encomendas e fila
- [x] Fase 5 — Autenticação admin
- [x] Fase 6 — Upload de imagem
- [ ] Fase 7 — Frontend: setup e galeria pública
- [ ] Fase 8 — Frontend: fluxo de compra
- [ ] Fase 9 — Frontend: encomendas
- [ ] Fase 10 — Frontend: painel admin
- [ ] Fase 11 — Integração e testes
- [ ] Fase 12 — Deploy
- [ ] Fase 13 — Polimento visual

**Backend funcionalmente completo** ✅ — API, banco de dados, autenticação e upload de imagem já estão no ar e testados. A partir daqui o projeto entra na etapa de frontend.

## Sobre o projeto

O site tem dois fluxos principais:

- **Galeria de peças prontas**: desenhos já finalizados, cada um com preço fixo. O visitante escolhe um, é direcionado a uma tela com valor e contato via WhatsApp, e o desenho fica com status `pendente` até a artista confirmar ou negar a venda.

- **Encomendas sob medida**: o visitante escolhe um tipo (Bust-up, Half Body, Full Body, Character Design, Chibi...) a partir de uma tabela de preços, e entra numa fila de prioridade gerenciada pela artista.

Toda a gestão (cadastrar/remover desenho, mudar status, gerenciar fila de encomendas) é feita por um painel administrativo restrito à artista.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Backend | Node.js + Express |
| Banco de dados | PostgreSQL (Neon) + Prisma ORM |
| Autenticação | JWT + bcrypt |
| Upload de imagens | Multer + Cloudinary |
| Deploy | Vercel (frontend) · Render (backend) · Neon (banco) |

## Estrutura do repositório

```
galeria-desenhos/
├── frontend/              # aplicação React (inglês)
├── backend/                # API Node/Express (português)
│   ├── prisma/              # schema, migrations e seed do banco
│   └── src/
│       ├── routes/           # rotas da API
│       ├── middleware/       # autenticação (JWT) e upload (Cloudinary)
│       └── config/           # configuração de serviços externos
├── docs/
│   └── diagrams/             # diagramas ER e de sequência (.drawio + .png)
└── README.md
```

## Endpoints da API

Base local: `http://localhost:3333`

### Autenticação

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/auth/login` | Público | Login da artista, retorna um token JWT |

### Desenhos (galeria)

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/drawings` | Público | Lista todos os desenhos |
| GET | `/drawings/:id` | Público | Busca um desenho específico |
| POST | `/drawings` | 🔒 Admin | Cria um novo desenho |
| PUT | `/drawings/:id` | 🔒 Admin | Edita um desenho (inclui trocar status) |
| DELETE | `/drawings/:id` | 🔒 Admin | Remove um desenho |

### Tipos de encomenda

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/commission-types` | Público | Lista os tipos disponíveis (tabela de preços) |
| GET | `/commission-types/:id` | Público | Busca um tipo específico |
| POST | `/commission-types` | 🔒 Admin | Cria um novo tipo |
| PUT | `/commission-types/:id` | 🔒 Admin | Edita um tipo |
| DELETE | `/commission-types/:id` | 🔒 Admin | Remove um tipo |

### Encomendas (fila)

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/commission-orders` | Público | Cliente solicita uma encomenda (entra no fim da fila) |
| GET | `/commission-orders` | 🔒 Admin | Lista a fila, ordenada por prioridade |
| GET | `/commission-orders/:id` | 🔒 Admin | Busca uma encomenda específica |
| PUT | `/commission-orders/:id` | 🔒 Admin | Edita status ou reordena prioridade |
| DELETE | `/commission-orders/:id` | 🔒 Admin | Remove uma encomenda |

### Upload de imagem

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/upload` | 🔒 Admin | Envia uma imagem (PNG) e retorna a URL do Cloudinary |

## Rodando localmente (backend)

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
node prisma/seed.js   # cria a conta admin
node src/server.js
```

Requer um arquivo `.env` com: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

## Documentação

Os diagramas de modelagem do projeto (entidade-relacionamento e fluxo de sequência da compra) estão em [`docs/diagrams`](docs/diagrams).

## Licença

Este projeto está sob a licença MIT.