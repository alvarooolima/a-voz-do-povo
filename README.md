# A Voz do Povo

Site cidadão para relatar problemas urbanos (buracos, poda de árvores, iluminação, calçadas, lixo etc.) com foto, comentário e acompanhamento de status. Inspirado na funcionalidade de "zeladoria colaborativa" do Colab (colab.com.br/sou-governo).

## Estrutura
```
a-voz-do-povo/
├── index.html      → página inicial (hero, categorias, formulário de relato, feed)
├── login.html       → login / cadastro / esqueci a senha
├── css/styles.css   → design system (azul royal + branco)
├── js/main.js        → lógica da página inicial
├── js/auth.js        → lógica de autenticação
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

## Personalização rápida
- Cores: edite as variáveis no topo de `css/styles.css` (`--royal`, `--royal-dark`, etc.).
- Categorias de problema: edite o array `CATEGORIES` em `js/main.js`.
- Textos: todo o conteúdo está direto no HTML, em português.
