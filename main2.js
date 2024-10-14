const d = document;

/* Variables de tiempo para cada contexto */
let tiempoEnfoque = 1500;
let tiempoDescansoCorto = 300;
let tiempoDescansoLargo = 900;

/* Variables de control para los intervalos */
let idIntervalo = null;
let tiempoActual = 0;
let contextoActual = '';

/* Elementos DOM */
const html = d.querySelector('html');
const btnEnfoque = d.querySelector('.app__card-button--enfoque');
const btnCorto = d.querySelector('.app__card-button--corto');
const btnLargo = d.querySelector('.app__card-button--largo');
const banner = d.querySelector('.app__image');
const appTitle = d.querySelector('.app__title');
const startPauseBtn = d.getElementById('start-pause');
const textoInicioPausa = d.querySelector('#start-pause span');
const playPauseImg = d.querySelector('.app__card-primary-butto-icon');
const timer = d.getElementById('timer');

/* Audios */
const musica = new Audio('./sonidos/luna-rise-part-one.mp3');
const audioPlay = new Audio('./sonidos/play.wav');
const audioPausa = new Audio('./sonidos/pause.mp3');
const audioStop = new Audio('./sonidos/beep.mp3');

musica.loop = true;
d.getElementById('alternar-musica').addEventListener('change', (e) => {
    e.target.checked ? musica.play() : musica.pause();
});

/* Manejadores de botones de contexto */
btnEnfoque.addEventListener('click', () => cambiarContexto('enfoque', tiempoEnfoque));
btnCorto.addEventListener('click', () => cambiarContexto('descanso-corto', tiempoDescansoCorto));
btnLargo.addEventListener('click', () => cambiarContexto('descanso-largo', tiempoDescansoLargo));

const cambiarContexto = (contexto, tiempo) => {
    /* Detener temporizador anterior */
    reiniciar();

    /* Cambiar contexto */
    contextoActual = contexto;
    tiempoActual = tiempo;

    /* Actualizar UI */
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `imagenes/${contexto}.png`);

    switch (contexto) {
        case 'enfoque':
            appTitle.innerHTML = `<h1 class="app__title">Optimiza tu productividad,<br /><strong class="app__title-strong">sumérgete en lo que importa.</strong></h1>`;
            break;
        case 'descanso-corto':
            appTitle.innerHTML = `<h1 class="app__title">¿Qué tal tomar un respiro?<br /><strong class="app__title-strong">¡Haz una pausa corta!</strong></h1>`;
            break;
        case 'descanso-largo':
            appTitle.innerHTML = `<h1 class="app__title">Hora de volver a la superficie.<br /><strong class="app__title-strong">Haz una pausa larga.</strong></h1>`;
            break;
    }

    /* Actualizar estado visual de los botones */
    actualizarEstadoBotones(contexto);

    /* Mostrar el tiempo correspondiente en pantalla */
    tiempoEnPantalla();
};

const actualizarEstadoBotones = (contexto) => {
    btnEnfoque.classList.toggle('active', contexto === 'enfoque');
    btnCorto.classList.toggle('active', contexto === 'descanso-corto');
    btnLargo.classList.toggle('active', contexto === 'descanso-largo');
};

const cuentaRegresiva = () => {
    if (tiempoActual <= 0) {
        audioStop.play();
        reiniciar();
        return;
    }

    tiempoActual -= 1;
    tiempoEnPantalla();
};

startPauseBtn.addEventListener('click', () => {
    iniciarPausar();
});

const iniciarPausar = () => {
    if (idIntervalo) {
        /* Pausar */
        audioPausa.play();
        reiniciar();
    } else {
        /* Iniciar */
        audioPlay.play();
        idIntervalo = setInterval(cuentaRegresiva, 1000);
        textoInicioPausa.textContent = 'Pausar';
        playPauseImg.setAttribute('src', './imagenes/pause.png');
    }
};

const reiniciar = () => {
    clearInterval(idIntervalo);
    idIntervalo = null;
    textoInicioPausa.textContent = 'Comenzar';
    playPauseImg.setAttribute('src', './imagenes/play_arrow.png');
    tiempoEnPantalla();
};

const tiempoEnPantalla = () => {
    const tiempo = new Date(tiempoActual * 1000);
    const formatoMinutosSegundos = tiempo.toLocaleTimeString('es-MX', {
        minute: '2-digit',
        second: '2-digit',
    });
    timer.innerHTML = formatoMinutosSegundos;
};

/* Iniciar con el contexto de enfoque */
cambiarContexto('enfoque', tiempoEnfoque);
