# CineArquivo — Catálogo Pessoal de Filmes

Projeto individual da disciplina **SCOM** (2026). Interface web para
organizar filmes assistidos e filmes que ainda quero assistir, com busca e
filtros por gênero, status e ordenação.

## Como executar

Não há dependências, build ou servidor: é um projeto 100% estático em
HTML5 + CSS3 + JavaScript puro.

1. Baixe/clone este repositório.
2. Abra o arquivo `index.html` diretamente em um navegador moderno
   (Chrome, Firefox, Edge ou Safari).

Não é necessário instalar nada nem rodar comandos.

## Estrutura do projeto

```
catalogo-filmes/
├── index.html          # Estrutura semântica da página
├── css/
│   └── styles.css      # Estilos, tokens de design (:root) e responsividade
├── js/
│   ├── data.js          # Base de dados dos filmes (array de objetos)
│   └── app.js            # Lógica de busca, filtro, ordenação e renderização
└── README.md
```

## Funcionalidades

- Busca por título ou diretor
- Filtro por gênero (múltipla escolha)
- Filtro por status (assistido / quero assistir / todos)
- Ordenação por título, ano ou avaliação
- Modal acessível com detalhes de cada filme
- Estado de "nenhum resultado encontrado"
- Layout responsivo (mobile, tablet e desktop)
- Catálogo de fábrica com 116 filmes (incluindo MCU, Star Wars, Tarantino,
  Batman/DC, Harry Potter, O Senhor dos Anéis, Pixar e outros clássicos)
- Adicionar novos filmes pela própria interface, salvos no `localStorage`
  do navegador (não requer backend nem servidor)
- Remover filmes adicionados por você (os filmes de fábrica não podem ser
  removidos pela interface — edite `js/data.js` para isso)

## Acessibilidade

- Navegação completa por teclado
- Foco visível em todos os elementos interativos (`:focus-visible`)
- Labels associados a todos os campos de formulário
- Uso de `aria-live` para atualizar o contador de resultados dinamicamente
- Hierarquia de títulos única e lógica (um único `h1`)
- Elemento `dialog` nativo para o modal (semântica e foco gerenciados pelo
  navegador)

## Tecnologias

- HTML5 semântico
- CSS3 (Grid, Flexbox, variáveis CSS)
- JavaScript (ES6+, sem frameworks ou bibliotecas externas)