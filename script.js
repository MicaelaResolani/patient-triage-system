let pacientes = [];
let historial = [];

document.addEventListener("DOMContentLoaded", () => {
  const guardados = localStorage.getItem("pacientes");
  const hist = localStorage.getItem("historial");

  if (guardados) pacientes = JSON.parse(guardados);
  if (hist) historial = JSON.parse(hist);

  renderPacientes();
});

const form = document.getElementById("formPaciente");
const nombre = document.getElementById("nombre");
const edad = document.getElementById("edad");
const sintomas = document.getElementById("sintomas");
const dolor = document.getElementById("dolor");
const valorDolor = document.getElementById("valorDolor");
const signosAlarma = document.getElementById("signosAlarma");
const inmunodeprimido = document.getElementById("inmunodeprimido");
const buscador = document.getElementById("buscador");

dolor.addEventListener("input", () => {
  valorDolor.textContent = dolor.value;
});

buscador.addEventListener("input", renderPacientes);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const paciente = {
    id: Date.now(),
    nombre: nombre.value.trim(),
    edad: Number(edad.value),
    sintomas: sintomas.value.trim(),
    dolor: Number(dolor.value),
    signosAlarma: signosAlarma.checked,
    inmunodeprimido: inmunodeprimido.checked,
    fechaIngreso: new Date(),
    estado: "espera"
  };

  if (!paciente.nombre || !paciente.edad) return;

  paciente.prioridad = calcularNivel(paciente);

  pacientes.push(paciente);
  guardar();
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

function guardar() {
  localStorage.setItem("pacientes", JSON.stringify(pacientes));
}

function toggleAtendido(id) {
  const p = pacientes.find(p => p.id === id);
  if (!p) return;

  p.estado = p.estado === "atendido" ? "espera" : "atendido";

  guardar();
  renderPacientes();
}

function derivarPaciente(id) {
  const p = pacientes.find(p => p.id === id);
  if (!p) return;

  const destino = prompt("Derivar a:");
  const motivo = prompt("Motivo:");

  p.estado = "derivado";
  p.destino = destino;
  p.motivo = motivo;

  guardar();
  renderPacientes();
}

function eliminarPaciente(id) {
  pacientes = pacientes.filter(p => p.id !== id);
  guardar();
  renderPacientes();
}

function renderPacientes() {
  const lista = document.getElementById("listaPacientes");
  lista.innerHTML = "";

  const texto = buscador.value.toLowerCase();

  pacientes
    .filter(p => p.nombre.toLowerCase().includes(texto))
    .forEach(p => {

      const div = document.createElement("div");
      div.classList.add("paciente", p.prioridad);

      if (p.estado === "atendido") div.classList.add("atendido");

      const derivacion = p.estado === "derivado"
        ? `<br>📍 ${p.destino}<br>📄 ${p.motivo}`
        : "";

      const eliminarBtn = p.estado === "atendido"
        ? `<button class="eliminar" onclick="eliminarPaciente(${p.id})">Eliminar</button>`
        : "";

      div.innerHTML = `
        <strong>${p.nombre}</strong> (${p.edad})<br>
        ${p.sintomas}<br>
        ${p.prioridad.toUpperCase()}<br>
        Estado: ${p.estado}
        ${derivacion}<br>

        <button onclick="toggleAtendido(${p.id})">Atender</button>
        <button onclick="derivarPaciente(${p.id})">Derivar</button>
        ${eliminarBtn}
      `;

      lista.appendChild(div);
    });
}