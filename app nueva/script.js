"use strict";

let pacientes = JSON.parse(localStorage.getItem("db_triage_v7")) || [];

document.addEventListener("DOMContentLoaded", () => {
    initApp();
    render();
    setInterval(render, 10000);
});

function initApp() {
    const form = document.getElementById("formPaciente");
    const inputDolor = document.getElementById("dolor");
    const displayDolor = document.getElementById("valorDolor");

    inputDolor.addEventListener("input", (e) => {
        displayDolor.textContent = e.target.value;
        const val = parseInt(e.target.value);
        displayDolor.style.background = val >= 8 ? "#f85149" : val >= 4 ? "#d29922" : "#2f81f7";
    });

    document.getElementById("buscador").addEventListener("input", render);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const p = {
            id: Date.now(),
            nombre: document.getElementById("nombre").value.trim(),
            edad: parseInt(document.getElementById("edad").value),
            dolor: parseInt(inputDolor.value),
            signosAlarma: document.getElementById("signosAlarma").checked,
            inmunodeprimido: document.getElementById("inmunodeprimido").checked,
            area: document.getElementById("areaDerivacion").value.trim(),
            sintomas: document.getElementById("sintomas").value.trim(),
            motivo: document.getElementById("motivoDerivacion").value.trim(),
            estado: "espera"
        };
        p.prioridad = calcularPrioridad(p);
        pacientes.push(p);
        save();
        render();
        form.reset();
        displayDolor.textContent = "0";
        displayDolor.style.background = "#2f81f7";
    });

    setInterval(() => {
        const el = document.getElementById("clock");
        if(el) el.textContent = new Date().toLocaleTimeString();
    }, 1000);
}

function calcularPrioridad(p) {
    if (p.signosAlarma || p.dolor >= 8) return "urgente";
    if (p.inmunodeprimido || p.dolor >= 4) return "moderado";
    return "leve";
}

function marcarAtendido(id) {
    const p = pacientes.find(p => p.id === id);
    if (p) { p.estado = "atendido"; save(); render(); }
}

function eliminarPaciente(id) {
    if (confirm("¿Archivar ficha definitivamente?")) {
        pacientes = pacientes.filter(p => p.id !== id);
        save(); render();
    }
}

function save() { localStorage.setItem("db_triage_v7", JSON.stringify(pacientes)); }

function render() {
    const list = document.getElementById("listaPacientes");
    const search = document.getElementById("buscador").value.toLowerCase();
    const orden = { "urgente": 1, "moderado": 2, "leve": 3 };
    
    const filtrados = pacientes
        .filter(p => p.nombre.toLowerCase().includes(search))
        .sort((a, b) => {
            if (a.estado !== b.estado) return a.estado === "atendido" ? 1 : -1;
            return orden[a.prioridad] - orden[b.prioridad];
        });

    list.innerHTML = filtrados.map(p => {
        return `
            <div class="paciente ${p.estado === 'atendido' ? 'atendido-style' : p.prioridad}">
                <div class="p-info">
                    <strong style="font-size: 1.2rem;">${p.nombre.toUpperCase()}</strong>
                    <span style="color: var(--accent); margin-left: 10px;">${p.edad} años</span>
                    
                    <p style="margin-top: 8px; font-size: 0.95rem; color: #fff;"><strong>Ingreso:</strong> ${p.sintomas || 'Sin datos'}</p>
                    
                    ${p.area ? `
                        <div style="margin-top: 10px; padding: 12px; background: rgba(47,129,247,0.1); border-radius: 8px; border-left: 3px solid var(--accent);">
                            <span style="display:block; font-size: 0.75rem; color: var(--accent); font-weight: 800;">⬆️ PASE A: ${p.area.toUpperCase()}</span>
                            <p style="font-size: 0.85rem; color: #8b949e; margin-top: 4px;"><em>"${p.motivo || 'Sin motivo especificado'}"</em></p>
                        </div>
                    ` : ''}

                    <div style="margin-top: 12px; font-size: 0.7rem; color: #555; font-weight: bold;">
                        HORA REPORTE: ${new Date(p.id).toLocaleTimeString()}
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

    const contador = document.getElementById("count-espera");
    if(contador) contador.textContent = pacientes.filter(p => p.estado === "espera").length;
}