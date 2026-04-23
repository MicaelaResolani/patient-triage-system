# 🩺 MED-TECH PRO | Sistema de Triage Inteligente

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![JS Vanilla](https://img.shields.io/badge/JavaScript-Vanilla-yellow.svg)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Modern-blue.svg)](https://developer.mozilla.org/es/docs/Web/CSS)

> **MVP (Producto Mínimo Viable)** diseñado para optimizar el flujo de pacientes en guardias de emergencia. Un puente estratégico entre la gestión de datos clínicos y el desarrollo frontend profesional.

### 🚀 [Ver Demo en Vivo](https://micaelaresolani.github.io/patient-triage-system/)

---

## 📖 Descripción y Visión
Este proyecto nace de la intersección entre mi formación en **Enfermería** y mi camino como **Desarrolladora Frontend**. Detecté que muchas interfaces de triage actuales fallan en la usabilidad bajo presión; por eso, diseñé una herramienta que aplica una **lógica de priorización ponderada** basada en estándares reales como el Proceso de Atención de Enfermería (PAE).

El sistema no solo registra datos, sino que asiste al profesional en la toma de decisiones críticas mediante una jerarquía visual clara y automatizada.

---

## ✨ Características de Alto Impacto
* **Algoritmo de Priorización**: Clasificación automática (Urgente, Moderado, Leve) evaluando la escala EVA, signos de alarma y antecedentes oncológicos en tiempo real.
* **Gestión de Ciclo de Vida**: Flujo completo del paciente: Ingreso ➡️ Clasificación ➡️ Atención ➡️ Egreso/Derivación.
* **UX de Grado Médico**: Interfaz en modo oscuro diseñada para reducir la fatiga visual y alertas dinámicas para pacientes con tiempo de espera excedido.
* **Persistencia Robusta**: Implementación de `LocalStorage` para garantizar la integridad de los datos ante cierres inesperados del navegador.

---

## 🛠️ Stack Tecnológico
* **HTML5 Semántico**: Estructura accesible y optimizada para la organización de datos.
* **CSS3 Moderno**: Arquitectura basada en **CSS Grid** y **Flexbox** para un layout responsivo de nivel profesional que evita la superposición de elementos en pantallas críticas.
* **JavaScript (ES6+)**: Lógica pura, manejo de arrays, filtrado dinámico y manipulación avanzada del DOM.

---

## 🧠 Desafíos Técnicos Resueltos
* **Normalización de Búsqueda**: Implementación de lógica *case-insensitive* para asegurar que la localización de pacientes sea infalible en entornos de alto estrés.
* **Arquitectura Escalable**: Código organizado de manera modular, facilitando una futura migración a **React**.
* **Jerarquía de Prioridades**: Algoritmo de ordenamiento que asegura que los pacientes críticos siempre encabecen la lista de atención de forma dinámica.

---

## 📈 Roadmap (Próximas Actualizaciones)
- [ ] **Migración a React**: Refactorización de componentes para mejorar la escalabilidad y el estado global.
- [ ] **Módulo de Alertas Sonoras**: Notificaciones auditivas para pacientes que superen el tiempo de espera crítico.
- [ ] **Exportación PDF**: Generación de fichas clínicas de atención listas para impresión o archivo legal.

---

## 👩‍💻 Sobre la Autora
**Micaela Resolani** — Combinando la precisión de la **Enfermería** con la innovación del **Desarrollo Frontend**. Mi objetivo es construir herramientas tecnológicas que optimicen el sistema de salud y mejoren la experiencia tanto del paciente como del profesional.

---

## 💡 Nota Importante
Este sistema es una simulación con fines educativos y de demostración técnica. No debe ser utilizado para la toma de decisiones en entornos clínicos reales sin la debida certificación y validación médica.
