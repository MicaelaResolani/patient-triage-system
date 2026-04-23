# 🏥 Triage Inteligente

Sistema web de triage clínico desarrollado como proyecto personal, enfocado en la gestión de pacientes en entornos de atención primaria o guardia.

El objetivo es simular la toma de decisiones médicas básicas y la priorización de pacientes según criterios clínicos simples.

---

## 🚀 Funcionalidades

- 🧍 Registro de pacientes
- ⚠️ Clasificación automática de prioridad:
  - 🔴 Urgente
  - 🟡 Moderado
  - 🟢 Leve
- ⏱️ Seguimiento del tiempo de espera
- ✔️ Marcar paciente como atendido
- 📤 Derivar pacientes con:
  - destino
  - motivo clínico
- 🗑️ Eliminación de pacientes (solo atendidos)
- 🔍 Búsqueda por nombre
- 💾 Persistencia de datos con LocalStorage

---

## 🧠 Lógica de priorización

La prioridad se calcula automáticamente según:

- Signos de alarma → **Urgente**
- Dolor ≥ 8 → **Urgente**
- Inmunodeprimido → **Moderado**
- Dolor ≥ 4 → **Moderado**
- Caso contrario → **Leve**

---

## 🏗️ Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- LocalStorage

---

## 🎯 Objetivo del proyecto

Este proyecto busca:

- Aplicar lógica de negocio inspirada en sistemas de salud reales
- Simular flujos clínicos básicos (espera → atención → derivación)
- Practicar manipulación del DOM y manejo de estados
- Construir una base para futuros sistemas más complejos (FHIR, APIs, etc.)

---

## 🧩 Posibles mejoras

- Integración con APIs (HL7 / FHIR)
- Backend con base de datos real
- Autenticación de usuarios (profesionales de salud)
- Dashboard avanzado tipo hospital
- Exportación de datos clínicos

---

## 📸 Demo

*(Podés agregar acá una captura o link a GitHub Pages)*

---

## 👩‍💻 Autor

Desarrollado por Micaela Resolani  
Estudiante de Enfermería + Desarrollo

---

## 💡 Nota

Este sistema es una simulación educativa y no debe ser utilizado en entornos clínicos reales.