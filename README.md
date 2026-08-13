# \# galeria-desenhos

# 

# Plataforma web para artista digital divulgar e vender desenhos originais e receber encomendas sob medida. Inclui painel administrativo para gestão de status (disponível, pendente, reservado, vendido) e fila de prioridade para encomendas.

# 

# [Visão geral dos diagramas](docs/galeria-desenhos-diagramas.drawio)

# 

# \## Status do projeto

# 

# 🚧 Em desenvolvimento — construído publicamente como projeto de portfólio e aprendizado full stack.

# 

# \- \[x] Fase 0 — Modelagem (UML / ER)

# \- \[ ] Fase 1 — Setup do repositório

# \- \[ ] Fase 2 — Modelagem do banco de dados

# \- \[ ] Fase 3 — API: CRUD de desenhos

# \- \[ ] Fase 4 — API: encomendas e fila

# \- \[ ] Fase 5 — Autenticação admin

# \- \[ ] Fase 6 — Upload de imagem

# \- \[ ] Fase 7 — Frontend: setup e galeria pública

# \- \[ ] Fase 8 — Frontend: fluxo de compra

# \- \[ ] Fase 9 — Frontend: encomendas

# \- \[ ] Fase 10 — Frontend: painel admin

# \- \[ ] Fase 11 — Integração e testes

# \- \[ ] Fase 12 — Deploy

# \- \[ ] Fase 13 — Polimento visual

# 

# \## Sobre o projeto

# 

# O site tem dois fluxos principais:

# 

# \- \*\*Galeria de peças prontas\*\*: desenhos já finalizados, cada um com preço fixo. O visitante escolhe um, é direcionado a uma tela com valor e contato via WhatsApp, e o desenho fica com status `pendente` até a artista confirmar ou negar a venda.

# \- \*\*Encomendas sob medida\*\*: o visitante escolhe um tipo (Bust-up, Half Body, Full Body, Character Design, Chibi...) a partir de uma tabela de preços, e entra numa fila de prioridade gerenciada pela artista.

# 

# Toda a gestão (cadastrar/remover desenho, mudar status, gerenciar fila de encomendas) é feita por um painel administrativo restrito à artista.

# 

# \## Tecnologias

# 

# | Camada | Tecnologia |

# |---|---|

# | Frontend | React + Vite + TypeScript + Tailwind CSS |

# | Backend | Node.js + Express |

# | Banco de dados | PostgreSQL + Prisma ORM |

# | Autenticação | JWT + bcrypt |

# | Imagens | Cloudinary |

# | Deploy | Vercel (frontend) · Render (backend) · Neon (banco) |

# 

# \## Estrutura do repositório

# 

# ```

# galeria-desenhos/

# ├── frontend/           # aplicação React (inglês)

# ├── backend/            # API Node/Express (português)

# ├── docs/

# │   └── diagrams/        # diagramas ER e de sequência (.drawio + .png)

# └── README.md

# ```

# 

# \## Documentação

# 

# Os diagramas de modelagem do projeto (entidade-relacionamento e fluxo de sequência da compra) estão em \[`docs/diagrams`](docs/diagrams).

# 

# \## Licença

# 

# Este projeto está sob a licença MIT.

