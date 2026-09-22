# Atualização incremental — 22/09/2026

Este pacote contém somente as alterações feitas depois do arquivo `Eyroff_Vercel_Neon_Pronto.zip`.

## Aplicação

1. Faça um backup do projeto atual.
2. Copie o conteúdo deste ZIP para a raiz do projeto, permitindo substituir os arquivos existentes.
3. No painel da Neon, abra o SQL Editor e execute `database/update_2026_09_22.sql` uma única vez.
4. Envie as alterações ao GitHub. A Vercel fará uma nova publicação automaticamente.

## O que foi incluído

- Pesquisa de horários com seleção múltipla.
- Cadastro livre de tipos de turma e vários horários.
- Sugestão aberta de horário.
- Painel de demanda e respostas.
- Renomear, pausar, excluir e ordenar horários.
- Exclusão de respostas e depoimentos.
- Cadastro, alteração de senha e exclusão de professores.
- Turmas, alunos, faixas e controle de presença.
- Área exclusiva do professor.

## Variáveis

Mantenha as variáveis que já estão configuradas na Vercel:

- `DATABASE_URL`
- `ADMIN_USER`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

Não é necessário criar um novo projeto na Vercel ou um novo banco Neon.
