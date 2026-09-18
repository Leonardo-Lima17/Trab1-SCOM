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

  // =========================================================
  // Modal de detalhe (+ remoção de filmes personalizados)
  // =========================================================

  function abrirModal(filme, elementoOrigem) {
    elementoQueAbriuModal = elementoOrigem;

    const generosTexto = filme.generos
      .map((g) => NOMES_GENEROS[g] || g)
      .join(", ");

    modalConteudo.innerHTML = `
      <h2 id="modal-titulo">${filme.titulo}</h2>
      <p class="modal-meta">${filme.ano} · ${filme.diretor} · ${filme.duracao} min</p>
      <p class="modal-generos"><strong>Gêneros:</strong> ${generosTexto}</p>
      <p class="modal-sinopse">${filme.sinopse}</p>
      <p class="modal-status">${
        filme.status === "assistido"
          ? `Avaliação pessoal: ${"★".repeat(filme.nota)}${"☆".repeat(
              5 - filme.nota
            )}`
          : "Ainda não assistido — está na lista de interesse."
      }</p>
      ${
        filme.personalizado
          ? `<button type="button" class="botao botao--remover" id="botao-remover-filme">Remover da minha lista</button>`
          : ""
      }
    `;

    if (filme.personalizado) {
      const botaoRemover = document.getElementById("botao-remover-filme");
      botaoRemover.addEventListener("click", () => {
        removerFilmePersonalizado(filme.id);
        fecharModal();
      });
    }

    modal.showModal();
    modalFechar.focus();
  }

  function fecharModal() {
    modal.close();
    if (elementoQueAbriuModal) {
      elementoQueAbriuModal.focus();
    }
  }

  function removerFilmePersonalizado(id) {
    todosFilmes = todosFilmes.filter(
      (f) => !(f.personalizado && f.id === id)
    );
    salvarFilmesPersonalizados(obterFilmesPersonalizados());
    montarFiltroGeneros();
    aplicarFiltros();
  }

  // =========================================================
  // Formulário "Adicionar filme"
  // =========================================================

  function abrirModalAdicionar() {
    formAdicionar.reset();
    mensagemAdicionar.textContent = "";
    modalAdicionar.showModal();
    document.getElementById("novo-titulo").focus();
  }

  function fecharModalAdicionar() {
    modalAdicionar.close();
    botaoAbrirAdicionar.focus();
  }

  function gerarCorAleatoria() {
    const cores = [
      "#3c6e91",
      "#4a5d3a",
      "#1f2d4d",
      "#255c5c",
      "#7a2020",
      "#8a6a3a",
      "#5c1f3a",
      "#3a3a3a",
      "#5c5c1f",
      "#5c3a5c",
      "#3a6e6e",
      "#8a5c2a"
    ];
    return cores[Math.floor(Math.random() * cores.length)];
  }

  function tratarEnvioFormAdicionar(evento) {
    evento.preventDefault();

    const titulo = document.getElementById("novo-titulo").value.trim();
    const ano = parseInt(document.getElementById("novo-ano").value, 10);
    const diretor = document.getElementById("novo-diretor").value.trim();
    const duracao =
      parseInt(document.getElementById("novo-duracao").value, 10) || 0;
    const nota = parseInt(document.getElementById("novo-nota").value, 10);
    const status = formAdicionar.querySelector(
      'input[name="status-novo"]:checked'
    ).value;
    const sinopse = document.getElementById("novo-sinopse").value.trim();
    const generos = Array.from(
      formAdicionar.querySelectorAll('input[name="genero-novo"]:checked')
    ).map((el) => el.value);

    if (!titulo) {
      mensagemAdicionar.textContent = "O título é obrigatório.";
      mensagemAdicionar.className = "mensagem-form mensagem-form--erro";
      return;
    }

    if (generos.length === 0) {
      mensagemAdicionar.textContent =
        "Selecione ao menos um gênero para o filme.";
      mensagemAdicionar.className = "mensagem-form mensagem-form--erro";
      return;
    }

    const novoFilme = {
      id: Date.now(),
      titulo,
      ano: ano || new Date().getFullYear(),
      diretor: diretor || "Não informado",
      generos,
      duracao,
      nota: status === "assistido" ? nota || 0 : 0,
      status,
      sinopse: sinopse || "Sem sinopse cadastrada.",
      corTema: gerarCorAleatoria(),
      personalizado: true
    };

    todosFilmes.push(novoFilme);
    salvarFilmesPersonalizados(obterFilmesPersonalizados());

    montarFiltroGeneros();
    aplicarFiltros();
    fecharModalAdicionar();
  }

  // =========================================================
  // Limpar filtros
  // =========================================================

  function limparFiltros() {
    formFiltros.reset();
    campoBusca.value = "";
    campoOrdenar.value = "titulo-asc";
    aplicarFiltros();
    campoBusca.focus();
  }

  // =========================================================
  // Eventos
  // =========================================================

  formFiltros.addEventListener("change", aplicarFiltros);
  campoBusca.addEventListener("input", aplicarFiltros);
  campoOrdenar.addEventListener("change", aplicarFiltros);
  botaoLimpar.addEventListener("click", limparFiltros);

  modalFechar.addEventListener("click", fecharModal);
  modal.addEventListener("cancel", (evento) => {
    evento.preventDefault();
    fecharModal();
  });
  modal.addEventListener("click", (evento) => {
    if (evento.target === modal) fecharModal();
  });

  botaoAbrirAdicionar.addEventListener("click", abrirModalAdicionar);
  botaoCancelarAdicionar.addEventListener("click", fecharModalAdicionar);
  formAdicionar.addEventListener("submit", tratarEnvioFormAdicionar);
  modalAdicionar.addEventListener("cancel", (evento) => {
    evento.preventDefault();
    fecharModalAdicionar();
  });
  modalAdicionar.addEventListener("click", (evento) => {
    if (evento.target === modalAdicionar) fecharModalAdicionar();
  });

  // =========================================================
  // Inicialização
  // =========================================================

  todosFilmes = [
    ...CATALOGO_FILMES,
    ...carregarFilmesSalvos().map((f) => ({ ...f, personalizado: true }))
  ];

  montarFiltroGeneros();
  montarGenerosFormAdicionar();
  aplicarFiltros();
})();
