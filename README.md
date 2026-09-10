# galeria-desenhos

A web platform for a digital artist to showcase and sell original drawings and take custom commissions. Includes an admin panel for status management (available, pending, reserved, sold) and a priority queue for commissions.

🔗 **Live site**: https://galeria-desenhos.vercel.app
🔗 **API**: https://galeria-desenhos.onrender.com

*(Note: the backend is on Render's free tier and may take 30-50s to wake up after inactivity.)*

[Diagrams overview](docs/galeria-desenhos-diagramas.drawio)

## Status do projeto

🚧 Em desenvolvimento — construído publicamente como projeto de portfólio e aprendizado full stack.

- [x] Fase 0 — Modelagem (UML / ER)
- [x] Fase 1 — Setup do repositório
- [x] Fase 2 — Modelagem do banco de dados
- [x] Fase 3 — API: CRUD de desenhos
- [x] Fase 4 — API: encomendas e fila
- [x] Fase 5 — Autenticação admin
- [x] Fase 6 — Upload de imagem
- [x] Fase 7 — Frontend: setup e galeria pública
- [x] Fase 8 — Frontend: fluxo de compra
- [x] Fase 9 — Frontend: encomendas
- [x] Fase 10 — Frontend: painel admin
- [x] Fase 11 — Integração e testes
- [x] Fase 12 — Deploy
- [ ] Fase 13 — Polimento visual

**Site completo no ar** ✅ — front, back, banco e upload de imagem funcionando em produção.

## Sobre o projeto

O site tem dois fluxos principais:

- **Galeria de peças prontas**: desenhos já finalizados, cada um com preço fixo. O visitante escolhe um, é direcionado a uma tela com valor e contato via WhatsApp, e o desenho fica com status `pendente` até a artista confirmar ou negar a venda.
- **Encomendas sob medida**: o visitante escolhe um tipo (Bust-up, Half Body, Full Body, Character Design, Chibi...) a partir de uma tabela de preços, e entra numa fila de prioridade gerenciada pela artista.

Toda a gestão (cadastrar/remover desenho, mudar status, gerenciar fila de encomendas) é feita por um painel administrativo restrito à artista.

**Nota de idioma**: o frontend (interface visível ao público) é todo em inglês, já que a clientela da artista fala inglês. O backend (código, comentários, mensagens de log) está em português.

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
├── frontend/                # aplicação React (interface em inglês)
│   └── src/
│       ├── pages/             # páginas (galeria, detalhe, compra, encomendas, admin, login)
│       ├── components/        # componentes reutilizáveis (+ admin/)
│       ├── context/           # AuthContext (login/logout)
│       ├── services/          # chamadas à API
│       ├── types/             # tipos TypeScript
│       └── utils/              # formatação de preço, labels de status
├── backend/                 # API Node/Express (português)
│   ├── prisma/                # schema, migrations e seed do banco
│   └── src/
│       ├── routes/             # rotas da API
│       ├── middleware/         # autenticação (JWT) e upload (Cloudinary)
│       └── config/             # configuração de serviços externos
├── docs/
│   └── diagrams/                # diagramas ER e de sequência (.drawio + .png)
└── README.md
```

## Endpoints da API

Base: `https://galeria-desenhos.onrender.com` (produção) ou `http://localhost:3333` (local)

### Autenticação
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/auth/login` | Público | Login da artista, retorna um token JWT |

### Desenhos (galeria)
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/drawings` | Público | Lista todos os desenhos |
| GET | `/drawings/:id` | Público | Busca um desenho específico |
| POST | `/drawings/:id/request-purchase` | Público | Marca um desenho como pendente (fluxo de compra) |
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

## Rodando localmente

### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
node prisma/seed.js   # cria a conta admin
node src/server.js
```
Requer um `.env` com: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Requer um `.env` com: `VITE_API_URL` (URL do backend), `VITE_WHATSAPP_NUMBER`.

## Deploy

- **Frontend**: Vercel, root directory `frontend`, deploy automático a cada push na `main`
- **Backend**: Render (Web Service, free tier), root directory `backend`, build command `npm install && npx prisma generate`, start command `node src/server.js`
- **Banco**: Neon (PostgreSQL serverless), mesma instância usada em desenvolvimento e produção

## Documentação

Os diagramas de modelagem do projeto (entidade-relacionamento e fluxo de sequência da compra) estão em [`docs/diagrams`](docs/diagrams).

## Licença

Este projeto está sob a licença MIT.
