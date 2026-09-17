# Eyroff Escola de Jiu Jitsu

Projeto completo em Next.js para publicação na Vercel, com PostgreSQL hospedado no Neon.

## Funcionalidades

- Landing page responsiva da Escola Eyroff
- Formulário de interessados com nome, idade, turma, WhatsApp e Instagram
- Turmas disponíveis: Jiu Jitsu Adulto e Jiu Jitsu Kids
- Painel administrativo protegido por usuário e senha
- Filtros por nome, telefone, Instagram, turma e faixa de idade
- Botão para chamar o interessado diretamente no WhatsApp
- Envio de depoimentos
- Aprovação manual dos depoimentos pelo administrador
- Carrossel automático apenas com depoimentos aprovados

## 1. Criar o banco no Neon

1. Crie uma conta e um projeto em https://neon.tech
2. Abra o **SQL Editor** do projeto.
3. Copie todo o conteúdo de `database/schema.sql`.
4. Execute o SQL.
5. Na tela **Connection Details**, copie a connection string do PostgreSQL.

## 2. Enviar para o GitHub

Crie um repositório vazio e envie todos os arquivos deste projeto. Não envie nenhum arquivo `.env`.

Exemplo:

```bash
git init
git add .
git commit -m "Projeto inicial Eyroff"
git branch -M main
git remote add origin URL_DO_SEU_REPOSITORIO
git push -u origin main
```

## 3. Publicar na Vercel

1. Acesse https://vercel.com e escolha **Add New > Project**.
2. Importe o repositório do GitHub.
3. Mantenha o framework como **Next.js**.
4. Em **Environment Variables**, cadastre:

| Nome | Valor |
| --- | --- |
| `DATABASE_URL` | Connection string copiada do Neon |
| `ADMIN_USER` | Usuário que será utilizado no painel |
| `ADMIN_PASSWORD` | Senha forte do administrador |
| `ADMIN_SESSION_SECRET` | Sequência aleatória com pelo menos 32 caracteres |

5. Clique em **Deploy**.

O painel ficará disponível em `https://seu-dominio.vercel.app/admin`.

## 4. Executar localmente

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Preencha o arquivo `.env.local` com sua conexão e credenciais antes de iniciar.

## Segurança

- As credenciais administrativas não ficam no código.
- Nunca envie `.env.local` para o GitHub.
- Troque a senha pelo painel da Vercel sempre que necessário.
- Os cookies do painel são HTTP-only, seguros e expiram em 12 horas.

## Atualizações

Depois de conectar o GitHub à Vercel, cada novo `git push` na branch principal gera automaticamente uma nova publicação.
