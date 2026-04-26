let cart = [];
let total = 0;

// SISTEMA DE INTERFAZ
function toggleCart(show) {
    const sidebar = document.getElementById('carrito-sidebar');
    const overlay = document.getElementById('blur-bg');
    
    if(show) {
        sidebar.classList.add('activo');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    } else {
        sidebar.classList.remove('activo');
        overlay.classList.remove('visible');
        document.body.style.overflow = 'auto';
    }
}

// AGREGAR CON LÓGICA DE INSUMOS
function addItem(name, price, suggestion) {
    cart.push({ name, price, suggestion });
    total += price;
    updateUI();
    toggleCart(true);
}

function removeItem(index) {
    total -= cart[index].price;
    cart.splice(index, 1);
    updateUI();
}

function updateUI() {
    const countSpan = document.getElementById('count');
    const totalSpan = document.getElementById('total-val');
    const listContainer = document.getElementById('lista-items');

    countSpan.innerText = cart.length;
    totalSpan.innerText = `$${total.toLocaleString()}`;
    
    listContainer.innerHTML = ''; 

    if (cart.length === 0) {
        listContainer.innerHTML = '<p style="text-align:center; color:#555; margin-top:40px;">No se han seleccionado equipos para cotizar.</p>';
        return;
    }

    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'item-row';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                    <h4 style="font-size:16px; margin-bottom:4px;">${item.name}</h4>
                    <p style="color:#238636; font-size:11px; font-weight:700;">+ INCLUYE: ${item.suggestion}</p>
                </div>
                <div style="text-align:right;">
                    <p style="color:var(--celeste); font-weight:800;">$${item.price.toLocaleString()}</p>
                    <button onclick="removeItem(${index})" style="background:none; border:none; color:#555; cursor:pointer; font-size:12px; margin-top:8px;">Eliminar</button>
                </div>
            </div>
        `;
        listContainer.appendChild(div);
    });
}

// SIMULACIÓN DE CIERRE DE NEGOCIO
function checkout() {
    if(cart.length === 0) return alert("Seleccione al menos un equipo para generar el presupuesto.");
    
    const confirmacion = confirm(`Se generará un presupuesto por $${total.toLocaleString()}. ¿Desea proceder con el envío a Dirección Médica?`);
    
    if(confirmacion) {
        alert("📊 Generando PDF de Cotización...\n\nLa solicitud ha sido enviada al sistema de Medical Tech Pro. Un asesor asignado lo contactará en breve.");
        cart = [];
        total = 0;
        updateUI();
        toggleCart(false);
    }
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-abrir-cart').onclick = () => toggleCart(true);
    document.getElementById('btn-cerrar-cart').onclick = () => toggleCart(false);
    document.getElementById('blur-bg').onclick = () => toggleCart(false);

    const form = document.getElementById('formPresupuesto');
    if(form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            alert("✅ Solicitud recibida. Nuestro departamento técnico analizará su requerimiento.");
            form.reset();
        };
    }
});