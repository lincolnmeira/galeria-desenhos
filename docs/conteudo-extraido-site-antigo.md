# Informações legíveis nas capturas do site antigo

Esta página registra apenas o que dá para ler nas quatro imagens enviadas em 24/11/2026. Os preços aparecem em USD. O conteúdo público continua em inglês; observações de confirmação são para a artista/desenvolvedor.

## Itens que podem iniciar o menu de encomendas

| Tipo | Preço legível | Texto legível / observação |
|---|---:|---|
| Full Body | `$65 + $30 per character` | A tabela antiga mostra essa descrição de preço. Confirmar com a artista como o valor por personagem adicional entra no total. |
| Bust-up | `$30 + $15 per character` | A tabela antiga mostra essa descrição de preço. Confirmar com a artista como o valor por personagem adicional entra no total. |
| Character Design | `$80–$100` | Criar o personagem com base nas referências enviadas ou numa descrição; entregar o corpo inteiro de frente e de costas; sem sombreamento. |
| Reference Sheet | `$80` | O nome e o preço aparecem. As imagens não deixam as regras/entregáveis legíveis; confirmar vistas e escopo com a artista. |

As modalidades com preço e nome legíveis foram incluídas como dados iniciais idempotentes na migration `20261124000300_seed_visible_commission_menu` e no `backend/prisma/seed.js`. Se já houver no banco uma modalidade com o mesmo nome, ela não será sobrescrita. Na interface, a notação `base + per character` foi apresentada como preço base e taxa por personagem, com aviso para a artista confirmar a regra exata.

## Informações incompletas que não foram inventadas

- **Half Body:** o valor base está encoberto pelo ícone de reprodução. Só é possível ler `+$20 per character`; por isso, essa modalidade não entra no seed até a artista confirmar o valor base.
- **Chibi:** o título e exemplos aparecem, mas não há preço ou regras legíveis nas capturas.
- **Reference Sheet:** embora o valor de `$80` esteja visível, detalhes do pacote ainda precisam ser confirmados.
- As imagens são capturas de tela com elementos de vídeo por cima; não foram usadas como imagens de amostra no site.

## Antes de considerar os dados finais

Pedir à artista que confirme os preços, se as parcelas “per character” significam por personagem adicional, os detalhes da Reference Sheet e os preços/regras de Half Body e Chibi. Ela pode editar modalidades e descrições pelo painel `/admin` depois que as migrations estiverem aplicadas.
