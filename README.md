# A Voz do Povo

Site cidadão para relatar problemas urbanos (buracos, poda de árvores, iluminação, calçadas, lixo etc.) com foto, comentário e acompanhamento de status. Inspirado na funcionalidade de "zeladoria colaborativa" do Colab (colab.com.br/sou-governo).

## Estrutura
```
a-voz-do-povo/
├── index.html      → página inicial (hero, categorias, formulário de relato, feed)
├── login.html      → login / cadastro (com tipo de conta) / esqueci a senha
├── prefeito.html   → avaliação do prefeito (nome, foto, partido e nota em estrelas)
├── historico.html  → histórico de partidos no poder, com gráfico e linha do tempo
├── styles.css      → design system (azul royal + branco)
├── main.js         → lógica da página inicial (relatos, feed e sessão/papéis)
├── auth.js         → lógica de autenticação e cadastro (tipo de conta)
├── avaliar.js      → lógica da avaliação do prefeito
├── historico.js    → dados e renderização do histórico de partidos
├── assets/         → logotipo extraído (versões azul e branca, cheia e ícone)
└── vercel.json
```

## Deploy na Vercel
Não há build — é um site estático puro (HTML/CSS/JS). Duas formas:

**Opção A — pelo painel da Vercel**
1. Suba esta pasta para um repositório no GitHub/GitLab/Bitbucket.
2. Em vercel.com → "Add New… → Project" → importe o repositório.
3. Em "Framework Preset" escolha **Other**. Não é necessário Build Command nem Output Directory.
4. Deploy.

**Opção B — via CLI**
```bash
npm i -g vercel
cd a-voz-do-povo
vercel
```

## Importante — o que é protótipo vs. produção
- **Formulário de relato e feed de ocorrências**: funcionam de verdade no navegador, mas os dados ficam salvos em `localStorage` (só no seu dispositivo/navegador). Para virar um site real, com dados compartilhados entre todos os cidadãos, é preciso um backend (ex.: Vercel Functions + banco de dados como Postgres/Supabase) para guardar relatos e fotos.
- **Login / cadastro**: a validação de formato (e-mail, CPF com dígito verificador, telefone) é real, mas a autenticação em si é simulada localmente — não há verificação de senha contra um servidor. Para produção, plugue um provedor de autenticação (ex.: NextAuth, Clerk, Supabase Auth) e criptografe as senhas no backend.
- **Fotos**: são convertidas para base64 e guardadas localmente; num backend real, o ideal é subir para um storage (ex.: Vercel Blob, S3, Cloudinary).

## Avaliação do prefeito e reputação (inspirado no Reclame Aqui)
A página `prefeito.html` mostra o perfil do prefeito (nome, foto, partido e mandato), um selo de "gestão verificada" e um **selo de reputação** (Reputação Ruim/Regular/Boa/Ótima/Voz 1000), calculado a partir da nota média das avaliações e da taxa de resolução dos relatos — a mesma lógica do selo RA1000 do Reclame Aqui, adaptada para governos. Abaixo, um **painel de desempenho** mostra relatos recebidos, % respondidos, aguardando resposta, % resolvidos, nota do cidadão (0–10) e tempo médio de resposta.

Qualquer visitante pode dar uma nota de 1 a 5 estrelas com comentário opcional; a média, o selo e a lista de avaliações ficam em `localStorage`. Para editar os dados do prefeito, altere o objeto `MAYOR` no topo de `avaliar.js`; para usar uma foto real, defina `foto: 'assets/sua-foto.jpg'`.

## Hero com busca e ferramentas (inspirado no Reclame Aqui)
A seção inicial ganhou a mesma estrutura da home do Reclame Aqui — busca em destaque + linha de "ferramentas para você" — adaptada à nossa identidade: campo de busca que filtra as ocorrências por rua, bairro, categoria ou palavra-chave (rola até o feed e mostra um indicador "Resultados para..." com opção de limpar), e 4 atalhos (Reportar problema, Ver ocorrências, Avalie o prefeito, Painel da prefeitura).

## Apresentação em páginas (primeira visita)
Na primeira visita, `index.html` abre uma apresentação em tela cheia, em 3 "páginas" (estilo livro), para qualquer pessoa entender o site sem rolar a tela: (1) o que é — um canal direto entre a população e a prefeitura; (2) como funciona em 3 passos; (3) como todos participam (comentar, avaliar o prefeito, ver o histórico de partidos), já com a chamada para começar embaixo (reportar, ver o mapa/relatos ou só explorar). Fica salva em `localStorage` (`avozdopovo_intro_visto`) e não reabre sozinha; pode ser revista pelo botão "Primeira vez aqui? Entenda o site em 1 minuto" no hero, pelo item "Entenda o site" do menu "Para você" (em qualquer página, via `index.html?intro=1`).

**No celular (até 760px) a apresentação é a página inicial:** ela abre a cada visita a `index.html` (exceto quando o endereço tem `#âncora`), e o primeiro slide oferece duas escolhas — "Ler o passo a passo" (segue para os slides) ou "Explorar o site" (fecha e mostra o site). No desktop continua abrindo só na primeira visita. Os slides usam `100dvh` e respeitam a área segura do iPhone, e foram ajustados para caber sem rolagem em telas de ~390×660 (a apresentação já é a porta de entrada, então o botão "Primeira vez aqui?" some do hero no celular). Na home do celular (e do tablet), o topo tem só a marca à esquerda e o hambúrguer (em caixinha arredondada) à direita, o título tem no máximo 3 linhas (o rótulo "Participação cidadã" e o subtítulo somem para deixar a tela limpa), a busca é uma caixa única com a lupa à direita (sem o botão "Buscar"; o Enter e a lupa buscam), os atalhos de "Ferramentas para você" têm ícone ao lado do texto, e a ordem segue o Reclame Aqui: texto e busca → "Ferramentas para você" → foto → resto da página.

Escolhas de UX/acessibilidade: uma ideia por página (menos carga cognitiva), linguagem simples e frases curtas, textos grandes e alto contraste, botões grandes (mín. 56px) com "Voltar/Próximo" sempre no mesmo lugar, indicador "Página X de 3" mais pontos de progresso, passos ligados por uma linha (gestalt: continuidade/proximidade), botão principal destacado só na última página (poucas escolhas), navegação por teclado (setas, Esc), gesto de deslizar no celular, foco preso no diálogo e animação desativada para quem prefere menos movimento (`prefers-reduced-motion`). O texto e as ilustrações ficam em `index.html`; a lógica em `intro.js`.

## Largura e alinhamento (padrão Reclame Aqui)
Todo o site usa o mesmo container de até 1500px (`.wrap`), como no Reclame Aqui: o logo, o topo (título, busca e ferramentas), o texto "Descubra o que a sua cidade está resolvendo" e os dois painéis abaixo compartilham a mesma borda esquerda e direita. No topo, a foto ficou retangular e larga (proporção 1,2:1, ≈698×582px) ocupando a metade direita, e os botões de ferramentas têm ≈115px de altura, alinhados à largura da busca. No celular e tablet a foto vai para cima, em largura total.

## Categorias e "Como funciona" lado a lado
Logo abaixo do topo, dois painéis claros **iguais** lado a lado (no estilo "Melhores/Piores empresas" do Reclame Aqui), cada um com o título dentro e **3 cards do mesmo tamanho** (≈207×248px: ícone de 42px, selo de posição de 34px, faixa de status de 54px). À esquerda, **"O que você pode relatar"**, um carrossel de categorias (2 slides de 3 cards); à direita, **"Como funciona"**, com os 3 passos no mesmo formato de card. Cada card de categoria é clicável ("Ver relatos" daquela categoria no feed) e mostra quantos relatos e resolvidos ela tem (calculado dos relatos reais); "Reportar problema →" e "Entenda o site em 1 minuto →" ficam no rodapé de cada painel.

A seção usa um container mais largo (até 1500px) para caber os dois painéis como no Reclame Aqui. Abaixo de 1280px os painéis se empilham (cada um ocupando a largura toda) e, no celular (até 760px), os cards ficam 1 por linha e o carrossel mostra 1 categoria por slide. Navega por setas, pontos, teclado (← →) ou deslizando (scroll-snap nativo, sem rotação automática). As categorias vêm do array `CATEGORIES` em `main.js`.

## Mapa das ocorrências
Ideia do Vitor: no fim da página, logo abaixo de "Reportar problema", vêm dois cards de largura total, um embaixo do outro: primeiro "Veja onde estão os problemas da sua região" (o mapa, que mostra de cara que o problema é real e perto de quem vê) e, logo abaixo, "Ocorrências da cidade" (o feed com filtro, curtidas e comentários). Um mapa (Leaflet + OpenStreetMap, embutidos em `assets/leaflet/`, sem chave de API) com um pino por relato, colorido pelo status (em análise, em andamento, resolvido). Ao tocar num pino — ou em qualquer ponto do mapa — o painel ao lado lista os relatos num raio de 400 m com **o que a vizinhança está comentando por perto**, e permite "Ver no mapa", "Abrir relato" (leva ao feed) ou "Reportar neste ponto". O botão "Usar minha localização" centraliza o mapa onde você está.

**Zoom e Google Maps:** dá para aproximar/afastar com o scroll do mouse, a pinça no trackpad (Chrome/Firefox enviam como Ctrl+roda; o Safari tem tratamento próprio de gestos) e a pinça no celular. Há links do Google Maps (sem chave de API, só URLs): "Abrir no Google Maps" no topo do mapa (abre a mesma região), "Abrir este ponto no Google Maps" ao selecionar uma área, "Google Maps ↗" e "Como chegar ↗" em cada relato e "Conferir no Google Maps" ao marcar o local no formulário. Para exibir o mapa *do Google* dentro do site seria preciso uma chave da Maps JavaScript API (com faturamento); o mapa atual usa OpenStreetMap, que é gratuito.

Para os relatos aparecerem no mapa eles precisam de localização: o formulário de relato ganhou um seletor de local (botão "Usar minha localização" ou toque no mapa; o pino pode ser arrastado) e salva `lat`/`lng` junto com o relato. Relatos sem localização continuam no feed, mas não têm pino. A localização só é pedida quando a pessoa clica no botão e não sai do navegador. O centro do mapa e as coordenadas dos relatos de demonstração ficam no topo de `map.js` (`CITY`, `SEED_COORDS`) — troque `CITY` pelo centro da sua cidade.

## Feed com curtidas, comentários e filtro
Cada relato no feed de ocorrências agora funciona como um mini post de rede social:
- **👍 Curtir** — substitui o antigo botão de apoio (▲); clique novamente para descurtir. Um clique por navegador, como antes.
- **💬 Comentar** — abre um painel com os comentários daquele relato e um campo para escrever um novo. Comentários aparecem com o nome de quem está logado (ou "Morador da cidade" se ninguém estiver) e ficam salvos em `localStorage` (`avozdopovo_comentarios`).
- **Filtrar** — os filtros de status (Em análise, Em andamento, Resolvido, Respondidos, Não respondidos) agora vivem dentro de um único botão dropdown ("Filtrar: Todos ▾"), em vez de vários chips soltos.

## Três perfis de acesso
No cadastro (`login.html`), a pessoa escolhe um **tipo de conta**:
- **Cidadão** — reporta problemas e avalia a gestão do prefeito (padrão).
- **Prefeitura** — além de tudo que o cidadão faz, pode **responder oficialmente** aos relatos no feed (o botão "Responder oficialmente" só aparece pra quem estiver logado com esse papel, ou o de prefeito). Pede **CNPJ** em vez de CPF no cadastro.
- **Prefeito** — exige informar o **partido** (obrigatório) e também pede **CNPJ**. O nome e o partido dessa conta passam a ser exibidos automaticamente em `prefeito.html` e em `historico.html`, substituindo o perfil de demonstração. Também pode responder relatos, como a prefeitura.

O campo de documento muda de "CPF" para "CNPJ" (com máscara e dígito verificador próprios) conforme o tipo de conta escolhido no cadastro. No login, como o tipo só é conhecido depois de localizar a conta pelo e-mail, o campo aceita CPF ou CNPJ e detecta qual é pela quantidade de dígitos.

O papel (`tipo`) fica salvo na sessão (`localStorage`) junto com o cadastro do usuário — é um protótipo local, então login não verifica senha de verdade (ver seção abaixo), mas os menus, botões e permissões (responder relatos, aparecer como prefeito) já reagem de verdade ao tipo de conta logada. O menu "Para a prefeitura" no cabeçalho mostra "Sou da prefeitura ou prefeito" (leva ao cadastro) para quem não tem esse papel, e "Responder relatos" para quem tem.

## Histórico de partidos
A página `historico.html` mostra um gráfico de barras com quantos anos cada partido ficou no poder e uma linha do tempo com o que cada gestão fez. O último item é dinâmico: puxa o partido de quem estiver cadastrado como "Prefeito"; as gestões passadas são dados de demonstração editáveis em `HISTORICO_PASSADO`, no topo de `historico.js`.

## Identidade visual
- **Tipografia**: Inter (sans-serif) em todo o site — sem serifa, pensada para leitura fácil em qualquer idade.
- **Logotipo**: apenas o texto "A Voz do Povo" (sem ícone/símbolo) no cabeçalho e nas páginas de login/cadastro. Os arquivos de ilustração extraídos ficam em `assets/` (`logo-*.png`, `mark-*.png`) caso queira reaproveitá-los em outro lugar.
- **Fundo**: todas as páginas são brancas; onde há "balões" (badges, chips, cartões de estatística — como no Reclame Aqui), eles ficam dentro de um painel com fundo azul royal bem claro (classe `.balloon-panel`).
- **Cabeçalho**: minimalista, no formato do Reclame Aqui — wordmark + dois menus dropdown ("Para você" / "Para a prefeitura") + botões "Entrar" e "Criar conta".
- **Mobile e tablet (≤920px)**: mesma lógica do app do Reclame Aqui — o cabeçalho mostra só a marca e o menu hambúrguer; os dois dropdowns e os botões Entrar/Criar conta ficam dentro do painel do hambúrguer. Na página inicial, ao rolar para além da busca do hero, a marca dá lugar a um campo de busca compacto fixo no topo (volta ao normal ao rolar de volta). Em telas maiores que 920px nada disso muda — o cabeçalho continua como no desktop.

## Personalização rápida
- Cores: edite as variáveis no topo de `styles.css` (`--royal`, `--royal-dark`, etc.).
- Categorias de problema: edite o array `CATEGORIES` em `main.js`.
- Dados do prefeito de demonstração: edite o objeto `MAYOR` em `avaliar.js`.
- Histórico de gestões passadas: edite o array `HISTORICO_PASSADO` em `historico.js`.
- Textos: todo o conteúdo está direto no HTML, em português.


## Para prefeituras (`para-prefeituras.html`)
Página no estilo "Para empresas" do Reclame Aqui, para convencer prefeituras a criar conta e transmitir segurança aos cidadãos: selo "Para prefeituras", título, texto, botão "Criar conta grátis" (leva ao cadastro já com o tipo Prefeitura, que pede CNPJ), link "Como funciona?", dois itens de confiança e um cartão branco com 3 benefícios (responder moradores, conta oficial e verificada, acompanhar o mapa). Abaixo, "Como funciona para a prefeitura" em 3 passos e um convite final. O mesmo bloco aparece na home logo abaixo de "Reportar problema" (e o rodapé, mais escuro, contrasta com ele como no Reclame Aqui), e há links no menu "Para a prefeitura" e no rodapé.

## Celular: deslizar em vez de rolar sem fim
Inspirado no Reclame Aqui (gravação de tela do site no iPhone), no celular (≤760px) as listas viram carrosséis com "encaixe" e a próxima cartinha aparecendo pela lateral: as ocorrências da cidade, os passos de "Como funciona" e os passos da página de prefeituras. O rodapé vira acordeão ("Para você", "Para a prefeitura", "Sobre nós"). O mapa ficou mais baixo. No desktop nada muda.
