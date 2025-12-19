# Highlight Front

Interface web simples para gerenciar artistas, músicas e letras através da API Highlight.

Estrutura:
- **Artistas**: Listagem, criação, edição e remoção de artistas.
- **Músicas**: Gerenciamento de músicas por artista (título, ano de lançamento).
- **Letras**: Gerenciamento de letras por música (idioma, conteúdo).

A navegação é hierárquica: Artistas → Músicas → Letras, com persistência de estado via query parameters na URL.

## Requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- API Highlight rodando em `http://127.0.0.1:5000`

## Tecnologias

- HTML5
- CSS3 (sem frameworks)
- JavaScript vanilla (sem bibliotecas)

## Como rodar

1) Certifique-se de que a API Highlight está rodando em `http://127.0.0.1:5000`

2) Abra o arquivo `index.html` diretamente no navegador:
   - Duplo clique no arquivo, OU
   - Arraste para o navegador, OU
   - Use um servidor local (opcional):
     - Com Python: `python -m http.server 8000`
     - Com Node.js: `npx serve`

3) A interface será carregada exibindo a lista de artistas.

## Configuração

Se a API estiver rodando em uma URL diferente, edite o arquivo `scripts.js`:

```javascript
const API_URL = 'http://127.0.0.1:5000'; // Altere aqui
```

## Funcionalidades

- ✅ CRUD completo de artistas, músicas e letras
- ✅ Navegação hierárquica com breadcrumbs
- ✅ Persistência de navegação via URL (permite copiar/compartilhar links)
- ✅ Modais para edição e visualização de letras completas
- ✅ Confirmações antes de operações destrutivas
- ✅ Validações de formulário
- ✅ Design responsivo
- ✅ Paleta azul-bebê

## Observações

- A interface utiliza apenas HTML, CSS e JavaScript vanilla (sem frameworks ou bibliotecas).
- Todas as operações são feitas via API REST.
- O estado da navegação é mantido na URL através de query parameters (`?artist=5&song=12`).
- Ao deletar um artista ou música, todos os dados relacionados são removidos automaticamente (cascade delete na API).
