document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos desde el backend
    fetch('http://localhost:3000/productos')
        .then(response => response.json())
        .then(data => {
            const productosContainer = document.getElementById('productos');
            productosContainer.innerHTML = ''; // Limpiar contenedor
            data.forEach(producto => {
                const productoHTML = `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <img src="${producto.image}" class="card-img-top" alt="${producto.title}">
                            <div class="card-body">
                                <h5 class="card-title">${producto.title}</h5>
                                <p class="card-text">${producto.description}</p>
                                <p class="card-text"><strong>$${producto.price.toFixed(2)}</strong></p>
                                <a href="#" class="btn btn-primary">Agregar al carrito</a>
                            </div>
                        </div>
                    </div>
                `;
                productosContainer.innerHTML += productoHTML;
            });
        })
        .catch(error => console.error('Error al cargar los productos:', error));
});


    // Manejo del formulario de registro
    const registroForm = document.getElementById('registroForm');
    if (registroForm) {
        registroForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Enviar datos del formulario al servidor
            fetch('/api/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, email, password }),
            })
            .then(response => response.json())
            .then(data => {
                alert(`Registro exitoso. ID del usuario: ${data.id}`);
                // Cerrar el modal después de enviar el formulario
                const modal = bootstrap.Modal.getInstance(document.getElementById('registroModal'));
                modal.hide();
            })
            .catch(error => console.error('Error al registrar usuario:', error));
        });
    }

    // Mostrar el modal al hacer clic en el botón de registro
    const registroBtn = document.getElementById('registroBtn');
    if (registroBtn) {
        registroBtn.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('registroModal'));
            modal.show();
        });
    }
});

function verProducto(id) {
    fetch(`https://fakestoreapi.com/products/${id}`)
        .then(response => response.json())
        .then(producto => {
            alert(`Detalles del producto:\nTítulo: ${producto.title}\nDescripción: ${producto.description}\nPrecio: $${producto.price.toFixed(2)}`);
        })
        .catch(error => console.error('Error al obtener el producto:', error));
}
