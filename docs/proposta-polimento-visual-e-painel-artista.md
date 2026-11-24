# Projeto de implementação: polimento visual e painel da artista

**Status:** aprovada para implementação em etapas, com validação manual do usuário entre elas.  
**Escopo:** melhorar a experiência pública e permitir que a artista gerencie o site po

## 1. Visão geralr um único endereço de administração.

O projeto já tem os fluxos essenciais funcionando: galeria de peças prontas, detalhe e solicitação de compra, página de encomendas, autenticação e painel de administração. O backend também já possui um modelo `CommissionType` com nome, preço mínimo/máximo, regras e estado ativo, além de operações de criação, edição e exclusão.

A lacuna principal está entre essa estrutura e a experiência de uso: a página pública de encomendas exibe uma tabela simples, mas o painel não oferece à artista uma área para manter esses tipos e preços. O painel atual reúne cadastro de desenho e fila de encomendas; a galeria e as tabelas também precisam de melhor adaptação visual para celular.

**Proposta:** manter o caráter acolhedor da identidade bordô, dourado e creme; dar mais protagonismo às ilustrações; e transformar `/admin` num painel único, protegido e simples para manter desenhos, tabela de encomendas e fila.

## 2. Leitura do estado atual

### O que já existe

- Frontend em React, Vite, TypeScript e Tailwind; API em Express; PostgreSQL com Prisma.
- Rotas públicas para galeria, detalhes, compra e tipos ativos de encomenda.
- Login admin com JWT, rota `/admin` protegida no frontend e saída da sessão.
- Admin para adicionar desenhos, mudar o status das peças e consultar/ordenar a fila.
- Modelo e endpoints CRUD para tipos de encomenda.
- Identidade visual inicial com Fraunces e Inter e tokens bordô, dourado, coral, creme e rosa empoeirado.
- Página pública de encomendas já mostra tipo, preço e regras e oferece formulário para entrar na fila.

### O que falta ou merece atenção

1. **Não há gestão de tipos de encomenda no admin.** A artista não consegue criar, editar, ativar ou pausar os tipos e preços pela interface.
2. **As rotas de escrita de `/commission-types` não aplicam `verifyToken`.** `POST`, `PUT` e `DELETE` estão sem proteção no arquivo atual, embora o README diga que são restritas ao admin. Corrigir isso antes de disponibilizar a edição.
3. **A página pública usa uma tabela de três colunas.** Em telefone, nome, preço e regras competem por espaço e podem ficar difíceis de ler.
4. **O admin usa tabelas largas para desenhos e fila.** Elas precisam de uma versão em cards ou layout adaptável em telas estreitas.
5. **Há estados de erro tratados de forma desigual.** Por exemplo, algumas ações do admin não exibem falha de rede ou confirmação de salvamento.
6. **A tela de login ainda usa estilos genéricos claros/pretos**, desconectados da paleta do site.
7. **Cards e detalhe usam `object-cover`** nas imagens. Dependendo do formato da ilustração, isso pode cortar partes importantes.
8. **O documento de perfil indica que o site público deve ser em inglês e usar USD.** O exemplo de R$ 50 da solicitação deve ser tratado como exemplo de preço editável; confirmar moeda e valores reais com a artista antes da publicação.

### Alteração local já existente

O workspace já tem uma mudança não commitada em `backend/prisma/schema.prisma`: `CommissionType.sampleImageUrl` foi adicionado. Este plano considera esse trabalho existente e propõe aproveitá-lo para uma imagem de exemplo por tipo. Antes da implementação, será preciso verificar se a migration, as rotas, os tipos e o formulário já foram iniciados; a mudança não deve ser descartada nem sobrescrita.

## 3. Direção de design

### Manter a assinatura da artista

- Base bordô escura (`#2B1015`), superfícies vinho (`#3D1B22`), dourado (`#D4A855`) e texto creme (`#F3E7DC`).
- Fraunces para títulos e Inter para interface e leitura longa.
- Brilhos de quatro pontas discretos como detalhe em títulos ou separadores, sem espalhá-los em cada card.
- Botão dourado reservado para a ação principal de cada tela; o Discord aparece como canal de contato.
- Interface pública em inglês, conforme o perfil entregue. Admin também pode começar em inglês para manter consistência; a decisão de idioma do painel pode ser confirmada antes de codificar.

### Dar prioridade à arte e ao celular

- A galeria começa com um cabeçalho mais editorial: nome/assinatura da artista, frase curta, chamada para comissões e navegação clara entre Gallery e Commissions.
- Usar moldura escura e imagem sem cortes involuntários (`object-contain` ou proporção definida conforme o conteúdo), com fundo que complemente PNG transparente.
- Cards com título, preço e status em hierarquia curta; hover e transições sutis, mantendo foco visível para teclado e respeito à preferência por movimento reduzido.
- Em celular, usar cards de encomenda empilhados com nome, exemplo visual, preço, descrição e botão de ação. Em telas largas, distribuir em grid; evitar forçar a tabela atual em uma largura que não comporta as regras.
- Rever espaçamentos, tamanhos de toque, contraste, foco, carregamento, estado vazio e mensagens de erro nas páginas públicas e no admin.

### Referências consultadas

As páginas abaixo servem como inspiração de organização e clareza de informação, não como modelo para copiar a identidade visual:

- [TiinTina — Commissions](https://www.tiintina.com/commissions): associa cada faixa a uma descrição concreta, itens incluídos, exemplos/ação de pedido e explica custos adicionais e confirmação final de preço.
- [Art of Nakoo — Commission Information](https://www.nakoo.art/commission-information.html): organiza serviços por categoria, combina preço base com escopo e ressalta extras como personagens e cenários complexos.
- [Saraemi — Commission](https://saraemi.com/en/commission/): separa modalidades, inclui entregáveis e adicionais e direciona para contato quando o pedido foge do menu.

Aplicação ao projeto: cada opção (por exemplo, **Half Body**) deve deixar evidente o que o preço cobre e mostrar uma imagem real de referência quando disponível. Não importar os preços desses sites.

## 4. Painel único da artista

### Endereço e acesso

- Usar `https://galeria-desenhos.vercel.app/admin` como endereço único para a dona do site.
- Se não houver sessão, `/admin` encaminha para o login; após autenticar, volta ao painel. A cliente pode salvar `/admin` nos favoritos e não precisa decorar `/login`.
- O link não será um segredo: a proteção real continua sendo autenticação no frontend e, principalmente, validação JWT em todas as rotas privadas do backend.
- Não colocar atalho de administração em destaque na navegação pública. A artista usa o endereço direto.

### Navegação dentro do admin

Transformar o dashboard atual em uma navegação clara, com abas ou seções:

1. **Overview:** resumo enxuto de desenhos disponíveis, pedidos pendentes e encomendas na fila; atalhos para as tarefas comuns.
2. **Gallery:** cadastrar, editar, visualizar e remover/arquivar peças; mudar status sem procurar numa tabela larga.
3. **Commission menu:** cadastrar e editar modalidades, preço, descrição/regras, exemplo visual e disponibilidade.
4. **Queue:** ver cliente, contato, tipo escolhido, posição e status; editar status e prioridade; distinguir pedidos legados recebidos via WhatsApp de novos pedidos via Discord.

No celular, navegação em abas compactas ou menu recolhível e ações com áreas de toque confortáveis. No desktop, manter a navegação sempre visível.

## 5. Tabela de tipos e preços editável

### Experiência da artista

Dentro de **Commission menu**, permitir:

- Criar um tipo, por exemplo `Half Body`.
- Preencher preço, descrição/itens incluídos e regras curtas.
- Opcionalmente anexar uma imagem de exemplo, aproveitando `sampleImageUrl` e o fluxo de upload existente.
- Marcar o tipo como disponível ou pausado para novos pedidos.
- Editar e reordenar a apresentação pública dos tipos.
- Visualizar uma prévia em inglês da página pública antes de salvar.
- Mostrar sucesso/erro de salvamento e pedir confirmação antes de ações irreversíveis.

### Exemplo de conteúdo (ilustrativo, não é preço aprovado)

| Tipo | Preço | Descrição exibida |
|---|---:|---|
| Half Body | `50` na moeda configurada | One character, waist-up, simple background. PNG delivery. Complex details may cost extra. |

O perfil da cliente especifica **USD** e o exemplo do pedido menciona **R$ 50**. O painel não deve misturar símbolos ou converter valores implicitamente. Na primeira versão, manter a moeda do site configurada explicitamente (atualmente `formatPrice` usa USD) e pedir validação da artista para os valores/moeda reais.

### Dados e compatibilidade

- Reutilizar `CommissionType.name`, `rules`, `active`, `priceMin` e `priceMax` no MVP. Para preço fixo, salvar o mesmo valor nos campos mínimo e máximo; assim o schema atual e os pedidos existentes continuam compatíveis.
- Na apresentação, se mínimo e máximo forem iguais, mostrar um preço único (`$50`); se forem diferentes, mostrar faixa (`$50–$80`).
- Considerar a mudança local `sampleImageUrl` já presente e completar seu caminho ponta a ponta: migration versionada, validação/API, tipo TypeScript, upload/seleção no admin e exibição pública.
- A estrutura atual já relaciona pedidos a um tipo de encomenda. Se um tipo estiver associado a pedidos, preferir **pausar** (`active = false`) em vez de excluir; isso mantém o histórico e evita erro de chave estrangeira. Na interface, alertar sobre esse comportamento.
- Não adicionar agora uma modelagem complexa de adicionais, descontos ou múltiplas moedas. Se a artista realmente precisar desses casos, desenhar uma segunda etapa após validar o fluxo básico.

## 6. Plano de implementação por etapas

### Etapa 0 — Verificação e segurança (bloqueador)

- Revisar a alteração já existente de `sampleImageUrl`, migrations e estado do banco.
- Colocar `verifyToken` em `POST`, `PUT` e `DELETE /commission-types`; confirmar que endpoints de desenhos, fila e upload também aplicam autenticação em todas as escritas.
- Acrescentar validações no backend: nome não vazio, preços numéricos válidos, mínimo ≤ máximo, descrição com limite razoável e `active` booleano.
- Não confiar apenas em esconder botões ou proteger rota React.

**Pronto quando:** chamadas sem token não conseguem alterar tipos; artista autenticada consegue consultar e salvar; tipo com pedido vinculado pode ser pausado sem apagar o histórico.

### Etapa 1 — Sistema visual e experiência pública

- Revisar tokens, tipografia, largura de conteúdo, espaçamentos e componentes de botão/card/input.
- Refinar cabeçalho da galeria e destacar a navegação Gallery/Commissions.
- Ajustar cartões e detalhe para preservar composição das ilustrações e seus fundos transparentes.
- Converter a tabela pública de comissões em cards responsivos; mostrar preço único ou faixa, resumo de escopo, regras e CTA claro.
- Harmonizar login com a marca, estados de foco/erro/carregamento e mensagens de retorno.

**Pronto quando:** fluxos públicos são legíveis em celular sem rolagem horizontal; arte não aparece cortada por padrão; idioma e moeda seguem a configuração validada.

### Etapa 2 — Painel da artista e menu de preços

- Construir navegação Overview / Gallery / Commission menu / Queue dentro do `/admin`.
- Criar formulário de modalidade com nome, preço fixo ou faixa, descrição, exemplo visual opcional e ativo/pausado.
- Conectar operações às rotas existentes e completar upload do exemplo.
- Criar cards de administração para telas pequenas e exibir feedback para cada ação.
- Remover dependência de exclusão para esconder uma modalidade: a ação principal será pausar/reativar.

**Pronto quando:** artista administra os tipos, valores e descrições sem editar código ou banco; a página pública reflete a alteração; o painel permanece utilizável em celular.

### Etapa 3 — Refinamento e publicação

- Revisar conteúdo em inglês com a artista: nomes, descrições, termos, moeda e preços.
- Revisar imagens de exemplo e texto alternativo.
- Fazer uma passada de acessibilidade visual e responsividade em larguras pequenas e desktop.
- Conferir variáveis de ambiente, migrations e comportamento do backend antes do deploy.
- Publicar a interface e API em sequência compatível, e entregar à artista o endereço `/admin` e instruções curtas de acesso.

## 7. Critérios de aceite do projeto

- A cliente consegue abrir um endereço (`/admin`), entrar e acessar todas as tarefas administrativas do site.
- A artista pode criar, editar, ativar e pausar um tipo de encomenda sem mexer em arquivos ou solicitar ajuda técnica.
- Um tipo tem nome, preço fixo/faixa, descrição/regras e imagem de exemplo opcional.
- Preço fixo aparece como um valor; faixa continua possível; moeda fica explícita e consistente.
- As alterações aparecem na página pública de comissões e os tipos pausados não podem ser pedidos.
- Os endpoints administrativos recusam chamadas sem token válido.
- A fila continua vinculada ao tipo que o cliente escolheu; mudanças futuras no menu não apagam pedidos antigos.
- Galeria, comissões, login e admin funcionam em celular e desktop, com estados de carregamento, erro e vazio compreensíveis.
- Nenhuma alteração local já iniciada no schema é perdida; migration e contrato API acompanham a mudança aprovada.

## 8. Decisões para confirmar antes de implementar

1. A cliente confirma **USD** como moeda final? O perfil diz USD, enquanto o exemplo da solicitação usa R$ 50.
2. Ela quer preços fixos por tipo, faixas (`from–to`) ou ambos? A proposta suporta ambos, com preço fixo como `min = max`.
3. A descrição de cada tipo ficará em inglês para a página pública? Recomendo sim; o painel pode ter rótulos em português ou inglês conforme preferência da artista.
4. `sampleImageUrl` será imagem ilustrativa do tipo de encomenda? Recomendo sim, com upload opcional.
5. O contato público usará Discord; o perfil exato será configurado depois, com um link genérico nesta etapa.

## 9. Fora do escopo inicial

- Pagamento online, cálculo automático de extras, conversão cambial e gestão de múltiplos idiomas.
- Alteração de identidade para fundo claro ou estética corporativa.
- Troca do banco, plataforma de deploy ou provedor de imagens.
- Exclusão automática de pedidos antigos quando um tipo de comissão é removido.

## Resumo para aprovação

Implementar em etapas para revisão manual entre mudanças: primeiro proteger as rotas, polir as páginas principais, migrar o contato para Discord e entregar o menu de preços editável em `/admin`; depois completar o About Me e as configurações editáveis de pagamentos e contato. A identidade do perfil e os meios de pagamento ficam configuráveis, sem inventar dados da cliente.
