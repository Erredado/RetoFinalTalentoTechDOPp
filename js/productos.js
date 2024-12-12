window.todosLosProductos = [
    { id: 1, nombre: "Arequipe", precio: 15000, imagen: "img/productos/arequipe.jpg", categoria: "Arequipes y Caramelos", stock: 50 },
    { id: 2, nombre: "Bocadillo Veleño", precio: 10000, imagen: "img/productos/bocadillo.jpg", categoria: "Dulces Regionales", stock: 100 },
    { id: 3, nombre: "Cocadas", precio: 12000, imagen: "img/productos/cocadas.jpg", categoria: "Dulces Regionales", stock: 75 },
    { id: 4, nombre: "Manjar Blanco", precio: 18000, imagen: "img/productos/manjar-blanco.jpg", categoria: "Postres Tradicionales", stock: 30 },
    { id: 5, nombre: "Brevas en Almíbar", precio: 20000, imagen: "img/productos/brevas-almibar.jpg", categoria: "Frutas en Almíbar", stock: 40 },
    { id: 6, nombre: "Dulce de Papayuela", precio: 16000, imagen: "img/productos/dulce-papayuela.jpg", categoria: "Frutas en Almíbar", stock: 25 },
    { id: 7, nombre: "Panelitas de Leche", precio: 8000, imagen: "img/productos/panelitas.jpg", categoria: "Arequipes y Caramelos", stock: 80 },
    { id: 8, nombre: "Postre de Natas", precio: 22000, imagen: "img/productos/postre-natas.jpg", categoria: "Postres Tradicionales", stock: 20 }
];

function guardarProductos() {
    localStorage.setItem('productos', JSON.stringify(window.todosLosProductos));
}

function cargarProductos() {
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
        window.todosLosProductos = JSON.parse(productosGuardados);
    } else {
        guardarProductos();
    }
}

function obtenerCantidadEnCarrito(id) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const item = carrito.find(i => i.id === id);
    return item ? item.cantidad : 0;
}

function actualizarProductosUI(productos = window.todosLosProductos) {
    const contenedor = document.getElementById('lista-productos');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    productos.forEach(producto => {
        const cantidadEnCarrito = obtenerCantidadEnCarrito(producto.id);
        const stockDisponible = producto.stock - cantidadEnCarrito;
        
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card h-100 producto-card">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">Precio: $${producto.precio.toLocaleString()}</p>
                    <p class="card-text"><small class="text-muted">${producto.categoria}</small></p>
                    <p class="card-text">Stock disponible: <span class="stock-${producto.id}">${stockDisponible}</span></p>
                    <button class="btn btn-primary mt-auto agregar-carrito" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}" ${cantidadEnCarrito > 0 || stockDisponible <= 0 ? 'disabled' : ''}>
                        ${cantidadEnCarrito > 0 ? 'En el carrito' : (stockDisponible <= 0 ? 'Agotado' : 'Agregar al carrito')}
                    </button>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });

    // Añadir event listeners a los botones de "Agregar al carrito"
    document.querySelectorAll('.agregar-carrito').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const nombre = e.target.getAttribute('data-nombre');
            const precio = parseFloat(e.target.getAttribute('data-precio'));
            window.agregarAlCarrito(id, nombre, precio);
        });
    });
}

function actualizarStockUI(id, nuevoStock) {
    const stockElement = document.querySelector(`.stock-${id}`);
    const botonAgregar = document.querySelector(`button[data-id="${id}"]`);
    
    if (stockElement) {
        stockElement.textContent = nuevoStock;
    }
    
    if (botonAgregar) {
        const cantidadEnCarrito = obtenerCantidadEnCarrito(id);
        if (cantidadEnCarrito > 0) {
            botonAgregar.disabled = true;
            botonAgregar.textContent = 'En el carrito';
        } else if (nuevoStock > 0) {
            botonAgregar.disabled = false;
            botonAgregar.textContent = 'Agregar al carrito';
        } else {
            botonAgregar.disabled = true;
            botonAgregar.textContent = 'Agotado';
        }
    }
}

function filtrarProductos() {
    const categoria = document.getElementById('categoria-filtro').value;
    const busqueda = document.getElementById('busqueda').value.toLowerCase();

    const productosFiltrados = window.todosLosProductos.filter(producto => {
        const coincideCategoria = categoria === '' || producto.categoria === categoria;
        const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda);
        return coincideCategoria && coincideBusqueda;
    });

    actualizarProductosUI(productosFiltrados);
}

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    actualizarProductosUI();

    const categoriaFiltro = document.getElementById('categoria-filtro');
    const busquedaInput = document.getElementById('busqueda');

    if (categoriaFiltro) {
        categoriaFiltro.addEventListener('change', filtrarProductos);
    }

    if (busquedaInput) {
        busquedaInput.addEventListener('input', filtrarProductos);
    }
});

window.actualizarStockUI = actualizarStockUI;
window.guardarProductos = guardarProductos;

