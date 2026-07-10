import { useState, useEffect } from "react";

// ---------- Lógica de prioridad (igual a tu script.js) ----------
function calcularPrioridad(p) {
  if (p.signosAlarma || p.dolor >= 8) return "urgente";
  if (p.inmunodeprimido || p.dolor >= 4) return "moderado";
  return "leve";
}

const ORDEN = { urgente: 1, moderado: 2, leve: 3 };

// ---------- Componente: una tarjeta de paciente ----------
function TarjetaPaciente({ p, onAtender, onEliminar }) {
  const claseEstado = p.estado === "atendido" ? "atendido-style" : p.prioridad;

  return (
    <div className={`paciente ${claseEstado}`}>
      <div className="p-info">
        <strong style={{ fontSize: "1.2rem" }}>{p.nombre.toUpperCase()}</strong>
        <span style={{ color: "var(--accent)", marginLeft: 10 }}>{p.edad} años</span>

        <p style={{ marginTop: 8, fontSize: "0.95rem", color: "#fff" }}>
          <strong>Ingreso:</strong> {p.sintomas || "Sin datos"}
        </p>

        {p.area && (
          <div
            style={{
              marginTop: 10,
              padding: 12,
              background: "rgba(47,129,247,0.1)",
              borderRadius: 8,
              borderLeft: "3px solid var(--accent)",
            }}
          >
            <span style={{ display: "block", fontSize: "0.75rem", color: "var(--accent)", fontWeight: 800 }}>
              ⬆️ PASE A: {p.area.toUpperCase()}
            </span>
            <p style={{ fontSize: "0.85rem", color: "#8b949e", marginTop: 4 }}>
              <em>"{p.motivo || "Sin motivo especificado"}"</em>
            </p>
          </div>
        )}

        <div style={{ marginTop: 12, fontSize: "0.7rem", color: "#555", fontWeight: "bold" }}>
          HORA REPORTE: {new Date(p.id).toLocaleTimeString()}
        </div>
      </div>

      <div className="p-actions">
        {p.estado === "espera" ? (
          <button className="btn-atender" onClick={() => onAtender(p.id)}>ATENDER</button>
        ) : (
          <button className="btn-eliminar" onClick={() => onEliminar(p.id)}>FINALIZAR</button>
        )}
      </div>
    </div>
  );
}

// ---------- Componente principal ----------
export default function TriageApp() {
  // useState reemplaza a "let pacientes" + localStorage manual
  const [pacientes, setPacientes] = useState(() => {
    return JSON.parse(localStorage.getItem("db_triage_v7")) || [];
  });

  const [busqueda, setBusqueda] = useState("");
  const [hora, setHora] = useState(new Date().toLocaleTimeString());

  // Campos del formulario (antes leías cada input a mano con getElementById)
  const [form, setForm] = useState({
    nombre: "", edad: "", dolor: 0,
    signosAlarma: false, inmunodeprimido: false,
    area: "", sintomas: "", motivo: "",
  });

  // useEffect reemplaza al "guardar en localStorage" que hacías en save()
  useEffect(() => {
    localStorage.setItem("db_triage_v7", JSON.stringify(pacientes));
  }, [pacientes]);

  // useEffect reemplaza al setInterval del reloj
  useEffect(() => {
    const id = setInterval(() => setHora(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(id);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const nuevo = {
      id: Date.now(),
      nombre: form.nombre.trim(),
      edad: parseInt(form.edad),
      dolor: parseInt(form.dolor),
      signosAlarma: form.signosAlarma,
      inmunodeprimido: form.inmunodeprimido,
      area: form.area.trim(),
      sintomas: form.sintomas.trim(),
      motivo: form.motivo.trim(),
      estado: "espera",
    };
    nuevo.prioridad = calcularPrioridad(nuevo);

    setPacientes([...pacientes, nuevo]); // antes: pacientes.push(p)
    setForm({ nombre: "", edad: "", dolor: 0, signosAlarma: false, inmunodeprimido: false, area: "", sintomas: "", motivo: "" });
  }

  function marcarAtendido(id) {
    setPacientes(pacientes.map(p => p.id === id ? { ...p, estado: "atendido" } : p));
  }

  function eliminarPaciente(id) {
    if (confirm("¿Archivar ficha definitivamente?")) {
      setPacientes(pacientes.filter(p => p.id !== id));
    }
  }

  // Mismo filtro + orden que tu render() original
  const filtrados = pacientes
    .filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => {
      if (a.estado !== b.estado) return a.estado === "atendido" ? 1 : -1;
      return ORDEN[a.prioridad] - ORDEN[b.prioridad];
    });

  const enEspera = pacientes.filter(p => p.estado === "espera").length;
  const colorDolor = form.dolor >= 8 ? "#f85149" : form.dolor >= 4 ? "#d29922" : "#2f81f7";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">MED-TECH<span>PRO</span></div>
        <nav>
          <div className="nav-item active">Guardia Activa</div>
          <div className="nav-item" onClick={() => window.print()}>Imprimir Reporte</div>
        </nav>
        <div className="stats-container">
          <div className="stat-card">En espera: <span>{enEspera}</span></div>
        </div>
      </aside>

      <main className="content">
        <header className="top-bar glass-effect">
          <div className="buscador-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
          <div className="system-time JetBrains-Mono">{hora}</div>
        </header>

        <div className="grid-layout">
          <section className="form-section">
            <form className="card form-card" onSubmit={handleSubmit}>
              <h3>Registro de Ingreso</h3>

              <div className="input-row">
                <input type="text" placeholder="Nombre Completo" required
                  value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                <input type="number" placeholder="Edad" required
                  value={form.edad} onChange={e => setForm({ ...form, edad: e.target.value })} />
              </div>

              <div className="clinical-input">
                <label>Dolor (EVA): <span style={{ background: colorDolor }}>{form.dolor}</span></label>
                <input type="range" min="0" max="10"
                  value={form.dolor} onChange={e => setForm({ ...form, dolor: e.target.value })} />
              </div>

              <div className="check-grid">
                <label className="custom-check">
                  <input type="checkbox" checked={form.signosAlarma}
                    onChange={e => setForm({ ...form, signosAlarma: e.target.checked })} />
                  <span className="checkmark"></span> Signos de Alarma
                </label>
                <label className="custom-check">
                  <input type="checkbox" checked={form.inmunodeprimido}
                    onChange={e => setForm({ ...form, inmunodeprimido: e.target.checked })} />
                  <span className="checkmark"></span> Inmuno/Oncológico
                </label>
              </div>

              <div className="input-row">
                <input type="text" placeholder="Área de Pase (Ej: Internación, UTI, Rayos)"
                  value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
              </div>

              <textarea placeholder="Observaciones en ingreso (clínica inicial)..."
                value={form.sintomas} onChange={e => setForm({ ...form, sintomas: e.target.value })} />
              <textarea placeholder="Motivo del pase / derivación..." style={{ marginTop: 10, borderColor: "rgba(47,129,247,0.3)" }}
                value={form.motivo} onChange={e => setForm({ ...form, motivo: e.target.value })} />

              <button type="submit" className="btn-primary">CLASIFICAR E INGRESAR</button>
            </form>
          </section>

          <section className="list-section">
            <div className="list-header card glass-effect">
              <h3>Prioridad de Atención <span className="dynamic-badge">Dinámica</span></h3>
            </div>
            <div className="clinical-list">
              {filtrados.map(p => (
                <TarjetaPaciente key={p.id} p={p} onAtender={marcarAtendido} onEliminar={eliminarPaciente} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
