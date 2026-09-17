/**
 * app.js
 * Lógica de renderização, busca, filtros, ordenação e persistência
 * (via localStorage) do catálogo. Não depende de bibliotecas externas.
 */

(function () {
  "use strict";

  const CHAVE_STORAGE = "cinearquivo:filmes-personalizados";

  const grid = document.getElementById("grade-filmes");
  const contador = document.getElementById("contador-resultados");
  const vazio = document.getElementById("estado-vazio");
  const formFiltros = document.getElementById("form-filtros");
  const campoBusca = document.getElementById("campo-busca");
  const campoOrdenar = document.getElementById("campo-ordenar");
  const listaGenerosEl = document.getElementById("lista-generos");
  const botaoLimpar = document.getElementById("botao-limpar-filtros");
  const template = document.getElementById("template-card-filme");

  const modal = document.getElementById("modal-detalhe");
  const modalConteudo = document.getElementById("modal-conteudo");
  const modalFechar = document.getElementById("modal-fechar");
  let elementoQueAbriuModal = null;

  const modalAdicionar = document.getElementById("modal-adicionar");
  const formAdicionar = document.getElementById("form-adicionar");
  const botaoAbrirAdicionar = document.getElementById("botao-adicionar-filme");
  const botaoCancelarAdicionar = document.getElementById(
    "botao-cancelar-adicionar"
  );
  const listaGenerosFormEl = document.getElementById("lista-generos-form");
  const mensagemAdicionar = document.getElementById("mensagem-adicionar");

  // Lista completa usada pela aplicação: filmes de fábrica + filmes
  // adicionados pelo usuário (persistidos no navegador via localStorage).
  let todosFilmes = [];

  // =========================================================
  // Persistência (localStorage)
  // =========================================================

  function carregarFilmesSalvos() {
    try {
      const bruto = window.localStorage.getItem(CHAVE_STORAGE);
      return bruto ? JSON.parse(bruto) : [];
    } catch (erro) {
      console.error("Não foi possível ler os filmes salvos:", erro);
      return [];
    }
  }

  function salvarFilmesPersonalizados(lista) {
    try {
      window.localStorage.setItem(CHAVE_STORAGE, JSON.stringify(lista));
      return true;
    } catch (erro) {
      console.error("Não foi possível salvar os filmes:", erro);
      return false;
    }
  }

  function obterFilmesPersonalizados() {
    return todosFilmes.filter((f) => f.personalizado);
  }

  // =========================================================
  // Montagem dos filtros (gênero)
  // =========================================================

  function montarFiltroGeneros() {
    listaGenerosEl.innerHTML = "";
    const generosUnicos = new Set();
    todosFilmes.forEach((filme) =>
      filme.generos.forEach((g) => generosUnicos.add(g))
    );

    const generosOrdenados = Array.from(generosUnicos).sort((a, b) =>
      (NOMES_GENEROS[a] || a).localeCompare(NOMES_GENEROS[b] || b, "pt-BR")
    );

    generosOrdenados.forEach((genero) => {
      const id = `genero-${genero}`;
      const item = document.createElement("li");
      item.className = "filtro-genero-item";
      item.innerHTML = `
        <input type="checkbox" id="${id}" name="genero" value="${genero}" class="filtro-checkbox">
        <label for="${id}">${NOMES_GENEROS[genero] || genero}</label>
      `;
      listaGenerosEl.appendChild(item);
    });
  }

  // Monta os checkboxes de gênero dentro do formulário de "Adicionar filme"
  function montarGenerosFormAdicionar() {
    listaGenerosFormEl.innerHTML = "";
    Object.keys(NOMES_GENEROS).forEach((genero) => {
      const id = `add-genero-${genero}`;
      const item = document.createElement("li");
      item.className = "filtro-genero-item";
      item.innerHTML = `
        <input type="checkbox" id="${id}" name="genero-novo" value="${genero}" class="filtro-checkbox">
        <label for="${id}">${NOMES_GENEROS[genero]}</label>
      `;
      listaGenerosFormEl.appendChild(item);
    });
  }

  // =========================================================
  // Filtro, ordenação e renderização
  // =========================================================

  function obterFiltrosAtuais() {
    const termo = campoBusca.value.trim().toLowerCase();
    const generosSelecionados = Array.from(
      formFiltros.querySelectorAll('input[name="genero"]:checked')
    ).map((el) => el.value);
    const status = formFiltros.querySelector(
      'input[name="status"]:checked'
    ).value;
    const ordenar = campoOrdenar.value;

    return { termo, generosSelecionados, status, ordenar };
  }

  function aplicarFiltros() {
    const { termo, generosSelecionados, status, ordenar } =
      obterFiltrosAtuais();

    let resultado = todosFilmes.filter((filme) => {
      const combinaTermo =
        termo === "" ||
        filme.titulo.toLowerCase().includes(termo) ||
        filme.diretor.toLowerCase().includes(termo);

      const combinaGenero =
        generosSelecionados.length === 0 ||
        filme.generos.some((g) => generosSelecionados.includes(g));

      const combinaStatus = status === "todos" || filme.status === status;

      return combinaTermo && combinaGenero && combinaStatus;
    });

    resultado = ordenarResultado(resultado, ordenar);
    renderizarGrade(resultado);
  }

  function ordenarResultado(lista, criterio) {
    const copia = [...lista];
    switch (criterio) {
      case "ano-desc":
        return copia.sort((a, b) => b.ano - a.ano);
      case "ano-asc":
        return copia.sort((a, b) => a.ano - b.ano);
      case "nota-desc":
        return copia.sort((a, b) => b.nota - a.nota);
      case "titulo-asc":
      default:
        return copia.sort((a, b) =>
          a.titulo.localeCompare(b.titulo, "pt-BR")
        );
    }
  }

  function renderizarGrade(filmes) {
    grid.innerHTML = "";

    contador.textContent =
      filmes.length === 1
        ? "1 filme encontrado"
        : `${filmes.length} filmes encontrados`;

    if (filmes.length === 0) {
      vazio.hidden = false;
      return;
    }
    vazio.hidden = true;

    const fragmento = document.createDocumentFragment();

    filmes.forEach((filme) => {
      const clone = template.content.cloneNode(true);
      const artigo = clone.querySelector(".card-filme");
      const poster = clone.querySelector(".card-filme__poster");
      const titulo = clone.querySelector(".card-filme__titulo");
      const meta = clone.querySelector(".card-filme__meta");
      const badgeStatus = clone.querySelector(".card-filme__badge");
      const badgePersonalizado = clone.querySelector(
        ".card-filme__badge-personalizado"
      );
      const botao = clone.querySelector(".card-filme__botao");

      artigo.id = `filme-${filme.id}`;
      poster.style.setProperty("--cor-poster", filme.corTema || "#333952");
      poster.setAttribute(
        "aria-label",
        `Capa ilustrativa do filme ${filme.titulo}`
      );
      poster.textContent = obterIniciais(filme.titulo);

      titulo.textContent = filme.titulo;
      meta.textContent = `${filme.ano} · ${filme.diretor}`;

      if (filme.status === "assistido") {
        badgeStatus.textContent = `Assistido · ${"★".repeat(
          filme.nota
        )}${"☆".repeat(5 - filme.nota)}`;
        badgeStatus.classList.add("card-filme__badge--assistido");
      } else {
        badgeStatus.textContent = "Quero assistir";
        badgeStatus.classList.add("card-filme__badge--pendente");
      }

      if (filme.personalizado && badgePersonalizado) {
        badgePersonalizado.hidden = false;
      }

      botao.setAttribute("aria-label", `Ver detalhes de ${filme.titulo}`);
      botao.dataset.filmeId = filme.id;
      botao.addEventListener("click", (evento) =>
        abrirModal(filme, evento.currentTarget)
      );

      fragmento.appendChild(clone);
    });

    grid.appendChild(fragmento);
  }

  function obterIniciais(titulo) {
    return titulo
      .split(" ")
      .filter((palavra) => palavra.length > 2)
      .slice(0, 2)
      .map((palavra) => palavra[0])
      .join("")
      .toUpperCase();
  }
