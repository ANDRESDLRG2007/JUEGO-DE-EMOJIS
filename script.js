let score = 0;
let timeLeft = 30;
let velocidad;
let probabilidadBueno;
let penalizacionMalo;
let penalizacionSalto;
let primerEmojiClickado = false;
let demonMode = false;
let sizeEmoji = 50;
let spawnMultiple = 1;

const dificultad = localStorage.getItem("dificultadEmoji") || "medio";

if (dificultad === "facil") {
    velocidad = 2000;
    probabilidadBueno = 0.8;
    penalizacionMalo = 5;
    penalizacionSalto = 0.5;
} else if (dificultad === "medio") {
    velocidad = 1500;
    probabilidadBueno = 0.7;
    penalizacionMalo = 10;
    penalizacionSalto = 1;
} else if (dificultad === "dificil") {
    velocidad = 1000;
    probabilidadBueno = 0.6;
    penalizacionMalo = 15;
    penalizacionSalto = 2;
} else if (dificultad === "demon") {
    velocidad = 800;
    probabilidadBueno = 0.5;
    penalizacionMalo = 20;
    penalizacionSalto = 3;
    demonMode = true;
}

const emojiArea = document.getElementById("emoji-area");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const gameOverText = document.getElementById("game-over");

const emojisBuenos = ["😀", "😄", "😁", "😊", "😍"];
const emojisMalos = ["😈", "💣"];

let gameTimeout;
let timerInterval;

function startGame() {
    mostrarPrimerEmoji();
    timerInterval = setInterval(updateTimer, 1000);
}

function mostrarPrimerEmoji() {
    emojiArea.innerHTML = "";

    const emoji = document.createElement("span");
    emoji.textContent = emojisBuenos[Math.floor(Math.random() * emojisBuenos.length)];
    emoji.style.position = "absolute";
    emoji.style.left = "50%";
    emoji.style.top = "50%";
    emoji.style.transform = "translate(-50%, -50%)";
    emoji.style.cursor = "pointer";
    emoji.style.fontSize = sizeEmoji + "px";

    emoji.onclick = () => {
        score++;
        timeLeft += 5;
        scoreDisplay.textContent = score;
        timeDisplay.textContent = timeLeft;
        primerEmojiClickado = true;
        mostrarSegundoEmoji();
    };

    emojiArea.appendChild(emoji);
}

function mostrarSegundoEmoji() {
    emojiArea.innerHTML = "";

    for (let i = 0; i < spawnMultiple; i++) {
        crearEmoji(emojisBuenos[Math.floor(Math.random() * emojisBuenos.length)], true);
    }

    gameTimeout = setTimeout(() => {
        score -= penalizacionSalto;
        scoreDisplay.textContent = score;
        siguienteEmoji();
    }, velocidad);
}

function generarEmoji() {
    emojiArea.innerHTML = "";

    for (let i = 0; i < spawnMultiple; i++) {
        const esBueno = Math.random() < probabilidadBueno;
        const char = esBueno ?
            emojisBuenos[Math.floor(Math.random() * emojisBuenos.length)] :
            emojisMalos[Math.floor(Math.random() * emojisMalos.length)];
        crearEmoji(char, esBueno);
    }
}

function crearEmoji(char, esBueno) {
    const emoji = document.createElement("span");
    emoji.textContent = char;

    const x = Math.random() * (emojiArea.clientWidth - sizeEmoji);
    const y = Math.random() * (emojiArea.clientHeight - sizeEmoji);
    emoji.style.position = "absolute";
    emoji.style.left = `${x}px`;
    emoji.style.top = `${y}px`;
    emoji.style.cursor = "pointer";
    emoji.style.fontSize = sizeEmoji + "px";

    let clickeado = false;

    emoji.onclick = () => {
        clickeado = true;
        if (esBueno) {
            score++;
            timeLeft += 5;
        } else {
            timeLeft -= penalizacionMalo;
            sacudirPantalla();
        }
        scoreDisplay.textContent = score;
        timeDisplay.textContent = timeLeft;
        siguienteEmoji();
    };

    emojiArea.appendChild(emoji);

    gameTimeout = setTimeout(() => {
        if (!clickeado && esBueno) {
            score -= penalizacionSalto;
            scoreDisplay.textContent = score;
        }
        siguienteEmoji();
    }, velocidad);
}

function siguienteEmoji() {
    clearTimeout(gameTimeout);

    if (velocidad > 400) velocidad -= 30;

    // Comportamiento extra para Demon 😈
    if (demonMode) {
        if (timeLeft <= 25) spawnMultiple = 2;
        if (timeLeft <= 20) sizeEmoji = 40;
        if (timeLeft <= 15) spawnMultiple = 3;
        if (timeLeft <= 10) sizeEmoji = 30;
        if (timeLeft <= 5) {
            spawnMultiple = 4;
            sizeEmoji = 20;
        }
    }

    if (score <= 0 || timeLeft <= 0) {
        endGame();
        return;
    }

    generarEmoji();
}

function updateTimer() {
    if (!primerEmojiClickado) return;
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0 || score <= 0) {
        endGame();
    }
}

function endGame() {
    clearTimeout(gameTimeout);
    clearInterval(timerInterval);
    emojiArea.innerHTML = "";
    gameOverText.style.display = "block";
}

function sacudirPantalla() {
    emojiArea.classList.add("shake");
    setTimeout(() => {
        emojiArea.classList.remove("shake");
    }, 400);
}

if (emojiArea) {
    startGame();
}
