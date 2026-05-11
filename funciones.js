let personajeActual = 1;
let personajeBloqueado = null;
let musicaJuego = null;

function jugar() {
    ponerBG();
    setTimeout(function () {
        window.location.assign('personaje.html');
    }, 2000);
    reproducirAudio('sfx/start.m4a');
}

function ponerBG() {
    var capa = document.querySelector('.bg-transicion');
    if (!capa) return;
    capa.classList.remove('bg-transicion-hide');
    capa.classList.add('bg-transicion-show');
}

function quitarBG() {
    var capa = document.querySelector('.bg-transicion');
    if (!capa) return;
    capa.classList.add('bg-transicion-hide');
    setTimeout(function () {
        capa.classList.remove('bg-transicion-show');
        capa.classList.remove('bg-transicion-hide');
    }, 1100);
}

function inicializarSelectorPersonaje() {
    personajeBloqueado = document.getElementById('jugador2') ? parseInt(localStorage.getItem('personaje1'), 10) : null;
    if (personajeBloqueado === personajeActual) {
        moverPersonaje(1);
        return;
    }
    actualizarPersonaje();
}

function actualizarPersonaje() {
    let img = document.getElementById('personaje');
    if(img) img.src = 'img/p' + personajeActual + '.png';
}

function moverPersonaje(direccion) {
    do {
        personajeActual += direccion;
        if (personajeActual > 6) personajeActual = 1;
        if (personajeActual < 1) personajeActual = 6;
    } while (personajeBloqueado === personajeActual);
    actualizarPersonaje();
}

function siguientePersonaje() {
    moverPersonaje(1);
    reproducirAudio('sfx/Jump.mp3');
}

function anteriorPersonaje() {
    moverPersonaje(-1);
    reproducirAudio('sfx/Jump.mp3');
}

function personaje2() {
    localStorage.setItem('personaje1', personajeActual);
    localStorage.setItem('jugador1', document.getElementById('jugador1').value);
    ponerBG();
    setTimeout(function () {
        window.location.assign('personaje2.html');
    }, 2000);
    reproducirAudio('sfx/Jump.mp3');
}

function comenzarJuego() {
    localStorage.setItem('personaje2', personajeActual);
    localStorage.setItem('jugador2', document.getElementById('jugador2').value);
    ponerBG();
    setTimeout(function () {
        window.location.assign('juego.html');
    }, 2000);
    reproducirAudio('sfx/Jump.mp3');
}

function cargarEscenario() {
    if (!localStorage.getItem('marcador1')) {
        localStorage.setItem('marcador1', '0');
        localStorage.setItem('marcador2', '0');
    }

    var marcador1 = parseInt(localStorage.getItem('marcador1'), 10);
    var marcador2 = parseInt(localStorage.getItem('marcador2'), 10);

    // Dibujar vidas (calaveras)
    let v1 = document.querySelector('.vidas1');
    let v2 = document.querySelector('.vidas2');
    if(v1) { for (var i = 0; i < marcador2; i++) v1.innerHTML += "<img src='img/calavera.png'>"; }
    if(v2) { for (var i = 0; i < marcador1; i++) v2.innerHTML += "<img src='img/calavera.png'>"; }

    if (marcador1 >= 3 || marcador2 >= 3) {
        let capaGanador = document.querySelector('.ganador');
        if(capaGanador) capaGanador.style.display = 'block';
        
        document.querySelector('.bg-juego').style.backgroundImage = "url('img/bg_personaje.png')";
        
        let nomG = document.querySelector('#nombreganador');
        let imgG = document.querySelector('#imgGanador');

        if (marcador1 >= 3) {
            if(nomG) nomG.innerHTML = localStorage.getItem('jugador1');
            if(imgG) imgG.src = 'img/p' + localStorage.getItem('personaje1') + '.png';
        } else {
            if(nomG) nomG.innerHTML = localStorage.getItem('jugador2');
            if(imgG) imgG.src = 'img/p' + localStorage.getItem('personaje2') + '.png';
        }
        document.querySelector('.left').style.display = 'none';
        document.querySelector('.right').style.display = 'none';
        document.querySelector('.conteo').style.display = 'none';
    } else {
        listos();
        let capaGanador = document.querySelector('.ganador');
        if(capaGanador) capaGanador.style.display = 'none';
    }

    // Configurar fondo y personajes
    var bg = Math.floor(Math.random() * 3) + 1;
    var p1Img = localStorage.getItem('personaje1') || 1;
    var p2Img = localStorage.getItem('personaje2') || 2;

    let escenario = document.querySelector('.bg-juego');
    if (escenario && marcador1 < 3 && marcador2 < 3) {
        escenario.style.backgroundImage = 'url("img/bg' + bg + '.png")';
    }

    let p1 = document.querySelector('.p1');
    let p2 = document.querySelector('.p2');
    if (p1) p1.style.setProperty('--personaje-img', 'url("img/p' + p1Img + '.png")');
    if (p2) p2.style.setProperty('--personaje-img', 'url("img/p' + p2Img + '.png")');

    let j1 = document.getElementById('jugador1');
    let j2 = document.getElementById('jugador2');
    if (j1) j1.textContent = localStorage.getItem('jugador1');
    if (j2) j2.textContent = localStorage.getItem('jugador2');

    reproducirMusicaJuego();
}

function reproducirAudio(ruta) {
    var audio = new Audio(ruta);
    audio.play().catch(() => {});
}

function reproducirMusicaJuego() {
    if (!document.querySelector('.bg-juego')) return;
    musicaJuego = new Audio('sfx/start.m4a');
    musicaJuego.play().catch(() => {});
}

function listos() {
    setTimeout(() => { 
        let msj = document.querySelector('.msj');
        if(msj) msj.style.opacity = '1'; 
    }, 500);
}

function conteo() {
    var sfxclick = new Audio('sfx/Jump.mp3');
    document.querySelector('.msj').style.opacity = '0';
    document.querySelector('.msj').style.pointerEvents = 'none';
    
    let n3 = document.querySelector('.no3');
    n3.style.opacity = '1';
    sfxclick.play();

    setTimeout(() => {
        n3.style.opacity = '0';
        document.querySelector('.no2').style.opacity = '1';
        sfxclick.play();
        setTimeout(() => {
            document.querySelector('.no2').style.opacity = '0';
            document.querySelector('.no1').style.opacity = '1';
            sfxclick.play();
            setTimeout(() => {
                document.querySelector('.no1').style.opacity = '0';
                document.querySelector('.conteo').style.display = 'none';
                document.querySelector('.left').setAttribute('onclick', 'disparo1()');
                document.querySelector('.right').setAttribute('onclick', 'disparo2()');
            }, (Math.floor(Math.random() * 3) + 1) * 1000);
        }, 1000);
    }, 1000);
}

function disparo1() {
    document.querySelector('.right').onclick = null;
    document.querySelector('.p2').style.right = '-800px';
    let m1 = parseInt(localStorage.getItem('marcador1') || 0) + 1;
    localStorage.setItem('marcador1', m1);
    reproducirAudio('sfx/start.m4a');
    setTimeout(() => location.reload(), 2000);
}

function disparo2() {
    document.querySelector('.left').onclick = null;
    document.querySelector('.p1').style.left = '-800px';
    let m2 = parseInt(localStorage.getItem('marcador2') || 0) + 1;
    localStorage.setItem('marcador2', m2);
    reproducirAudio('sfx/start.m4a');
    setTimeout(() => location.reload(), 2000);
}

function restart() {
    localStorage.setItem('marcador1', 0);
    localStorage.setItem('marcador2', 0);
    window.location.assign('index.html');
}