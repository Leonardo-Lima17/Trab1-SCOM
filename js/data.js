/**
 * data.js
 * Base de dados do catálogo pessoal de filmes.
 * Cada item representa um filme já assistido ou na lista de "quero assistir".
 * As sinopses foram escritas de forma resumida e autoral para fins deste projeto.
 */

const CATALOGO_FILMES = [
  {
    id: 1,
    titulo: "Blade Runner 2049",
    ano: 2017,
    diretor: "Denis Villeneuve",
    generos: ["ficcao", "drama"],
    duracao: 164,
    nota: 5,
    status: "assistido",
    sinopse: "Um replicante da nova geração descobre um segredo capaz de mergulhar a sociedade em caos e parte à procura de um antigo agente aposentado.",
    corTema: "#3c6e91"
  },
  {
    id: 2,
    titulo: "Parasita",
    ano: 2019,
    diretor: "Bong Joon-ho",
    generos: ["drama", "suspense"],
    duracao: 132,
    nota: 5,
    status: "assistido",
    sinopse: "Uma família de baixa renda se infiltra, aos poucos, na rotina de uma família rica, até que um evento inesperado muda tudo.",
    corTema: "#4a5d3a"
  },
  {
    id: 3,
    titulo: "Interestelar",
    ano: 2014,
    diretor: "Christopher Nolan",
    generos: ["ficcao", "aventura"],
    duracao: 169,
    nota: 5,
    status: "assistido",
    sinopse: "Um grupo de exploradores usa uma passagem recém-descoberta no espaço-tempo para tentar garantir a sobrevivência da humanidade.",
    corTema: "#1f2d4d"
  },
  {
    id: 4,
    titulo: "A Forma da Água",
    ano: 2017,
    diretor: "Guillermo del Toro",
    generos: ["romance", "fantasia"],
    duracao: 123,
    nota: 4,
    status: "assistido",
    sinopse: "Uma faxineira muda desenvolve uma conexão afetiva incomum com uma criatura anfíbia mantida em um laboratório secreto.",
    corTema: "#255c5c"
  },
  {
    id: 5,
    titulo: "Whiplash: Em Busca da Perfeição",
    ano: 2014,
    diretor: "Damien Chazelle",
    generos: ["drama", "musical"],
    duracao: 107,
    nota: 5,
    status: "assistido",
    sinopse: "Um jovem baterista de jazz é empurrado ao limite por um professor extremamente exigente em busca da excelência.",
    corTema: "#7a2020"
  },
  {
    id: 6,
    titulo: "Duna",
    ano: 2021,
    diretor: "Denis Villeneuve",
    generos: ["ficcao", "aventura"],
    duracao: 155,
    nota: 4,
    status: "assistido",
    sinopse: "O herdeiro de uma casa nobre precisa proteger o recurso mais valioso da galáxia em um planeta desértico hostil.",
    corTema: "#8a6a3a"
  },
  {
    id: 7,
    titulo: "Oppenheimer",
    ano: 2023,
    diretor: "Christopher Nolan",
    generos: ["drama", "historia"],
    duracao: 180,
    nota: 0,
    status: "quero-assistir",
    sinopse: "A trajetória do físico J. Robert Oppenheimer e seu papel central no desenvolvimento da bomba atômica.",
    corTema: "#3a3a3a"
  },
  {
    id: 8,
    titulo: "Handred: Vidas Passadas",
    ano: 2023,
    diretor: "Celine Song",
    generos: ["romance", "drama"],
    duracao: 106,
    nota: 0,
    status: "quero-assistir",
    sinopse: "Duas pessoas que se conheceram na infância se reencontram décadas depois e reavaliam os caminhos que suas vidas tomaram.",
    corTema: "#5c3a5c"
  },
  {
    id: 9,
    titulo: "O Andarilho",
    ano: 2015,
    diretor: "Alejandro G. Iñárritu",
    generos: ["drama", "aventura"],
    duracao: 156,
    nota: 4,
    status: "assistido",
    sinopse: "Um caçador ferido e abandonado pela própria expedição luta para sobreviver e retornar à civilização.",
    corTema: "#4a4030"
  },
  {
    id: 10,
    titulo: "Coringa",
    ano: 2019,
    diretor: "Todd Phillips",
    generos: ["drama", "suspense"],
    duracao: 122,
    nota: 5,
    status: "assistido",
    sinopse: "Um comediante fracassado de Gotham City é empurrado, aos poucos, para uma espiral de isolamento e violência.",
    corTema: "#5c1f3a"
  },
  {
    id: 11,
    titulo: "Divertida Mente 2",
    ano: 2024,
    diretor: "Kelsey Mann",
    generos: ["animacao", "aventura"],
    duracao: 96,
    nota: 4,
    status: "assistido",
    sinopse: "As emoções de Riley precisam lidar com a chegada de novos sentimentos durante a fase da adolescência.",
    corTema: "#3a6e6e"
  },
  {
    id: 12,
    titulo: "Clube da Luta",
    ano: 1999,
    diretor: "David Fincher",
    generos: ["drama", "suspense"],
    duracao: 139,
    nota: 5,
    status: "assistido",
    sinopse: "Um homem insone e insatisfeito com a vida forma, ao lado de um vendedor de sabonetes, um clube clandestino de lutas.",
    corTema: "#2a2a2a"
  },
  {
    id: 13,
    titulo: "Divertida Mente",
    ano: 2015,
    diretor: "Pete Docter",
    generos: ["animacao", "aventura"],
    duracao: 95,
    nota: 4,
    status: "assistido",
    sinopse: "As emoções dentro da mente de uma garota de onze anos tentam guiá-la durante uma difícil mudança de cidade.",
    corTema: "#3a5c8a"
  },
  {
    id: 14,
    titulo: "Cidade de Deus",
    ano: 2002,
    diretor: "Fernando Meirelles",
    generos: ["drama", "historia"],
    duracao: 130,
    nota: 5,
    status: "assistido",
    sinopse: "A trajetória de moradores de uma favela carioca é acompanhada ao longo de duas décadas marcadas pela violência.",
    corTema: "#8a5c2a"
  },
  {
    id: 15,
    titulo: "Poor Things",
    ano: 2023,
    diretor: "Yorgos Lanthimos",
    generos: ["fantasia", "comedia"],
    duracao: 141,
    nota: 0,
    status: "quero-assistir",
    sinopse: "Uma jovem mulher trazida de volta à vida por um cientista excêntrico embarca em uma jornada de autodescoberta.",
    corTema: "#5c5c1f"
  },
  {
    id: 16,
    titulo: "Green Book",
    ano: 2018,
    diretor: "Peter Farrelly",
    generos: ["drama", "comedia"],
    duracao: 130,
    nota: 4,
    status: "assistido",
    sinopse: "Um motorista ítalo-americano é contratado para conduzir um pianista negro em turnê pelo sul dos EUA nos anos 1960.",
    corTema: "#1f5c3a"
  },