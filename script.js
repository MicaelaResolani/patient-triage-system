let pacientes = [];

document.addEventListener('DOMContentLoaded', () => {

const form = document.getElementById("formPaciente");

const nombre = document.getElementById("nombre");
const edad = document.getElementById("edad");
const sintomas = document.getElementById("sintomas");
const dolor = document.getElementById("dolor");
const valorDolor = document.getElementById("valorDolor");
const signosAlarma = document.getElementById("signosAlarma");
const inmunodeprimido = document.getElementById("inmunodeprimido");
const buscador = document.getElementById("buscador");

// SLIDER
dolor.addEventListener("input", () => {
  valorDolor.textContent = dolor.value;
});

// BUSCADOR
buscador.addEventListener("input", renderPacientes);

// SUBMIT
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const paciente = {
    nombre: nombre.value.trim(),
    edad: Number(edad.value),
    sintomas: sintomas.value.trim(),
    dolor: Number(dolor.value),
    signosAlarma: signosAlarma.checked,
    inmunodeprimido: inmunodeprimido.checked,
    fechaIngreso: new Date(),
    atendido: false
  };

  if (!paciente.nombre || !paciente.edad) return;
  paciente.prioridad = calcularNivel(paciente);

  pacientes.push(paciente);
  renderPacientes();

  form.reset();
  valorDolor.textContent = "0";
});

function calcularNivel(p) {
  if (p.signosAlarma) return "urgente";
  if (p.dolor >= 8) return "urgente";

  if (p.inmunodeprimido) return "moderado";
  if (p.dolor >= 4) return "moderado";

  return "leve";
}

function obtenerPrioridadDesdeScore(score) {
  if (score >= 7) return "urgente";
  if (score >= 4) return "moderado";
  return "leve";
}

// RENDER
function renderPacientes() {
  const lista = document.getElementById("listaPacientes");
  lista.innerHTML = "";

  renderResumen();

  const texto = buscador.value.toLowerCase();

  let filtrados = pacientes.filter(p =>
    p.nombre.toLowerCase().includes(texto)
  );

  // ORDEN: urgentes → moderados → leves → atendidos abajo
  filtrados.sort((a, b) => {
    if (a.atendido && !b.atendido) return 1;
    if (!a.atendido && b.atendido) return -1;

    const orden = { urgente: 1, moderado: 2, leve: 3 };
    return orden[a.prioridad] - orden[b.prioridad];
  });

  filtrados.forEach((p, index) => {
    const div = document.createElement("div");
    div.classList.add("paciente", p.prioridad);

    if (p.atendido) div.classList.add("atendido");

    const ahora = new Date();
    const tiempo = Math.floor((ahora - new Date(p.fechaIngreso)) / 60000);

    // ALERTA VISUAL
    let alerta = "";
    if (p.prioridad === "urgente" && tiempo >= 1 && !p.atendido) {
      alerta = "<span class='alerta'>🚨 URGENTE ESPERANDO</span>";
    }

    // EXPLICACION CLINICA
    let explicacion = "";
    if (p.signosAlarma) explicacion += "Signos de alarma. ";
    if (p.inmunodeprimido) explicacion += "Inmunodeprimido. ";
    if (p.dolor >= 7) explicacion += "Dolor intenso. ";
    if (p.edad > 65) explicacion += "Adulto mayor. ";

    // BOTON DINAMICO
    const textoBoton = p.atendido ? "↩ Deshacer" : "✔ Atender";

    const botonEliminar = p.atendido 
  ? `<button class="eliminar">🗑 Eliminar</button>` 
  : "";

    div.innerHTML = `
      <strong>${p.nombre}</strong> (${p.edad} años)<br>
      ${p.sintomas}<br>
      🩺 ${explicacion}<br>
      <span class="alerta">${p.prioridad.toUpperCase()}</span><br>
      ⏱️ Espera: ${tiempo} min<br>
      ${alerta}<br>
      <button class="atender">${textoBoton}</button>
  ${botonEliminar}
    `;
    const btn = div.querySelector('.atender');
    const btnEliminar = div.querySelector('.eliminar');

    if (btnEliminar) {
    btnEliminar.addEventListener('click', () => {
    pacientes.splice(index, 1);
    renderPacientes();
  });
}

    if (btn) {
    btn.addEventListener('click', () => {
    p.atendido = !p.atendido;
    renderPacientes();
  });
}
    lista.appendChild(div);
  });
}

// ATENDER / DESHACER
window.toggleAtendido = function(index) {
  pacientes[index].atendido = !pacientes[index].atendido;
  renderPacientes();
};

// RESUMEN
function renderResumen() {
  const resumen = document.getElementById("resumen");

  const urgentes = pacientes.filter(p => p.prioridad === "urgente" && !p.atendido).length;
  const moderados = pacientes.filter(p => p.prioridad === "moderado" && !p.atendido).length;
  const leves = pacientes.filter(p => p.prioridad === "leve" && !p.atendido).length;

  resumen.innerHTML = `
    🔴 Urgentes: ${urgentes} |
    🟡 Moderados: ${moderados} |
    🟢 Leves: ${leves}
  `;
}
setInterval(renderPacientes, 60000); // actualiza cada 1 minuto

});