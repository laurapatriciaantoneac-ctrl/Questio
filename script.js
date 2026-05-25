/* ================================================
   DATE INVITATION - script.js
   ================================================ */

// --- Pantallas ---
const screens = {
    question: document.getElementById("screen-question"),
    form:     document.getElementById("screen-form"),
    success:  document.getElementById("screen-success"),
};

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[name].classList.add("active");
}

// --- Elementos ---
const yesBtn    = document.getElementById("yes-btn");
const noBtn     = document.getElementById("no-btn");
const hintText  = document.getElementById("hint-text");
const confirmBtn = document.getElementById("confirm-btn");
const dateInput = document.getElementById("date-input");
const timeInput = document.getElementById("time-input");

// --- Bloquear fechas pasadas ---
const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);

// --- Lógica del botón NO ---
let noCount = 0;
const hints = [
    "Venga, no seas así... 🥺",
    "¿Seguro? Piénsalo bien...",
    "¡El botón se ha escapado! 😂",
    "¡No puedes clickarme! 😝",
    "Casi, casi... 😏",
    "¡Sigue intentándolo! 😂",
    "¡Ríndete! El Sí te espera ❤️",
    "Ok, ya lo pillo, pero... ¿de verdad? 😢",
    "¡ÚLTIMO INTENTO! 😤",
];

function moveNoBtn() {
    noCount++;
    hintText.textContent = hints[Math.min(noCount - 1, hints.length - 1)];

    // El botón SÍ crece un poco cada vez
    const scale = Math.min(1 + noCount * 0.08, 2);
    yesBtn.style.transform = `translate(-50%, -50%) scale(${scale})`;

    // El botón NO se hace más pequeño
    const minSize = Math.max(12 - noCount * 0.5, 8);
    noBtn.style.fontSize = minSize + "px";

    // Área disponible dentro de .btn-area (sin salirse)
    const area   = noBtn.parentElement.getBoundingClientRect();
    const btnW   = noBtn.offsetWidth;
    const btnH   = noBtn.offsetHeight;

    const maxX = area.width  - btnW - 10;
    const maxY = area.height - btnH - 10;

    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    noBtn.style.left = newX + "px";
    noBtn.style.top  = newY + "px";

    // Tras 10 intentos, lo ocultamos
    if (noCount >= 10) {
        noBtn.style.opacity = "0";
        noBtn.style.pointerEvents = "none";
        hintText.textContent = "Creo que ya no tienes opción 😇";
    }
}

noBtn.addEventListener("mouseover", moveNoBtn);
noBtn.addEventListener("touchstart", moveNoBtn, { passive: true });
noBtn.addEventListener("click", moveNoBtn);

// --- Botón SÍ → formulario ---
yesBtn.addEventListener("click", () => {
    showScreen("form");
});

// --- Confirmar cita ---
confirmBtn.addEventListener("click", () => {
    const date = dateInput.value;
    const time = timeInput.value;

    if (!date || !time) {
        // Marcar campos vacíos
        if (!date) dateInput.style.borderColor = "#ff4f8b";
        if (!time) timeInput.style.borderColor = "#ff4f8b";
        setTimeout(() => {
            dateInput.style.borderColor = "";
            timeInput.style.borderColor = "";
        }, 1500);
        return;
    }

    // Formatear fecha en español
    const [y, m, d] = date.split("-");
    const months = ["enero","febrero","marzo","abril","mayo","junio",
                    "julio","agosto","septiembre","octubre","noviembre","diciembre"];
    const dateStr = `${parseInt(d)} de ${months[parseInt(m) - 1]} de ${y}`;

    // Formatear hora
    const [hh, mm] = time.split(":");
    const hour = parseInt(hh);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12  = ((hour % 12) || 12);
    const timeStr = `${h12}:${mm} ${ampm}`;

    document.getElementById("summary-date").textContent = `📅 ${dateStr}`;
    document.getElementById("summary-time").textContent = `⏰ ${timeStr}`;

    showScreen("success");
    launchCelebration();
});

// --- Partículas flotantes constantes ---
const EMOJIS = ["💖","🌸","✨","💕","🌷","💗","🎀","💓"];
const container = document.getElementById("particles");

function createParticle() {
    const el = document.createElement("div");
    el.className = "particle";
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    el.style.left = (Math.random() * 100) + "vw";
    el.style.fontSize = (16 + Math.random() * 22) + "px";
    el.style.animationDuration = (5 + Math.random() * 5) + "s";
    el.style.animationDelay    = (Math.random() * 3) + "s";
    container.appendChild(el);
    setTimeout(() => el.remove(), 10000);
}

setInterval(createParticle, 400);

// --- Celebración al confirmar ---
function launchCelebration() {
    for (let i = 0; i < 20; i++) {
        setTimeout(createParticle, i * 80);
    }
}
