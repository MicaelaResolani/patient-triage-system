let pacientes = [];

const form = document.getElementById("formPaciente");

const nombre = document.getElementById("nombre");
const edad = document.getElementById("edad");
const sintomas = document.getElementById("sintomas");
const dolor = document.getElementById("dolor");
const valorDolor = document.getElementById("valorDolor");
const signosAlarma = document.getElementById("signosAlarma");
const inmunodeprimido = document.getElementById("inmunodeprimido");
const buscador = document.getElementById("buscador");

// slider
dolor.addEventListener("input", () => {
  valorDolor.textContent = dolor.value;
});

// buscador
if (buscador) {
  buscador.addEventListener("input", renderPacientes);
}

// submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const paciente = {
    nombre: nombre.value,
    edad: Number(edad.value),
    sintomas: sintomas.value,
    dolor: Number(dolor.value),
    signosAlarma: signosAlarma.checked,
    inmunodeprimido: inmunodeprimido.checked,
    fechaIngreso: new Date()
  };

  paciente.score = calcularScore(paciente);
  paciente.prioridad = obtenerPrioridadDesdeScore(paciente.score);

  pacientes.push(paciente);
  renderPacientes();

  form.reset();
  valorDolor.textContent = "0";
});

// lógica
function calcularScore(p) {
  let score = 0;

  if (p.signosAlarma) score += 5;
  if (p.inmunodeprimido) score += 3;
  if (p.dolor >= 7) score += 3;
  if (p.edad > 65) score += 2;

  return score;
}

function obtenerPrioridadDesdeScore(score) {
  if (score >= 7) return "urgente";
  if (score >= 4) return "moderado";
  return "leve";
}

// render
function renderPacientes() {
  const lista = document.getElementById("listaPacientes");
  lista.innerHTML = "";

  renderResumen();

  const texto = buscador ? buscador.value.toLowerCase() : "";

  const filtrados = pacientes.filter(p =>
    p.nombre.toLowerCase().includes(texto)
  );

  filtrados.sort((a, b) => {
    const orden = { urgente: 1, moderado: 2, leve: 3 };
    return orden[a.prioridad] - orden[b.prioridad];
  });

  filtrados.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("paciente", p.prioridad);

    const ahora = new Date();
    const tiempo = Math.floor((ahora - new Date(p.fechaIngreso)) / 60000);

    let alerta = "";
    if (p.prioridad === "urgente" && tiempo > 1) {
      alerta = "<span class='alerta'>⚠️ URGENTE ESPERANDO</span>";
    }

    let explicacion = "";
    if (p.signosAlarma) explicacion += "Signos de alarma. ";
    if (p.inmunodeprimido) explicacion += "Inmunodeprimido. ";
    if (p.dolor >= 7) explicacion += "Dolor intenso. ";
    if (p.edad > 65) explicacion += "Adulto mayor. ";

    div.innerHTML = `
      <strong>${p.nombre}</strong> (${p.edad} años)<br>
      ${p.sintomas}<br>
      🩺 ${explicacion}<br>
      🧠 Score: ${p.score}<br>
      Prioridad: ${p.prioridad.toUpperCase()}<br>
      ⏱️ Espera: ${tiempo} min<br>
      ${alerta}<br>

      <button onclick="atenderPaciente(${pacientes.indexOf(p)})">
        Atender
      </button>
    `;

    lista.appendChild(div);
  });
}

// eliminar
function atenderPaciente(index) {
  pacientes.splice(index, 1);
  renderPacientes();
}

// resumen
function renderResumen() {
  const resumen = document.getElementById("resumen");

  const urgentes = pacientes.filter(p => p.prioridad === "urgente").length;
  const moderados = pacientes.filter(p => p.prioridad === "moderado").length;
  const leves = pacientes.filter(p => p.prioridad === "leve").length;

  resumen.innerHTML = `
    🔴 Urgentes: ${urgentes} |
    🟡 Moderados: ${moderados} |
    🟢 Leves: ${leves}
  `;
}