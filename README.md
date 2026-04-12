# Highlight Front

Front-end SPA do projeto Highlight, construído com Angular + Angular Material.

## Tecnologias

- Angular 21 (standalone components + Angular Router)
- Angular Material (dialogs, cards, snackbar/toast, botões)
- SCSS
- Docker (multi-stage build)
- Nginx (servidor estático + fallback para rotas SPA)

## O que mudou nesta versão

- Migração do front/protótipo antigo (HTML/CSS/JS puro) para Angular.
- Rotas por caminho:
  - `/artistas`
  - `/artistas/:artistaId/musicas`
  - `/artistas/:artistaId/musicas/:musicaId/letras`
- Substituição de `alert()` por toast/notificação com `MatSnackBar`.
- Edição de artista em modal (MatDialog).
- Ajustes na tela de letras.

## Pré-requisitos

- Node.js 22+
- npm 11+
- API Highlight rodando (projeto `highlight-api`)

## Como rodar em desenvolvimento

1. Instale as dependências:

```bash
npm install
```

2. Execute o front:

```bash
npm start
```

3. Acesse:

- `http://localhost:4200`

## Build de produção

```bash
npm run build
```

Saída padrão:

- `dist/highlight-front/browser`

## Docker

### Build da imagem

```bash
docker build -t highlight-front:latest .
```

### Executar container

Exemplo para API rodando na máquina host (Windows):

```bash
docker run --rm -p 8080:80 highlight-front:latest
```

A aplicação ficará disponível em:

- `http://localhost:8080`

## URL da API

O front está configurado para consumir a API em:

- `http://localhost:5000`

## Integração com a API

A API atual usada pelo front expõe os seguintes recursos:

- Artistas (`/artists`)
- Músicas (`/artists/{id}/songs` e `/songs/{id}`)
- Letras (`/songs/{id}/lyrics` e `/lyrics/{id}`)

No projeto `highlight-api`, mantenha a API ativa durante o uso do front.

