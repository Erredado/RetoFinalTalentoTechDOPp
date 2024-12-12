document.addEventListener('DOMContentLoaded', function() {
    cargarProductosDestacados();
});

function cargarProductosDestacados() {
    const productosDestacados = [
        { id: 1, nombre: "Arequipe", precio: 15000, imagen: "img/productos/arequipe.jpg" },
        { id: 2, nombre: "Bocadillo Veleño", precio: 10000, imagen: "img/productos/bocadillo.jpg" },
        { id: 3, nombre: "Cocadas", precio: 12000, imagen: "img/productos/cocadas.jpg" },
        { id: 4, nombre: "Manjar Blanco", precio: 18000, imagen: "img/productos/manjar-blanco.jpg" }
    ];

    const contenedor = document.getElementById('productos-destacados');
    if (!contenedor) return;

    let html = '';
    productosDestacados.forEach(producto => {
        html += `
            <div class="col-md-3 mb-4">
                <div class="card h-100">
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">$${producto.precio.toLocaleString()}</p>
                        <button class="btn btn-primary mt-auto agregar-carrito" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}">Agregar al carrito</button>
                    </div>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = html;

    document.querySelectorAll('.agregar-carrito').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const nombre = e.target.getAttribute('data-nombre');
            const precio = parseFloat(e.target.getAttribute('data-precio'));
            agregarAlCarrito(id, nombre, precio);
        });
    });
}

