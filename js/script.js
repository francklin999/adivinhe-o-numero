const TOTAL_TENTATIVAS = 3;

const elementos = {
    formulario: document.querySelector('#game-form'),
    dificuldades: document.querySelector('#escolhas'),
    botaoComecar: document.querySelector('#comeca'),
    botaoConfirmar: document.querySelector('#ok'),
    botaoReiniciar: document.querySelector('#reload'),
    areaPalpite: document.querySelector('#corpo'),
    palpite: document.querySelector('#valor'),
    rotuloPalpite: document.querySelector('#guess-label'),
    mensagem: document.querySelector('#message'),
    display: document.querySelector('#display'),
    vidas: [...document.querySelectorAll('.vida img')],
    rotuloVidas: document.querySelector('#lives-label')
};

const estadoInicial = () => ({
    numeroSecreto: null,
    limite: 10,
    tentativasRestantes: TOTAL_TENTATIVAS,
    jogoAtivo: false
});

let estado = estadoInicial();

function sortearNumero(limite) {
    return Math.floor(Math.random() * (limite + 1));
}

function mostrarMensagem(texto = '', tipo = '') {
    elementos.mensagem.textContent = texto;
    elementos.mensagem.className = tipo ? `message message--${tipo}` : 'message';
}

function atualizarVidas() {
    const quantidade = estado.tentativasRestantes;
    elementos.rotuloVidas.textContent = `${quantidade} ${quantidade === 1 ? 'tentativa restante' : 'tentativas restantes'}`;

    elementos.vidas.forEach((coracao, indice) => {
        coracao.src = indice < quantidade ? 'img/heart.png' : 'img/broken-heart.png';
    });
}

function atualizarDisplay(numero, resultado) {
    elementos.display.className = `display display--${resultado}`;
    elementos.display.innerHTML = '';

    const conteudo = document.createElement('span');
    conteudo.className = 'display__number';
    conteudo.textContent = numero;
    elementos.display.append(conteudo);
}

function iniciarJogo() {
    const dificuldade = document.querySelector('input[name="nivel"]:checked');
    estado = {
        numeroSecreto: sortearNumero(Number(dificuldade.value)),
        limite: Number(dificuldade.value),
        tentativasRestantes: TOTAL_TENTATIVAS,
        jogoAtivo: true
    };

    elementos.dificuldades.disabled = true;
    elementos.botaoComecar.hidden = true;
    elementos.areaPalpite.hidden = false;
    elementos.botaoConfirmar.disabled = false;
    elementos.botaoReiniciar.hidden = true;
    elementos.palpite.disabled = false;
    elementos.palpite.min = '0';
    elementos.palpite.max = String(estado.limite);
    elementos.palpite.value = '';
    elementos.rotuloPalpite.textContent = `Seu palpite (entre 0 e ${estado.limite})`;
    elementos.display.className = 'display';
    elementos.display.innerHTML = '<img src="img/sinal-de-interrogacao.png" alt="">';
    mostrarMensagem(`Valendo! Digite um número entre 0 e ${estado.limite}.`, 'info');
    atualizarVidas();
    elementos.palpite.focus();
}

function finalizarJogo(venceu) {
    estado.jogoAtivo = false;
    elementos.palpite.disabled = true;
    elementos.botaoConfirmar.disabled = true;
    elementos.botaoReiniciar.hidden = false;
    atualizarDisplay(estado.numeroSecreto, venceu ? 'success' : 'danger');
    mostrarMensagem(
        venceu ? 'Parabéns, você acertou!' : `Suas tentativas acabaram. O número era ${estado.numeroSecreto}.`,
        venceu ? 'success' : 'error'
    );
    elementos.botaoReiniciar.focus();
}

function validarPalpite() {
    const texto = elementos.palpite.value.trim();

    if (texto === '') {
        mostrarMensagem('Digite um número antes de confirmar.', 'error');
        return null;
    }

    const numero = Number(texto);
    if (!Number.isInteger(numero) || numero < 0 || numero > estado.limite) {
        mostrarMensagem(`Digite um número inteiro entre 0 e ${estado.limite}.`, 'error');
        return null;
    }

    return numero;
}

function processarPalpite(evento) {
    evento.preventDefault();
    if (!estado.jogoAtivo) return;

    const palpite = validarPalpite();
    if (palpite === null) {
        elementos.palpite.focus();
        return;
    }

    if (palpite === estado.numeroSecreto) {
        finalizarJogo(true);
        return;
    }

    estado.tentativasRestantes -= 1;
    atualizarVidas();

    if (estado.tentativasRestantes === 0) {
        finalizarJogo(false);
        return;
    }

    const dica = palpite > estado.numeroSecreto ? 'O número secreto é menor.' : 'O número secreto é maior.';
    mostrarMensagem(`${dica} Tente novamente.`, 'info');
    elementos.palpite.select();
}

function reiniciarJogo() {
    estado = estadoInicial();
    elementos.dificuldades.disabled = false;
    elementos.botaoComecar.hidden = false;
    elementos.areaPalpite.hidden = true;
    elementos.botaoReiniciar.hidden = true;
    elementos.display.className = 'display';
    elementos.display.innerHTML = '<img src="img/sinal-de-interrogacao.png" alt="">';
    mostrarMensagem();
    atualizarVidas();
    elementos.botaoComecar.focus();
}

elementos.botaoComecar.addEventListener('click', iniciarJogo);
elementos.formulario.addEventListener('submit', processarPalpite);
elementos.botaoReiniciar.addEventListener('click', reiniciarJogo);

atualizarVidas();
