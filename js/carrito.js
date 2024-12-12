let carrito = [];

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarritoUI();
    }
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarCarritoUI() {
    const carritoContenido = document.getElementById('carrito-contenido');
    const carritoContador = document.getElementById('carrito-contador');
    const carritoTotal = document.getElementById('carrito-total');

    if (carritoContenido) {
        carritoContenido.innerHTML = '';
        let total = 0;

        if (carrito.length === 0) {
            carritoContenido.innerHTML = '<p class="text-center">Tu carrito está vacío</p>';
        } else {
            const tabla = document.createElement('div');
            tabla.className = 'table-responsive';
            tabla.innerHTML = `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            `;

            carrito.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.nombre}</td>
                    <td>$${item.precio.toLocaleString()}</td>
                    <td>
                        <button class="btn btn-sm btn-secondary me-2" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                        ${item.cantidad}
                        <button class="btn btn-sm btn-secondary ms-2" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                    </td>
                    <td>$${(item.precio * item.cantidad).toLocaleString()}</td>
                    <td><button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${item.id})">Eliminar</button></td>
                `;
                tabla.querySelector('tbody').appendChild(tr);
                total += item.precio * item.cantidad;
            });

            carritoContenido.appendChild(tabla);
        }

        if (carritoTotal) {
            carritoTotal.textContent = total.toLocaleString();
        }
    }

    if (carritoContador) {
        carritoContador.textContent = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    }
}

function obtenerProductoPorId(id) {
    return window.todosLosProductos.find(producto => producto.id === id);
}

function obtenerCantidadEnCarrito(id) {
    const item = carrito.find(i => i.id === id);
    return item ? item.cantidad : 0;
}

function agregarAlCarrito(id, nombre, precio) {
    const producto = obtenerProductoPorId(id);
    if (!producto) {
        console.error('Producto no encontrado');
        return;
    }

    const cantidadEnCarrito = obtenerCantidadEnCarrito(id);
    if (cantidadEnCarrito > 0) {
        alert('Este producto ya está en tu carrito. Puedes modificar la cantidad en la página del carrito.');
        return;
    }

    const stockDisponible = producto.stock - cantidadEnCarrito;

    if (stockDisponible <= 0) {
        alert('Lo sentimos, no hay más stock disponible para este producto.');
        return;
    }

    carrito.push({ id, nombre, precio, cantidad: 1 });
    producto.stock--;

    guardarCarrito();
    window.guardarProductos();
    actualizarCarritoUI();
    window.actualizarStockUI(id, stockDisponible - 1);
}

function eliminarDelCarrito(id) {
    const itemIndex = carrito.findIndex(i => i.id === id);
    if (itemIndex !== -1) {
        const item = carrito[itemIndex];
        const producto = obtenerProductoPorId(id);
        if (producto) {
            producto.stock += item.cantidad;
            window.actualizarStockUI(id, producto.stock);
        }
        carrito.splice(itemIndex, 1);
        guardarCarrito();
        window.guardarProductos();
        actualizarCarritoUI();
    }
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find(i => i.id === id);
    if (item) {
        const producto = obtenerProductoPorId(id);
        if (!producto) {
            console.error('Producto no encontrado');
            return;
        }

        const nuevoStock = producto.stock - cambio;
        if (nuevoStock >= 0 && item.cantidad + cambio > 0) {
            item.cantidad += cambio;
            producto.stock = nuevoStock;
            guardarCarrito();
            window.guardarProductos();
            actualizarCarritoUI();
            window.actualizarStockUI(id, nuevoStock);
        } else {
            alert('No se puede realizar esta acción debido al stock disponible.');
        }
    }
}

function vaciarCarrito() {
    carrito.forEach(item => {
        const producto = obtenerProductoPorId(item.id);
        if (producto) {
            producto.stock += item.cantidad;
            window.actualizarStockUI(item.id, producto.stock);
        }
    });
    carrito = [];
    guardarCarrito();
    window.guardarProductos();
    actualizarCarritoUI();
}

document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();

    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    if (vaciarCarritoBtn) {
        vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
    }

    const finalizarCompraBtn = document.getElementById('finalizar-compra');
    if (finalizarCompraBtn) {
        finalizarCompraBtn.addEventListener('click', () => {
            if (carrito.length === 0) {
                alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
            } else {
                alert('¡Gracias por tu compra! En un mundo real, aquí te llevaríamos a la página de pago.');
                vaciarCarrito();
            }
        });
    }
});

window.agregarAlCarrito = agregarAlCarrito;
window.eliminarDelCarrito = eliminarDelCarrito;
window.cambiarCantidad = cambiarCantidad;
window.vaciarCarrito = vaciarCarrito;

