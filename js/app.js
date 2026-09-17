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
