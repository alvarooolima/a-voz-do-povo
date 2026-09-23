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
