"use strict";

let pacientes = JSON.parse(localStorage.getItem("db_triage_final")) || [];

document.addEventListener("DOMContentLoaded", () => {
    initApp();
    render();
    // Actualización de alertas cada 5 segundos
    setInterval(render, 5000);
});

function initApp() {
    const form = document.getElementById("formPaciente");
    const inputDolor = document.getElementById("dolor");
    const displayDolor = document.getElementById("valorDolor");

    inputDolor.addEventListener("input", (e) => {
        displayDolor.textContent = e.target.value;
        const val = e.target.value;
        displayDolor.style.background = val >= 8 ? "#f85149" : val >= 4 ? "#d29922" : "#2f81f7";
    });

    document.getElementById("buscador").addEventListener("input", render);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const p = {
            id: Date.now(), // Usamos el ID como timestamp de ingreso
            nombre: document.getElementById("nombre").value.trim(),
            edad: parseInt(document.getElementById("edad").value),
            dolor: parseInt(inputDolor.value),
            signosAlarma: document.getElementById("signosAlarma").checked,
            inmunodeprimido: document.getElementById("inmunodeprimido").checked,
            sintomas: document.getElementById("sintomas").value.trim(),
            estado: "espera"
        };
        p.prioridad = calcularPrioridad(p);
        pacientes.push(p);
        save();
        render();
        form.reset();
        displayDolor.textContent = "0";
    });

    setInterval(() => {
        document.getElementById("clock").textContent = new Date().toLocaleTimeString();
    }, 1000);
}

function calcularPrioridad(p) {
    if (p.signosAlarma || p.dolor >= 8) return "urgente";
    if (p.inmunodeprimido || p.dolor >= 4) return "moderado";
    return "leve";
}

function render() {
    const list = document.getElementById("listaPacientes");
    const search = document.getElementById("buscador").value.toLowerCase();
    const orden = { "urgente": 1, "moderado": 2, "leve": 3 };
    const AHORA = Date.now();

    const filtrados = pacientes
        .filter(p => p.nombre.toLowerCase().includes(search))
        .sort((a, b) => {
            if (a.estado !== b.estado) return a.estado === "atendido" ? 1 : -1;
            return orden[a.prioridad] - orden[b.prioridad];
        });

    list.innerHTML = filtrados.map(p => {
        // LÓGICA DE ALERTA: Si es urgente y espera más de 60 segundos (ajustable)
        const segundosEspera = (AHORA - p.id) / 1000;
        const esAlerta = p.estado === "espera" && p.prioridad === "urgente" && segundosEspera > 60;

        return `
            <div class="paciente ${p.estado === 'atendido' ? 'atendido-style' : p.prioridad} ${esAlerta ? 'alerta-espera' : ''}">
                <div class="p-info">
                    <strong style="font-size: 1.2rem;">${p.nombre.toUpperCase()}</strong>
                    <span style="margin-left: 10px; opacity: 0.8;">${p.edad} años</span>
                    <p style="margin-top: 8px; font-size: 0.9rem; color: #8b949e;">${p.sintomas}</p>
                    <div style="margin-top: 10px;">
                        <span style="color: ${esAlerta ? '#f85149' : '#555'}; font-weight: bold;">
                            ${esAlerta ? '⚠️ CRÍTICO: TIEMPO EXCEDIDO' : `Ingreso: ${new Date(p.id).toLocaleTimeString()}`}
                        </span>
                    </div>
                </div>
                <div class="p-actions">
                    ${p.estado === 'espera' 
                        ? `<button class="btn-atender" onclick="marcarAtendido(${p.id})">ATENDER</button>`
                        : `<button class="btn-eliminar" onclick="eliminarPaciente(${p.id})">FINALIZAR</button>`
                    }
                </div>
            </div>
        `;
    }).join("");

    document.getElementById("count-espera").textContent = pacientes.filter(p => p.estado === "espera").length;
}

function marcarAtendido(id) {
    const p = pacientes.find(p => p.id === id);
    if (p) { p.estado = "atendido"; save(); render(); }
}

function eliminarPaciente(id) {
    if (confirm("¿Confirmar egreso y archivar ficha?")) {
        pacientes = pacientes.filter(p => p.id !== id);
        save(); render();
    }
}

function save() { localStorage.setItem("db_triage_final", JSON.stringify(pacientes)); }