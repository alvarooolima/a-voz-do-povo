# A Voz do Povo

Site cidadão para relatar problemas urbanos (buracos, poda de árvores, iluminação, calçadas, lixo etc.) com foto, comentário e acompanhamento de status. Inspirado na funcionalidade de "zeladoria colaborativa" do Colab (colab.com.br/sou-governo).

## Estrutura
```
a-voz-do-povo/
├── index.html      → página inicial (hero, categorias, formulário de relato, feed)
├── login.html      → login / cadastro / esqueci a senha (só o formulário, sem menu)
├── prefeito.html   → avaliação do prefeito (nome, foto, partido e nota em estrelas)
├── styles.css      → design system (azul royal + branco)
├── main.js         → lógica da página inicial (relatos e feed)
├── auth.js         → lógica de autenticação
├── avaliar.js       → lógica da avaliação do prefeito
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

## Resposta oficial (modo prefeitura)
No cabeçalho, o botão **"🏛️ Painel da prefeitura"** liga um modo de demonstração (salvo em `localStorage`, sem autenticação real) que revela, em cada relato do feed, um botão "Responder oficialmente". A resposta digitada aparece publicamente no card (como a resposta de uma empresa no Reclame Aqui) e também atualiza o status do relato. O feed ganhou os filtros "Respondidos" e "Não respondidos" para acompanhar isso. Numa versão real, esse painel seria restrito a uma conta oficial da prefeitura autenticada no backend.

## Personalização rápida
- Cores: edite as variáveis no topo de `styles.css` (`--royal`, `--royal-dark`, etc.).
- Categorias de problema: edite o array `CATEGORIES` em `main.js`.
- Dados do prefeito: edite o objeto `MAYOR` em `avaliar.js`.
- Logotipo: os arquivos ficam em `assets/` (`logo-*.png` = ilustração completa, `mark-*.png` = ícone compacto usado no cabeçalho).
- Textos: todo o conteúdo está direto no HTML, em português.
