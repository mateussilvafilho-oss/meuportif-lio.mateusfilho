
console.log("Ambiente Preparado!");

const nome = "Mateus Filho";
const area = "Engenharia de Software";
const cidade = "Salvador";
const idade = 18;
const disponivel = true;

console.log("Tipo de nome:", typeof nome);
console.log("Tipo de idade:", typeof idade);
console.log("Tipo de disponível:", typeof disponivel);

console.log(`Olá! Eu sou ${nome}, tenho ${idade} anos, moro em ${cidade} e estudo ${area}.`);

const projetosConcluidos = 2;
const projetosAndamento = 1;
const totalProjetos = projetosConcluidos + projetosAndamento;

console.log("Total de projetos:", totalProjetos);

if (totalProjetos === 0) {
    console.log("Ainda sem projetos");
} else if (totalProjetos <= 2) {
    console.log("Portfólio em construção");
} else {
    console.log("Portfólio com vários projetos");
}

console.log("Disponível para contatos?", disponivel);

function apresentarPerfil(nome, area) {
    return `Olá, eu sou ${nome} e trabalho com ${area}.`;
}

function resumirProjetos(concluidos, andamento) {
    return concluidos + andamento;
}

console.log(apresentarPerfil(nome, area));
console.log("Total:", resumirProjetos(2, 1));



const raiz = document.documentElement;
const btnMenu = document.querySelector("#btn-menu");
const menu = document.querySelector("#menu");
const btnTema = document.querySelector("#btn-tema");
const resumoPerfil = document.querySelector("#resumo-perfil");
const btnBio = document.querySelector("#btn-bio");
const bioExtra = document.querySelector("#bio-extra");
const filtros = document.querySelector("#filtros");
const lista = document.querySelector("#lista-projetos");
const contador = document.querySelector("#contador");
const vazio = document.querySelector("#vazio");
const aviso = document.querySelector("#aviso");
const form = document.querySelector("#form-projeto");
const formContato = document.querySelector("#form-contato");
const btnEnviar = document.querySelector("#btn-enviar");
const statusContato = document.querySelector("#status-contato");

let filtroAtual = "todos";

const NOMES_CATEGORIA = { html: "HTML", css: "CSS", javascript: "JavaScript" };
const SIGLAS_CATEGORIA = { html: "HTML", css: "CSS", javascript: "JS" };
const NOMES_STATUS = { concluido: "Concluído", andamento: "Em andamento" };

resumoPerfil.textContent = apresentarPerfil(nome, area);



btnMenu.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    btnMenu.setAttribute("aria-expanded", aberto);
});

menu.addEventListener("click", (evento) => {
    if (evento.target.closest("a")) {
        menu.classList.remove("aberto");
        btnMenu.setAttribute("aria-expanded", "false");
    }
});



btnTema.addEventListener("click", () => {
    const escuro = raiz.dataset.tema !== "escuro";

    raiz.dataset.tema = escuro ? "escuro" : "claro";
    btnTema.setAttribute("aria-pressed", escuro);
    btnTema.textContent = escuro ? "Tema claro" : "Tema escuro";
});



btnBio.addEventListener("click", () => {
    bioExtra.hidden = !bioExtra.hidden;

    btnBio.textContent = bioExtra.hidden ? "Mostrar mais" : "Mostrar menos";
    btnBio.setAttribute("aria-expanded", !bioExtra.hidden);
});



function aplicarFiltro() {
    const cards = lista.querySelectorAll(".card");
    let visiveis = 0;

    cards.forEach(card => {
        const mostrar = filtroAtual === "todos" ||
            card.dataset.categoria === filtroAtual;

        card.hidden = !mostrar;

        if (mostrar) visiveis++;
    });

    contador.textContent = `Projetos encontrados: ${visiveis}`;
    vazio.hidden = visiveis > 0;
}

filtros.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button[data-filtro]");

    if (!botao) return;

    filtroAtual = botao.dataset.filtro;

    filtros.querySelectorAll("button").forEach(b => {
        b.setAttribute("aria-pressed", b === botao);
    });

    aplicarFiltro();
});



lista.addEventListener("click", (evento) => {
    const botao = evento.target.closest('[data-acao="remover"]');

    if (!botao) return;

    const card = botao.closest(".card");
    const titulo = card.querySelector("h3").textContent;

    card.remove();
    aplicarFiltro();

    aviso.textContent = `Projeto "${titulo}" removido.`;
});



function validarCampo(formulario, campo, mensagem, validador) {
    const elemento = formulario.elements[campo];
    const texto = elemento.value.trim();
    const valido = validador ? validador(texto) : texto.length >= 3;

    formulario.querySelector(`#erro-${campo}`).textContent =
        valido ? "" : mensagem;

    elemento.setAttribute("aria-invalid", !valido);

    return valido;
}

const emailValido = (texto) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto);
const mensagemValida = (texto) => texto.length >= 10;



function criarCard(dados) {
    const card = document.createElement("li");
    card.className = "card nova";

    card.dataset.categoria = dados.categoria;
    card.dataset.status = dados.status;

    const planeta = document.createElement("span");
    planeta.className = "planeta";
    planeta.setAttribute("aria-hidden", "true");
    planeta.textContent = SIGLAS_CATEGORIA[dados.categoria];

    const corpo = document.createElement("div");
    corpo.className = "corpo";

    const titulo = document.createElement("h3");
    titulo.textContent = dados.titulo;

    const descricao = document.createElement("p");
    descricao.textContent = dados.descricao || "Sem descrição ainda.";

    const tags = document.createElement("div");
    tags.className = "tags";

    const tagCategoria = document.createElement("span");
    tagCategoria.textContent = NOMES_CATEGORIA[dados.categoria];

    const tagStatus = document.createElement("span");
    tagStatus.textContent = NOMES_STATUS[dados.status];

    tags.append(tagCategoria, tagStatus);
    corpo.append(titulo, descricao, tags);

    const remover = document.createElement("button");
    remover.textContent = "Remover";
    remover.type = "button";
    remover.className = "remover";
    remover.dataset.acao = "remover";
    remover.setAttribute("aria-label", `Remover projeto ${dados.titulo}`);

    card.append(planeta, corpo, remover);

    return card;
}

form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const tituloValido = validarCampo(
        form,
        "titulo",
        "Digite pelo menos 3 caracteres."
    );

    if (!tituloValido) {
        aviso.textContent = "Corrija o título.";
        form.elements.titulo.focus();
        return;
    }

    const dados = {
        titulo: form.elements.titulo.value.trim(),
        categoria: form.elements.categoria.value,
        status: form.elements.status.value,
        descricao: form.elements.descricao.value.trim()
    };

    lista.append(criarCard(dados));

    form.reset();
    aplicarFiltro();

    aviso.textContent = "Projeto cadastrado com sucesso!";
});



function mostrarStatusContato(texto, estado) {
    statusContato.textContent = texto;
    statusContato.dataset.estado = estado;
}

formContato.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const validos = [
        validarCampo(formContato, "nome", "Digite seu nome (mínimo 3 letras)."),
        validarCampo(formContato, "email", "Digite um e-mail válido.", emailValido),
        validarCampo(formContato, "assunto", "Digite o assunto (mínimo 3 letras)."),
        validarCampo(formContato, "mensagem", "Escreva pelo menos 10 caracteres.", mensagemValida)
    ];

    if (validos.includes(false)) {
        mostrarStatusContato("Corrija os campos destacados e envie de novo.", "erro");
        formContato.querySelector('[aria-invalid="true"]').focus();
        return;
    }

    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando...";
    mostrarStatusContato("", "");

    try {
        const resposta = await fetch(
            "https://formsubmit.co/ajax/mateusfilhot@gmail.com",
            {
                method: "POST",
                headers: { Accept: "application/json" },
                body: new FormData(formContato)
            }
        );

        if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);

        formContato.reset();
        mostrarStatusContato("Mensagem enviada! Obrigado pelo contato.", "ok");
    } catch (erro) {
        console.error("Falha ao enviar o formulário:", erro);
        mostrarStatusContato(
            "Não foi possível enviar agora. Confira sua conexão e tente de novo.",
            "erro"
        );
    } finally {
        btnEnviar.disabled = false;
        btnEnviar.textContent = "Enviar mensagem";
    }
});



const canvas = document.querySelector("#espaco");
const ctx = canvas.getContext("2d");
const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let estrelas = [];
let meteoro = null;
let largura = 0;
let altura = 0;

function criarEstrelas() {
    largura = canvas.width = window.innerWidth;
    altura = canvas.height = window.innerHeight;

    const total = Math.min(260, Math.floor((largura * altura) / 6500));

    estrelas = Array.from({ length: total }, () => ({
        x: Math.random() * largura,
        y: Math.random() * altura,
        raio: Math.random() * 1.4 + 0.3,
        velocidade: Math.random() * 0.25 + 0.05,
        fase: Math.random() * Math.PI * 2
    }));
}

function corDoEspaco() {
    return raiz.dataset.tema === "escuro" ? "255, 255, 255" : "58, 79, 168";
}

function desenharEspaco(tempo) {
    const cor = corDoEspaco();

    ctx.clearRect(0, 0, largura, altura);

    for (const estrela of estrelas) {
        const brilho = 0.5 + 0.5 * Math.sin(tempo / 700 + estrela.fase);

        ctx.fillStyle = `rgba(${cor}, ${0.3 + 0.7 * brilho})`;
        ctx.beginPath();
        ctx.arc(estrela.x, estrela.y, estrela.raio, 0, Math.PI * 2);
        ctx.fill();

        if (!reduzirMovimento) {
            estrela.x -= estrela.velocidade;

            if (estrela.x < -2) {
                estrela.x = largura + 2;
                estrela.y = Math.random() * altura;
            }
        }
    }

    if (!reduzirMovimento) {
        if (!meteoro && Math.random() < 0.004) {
            meteoro = {
                x: largura * (0.4 + Math.random() * 0.6),
                y: Math.random() * altura * 0.4,
                vx: -9,
                vy: 4,
                vida: 60
            };
        }

        if (meteoro) {
            const rastro = ctx.createLinearGradient(
                meteoro.x, meteoro.y,
                meteoro.x - meteoro.vx * 7, meteoro.y - meteoro.vy * 7
            );

            rastro.addColorStop(0, `rgba(${cor}, ${meteoro.vida / 60})`);
            rastro.addColorStop(1, `rgba(${cor}, 0)`);

            ctx.strokeStyle = rastro;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(meteoro.x, meteoro.y);
            ctx.lineTo(meteoro.x - meteoro.vx * 7, meteoro.y - meteoro.vy * 7);
            ctx.stroke();

            meteoro.x += meteoro.vx;
            meteoro.y += meteoro.vy;
            meteoro.vida--;

            if (meteoro.vida <= 0) meteoro = null;
        }

        requestAnimationFrame(desenharEspaco);
    }
}

window.addEventListener("resize", () => {
    criarEstrelas();

    if (reduzirMovimento) desenharEspaco(0);
});

btnTema.addEventListener("click", () => {
    if (reduzirMovimento) desenharEspaco(0);
});

criarEstrelas();
requestAnimationFrame(desenharEspaco);



aplicarFiltro();