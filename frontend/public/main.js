// Obtener el modal, botón y cerrar modal
var modal = document.getElementById("modal");
var btn = document.getElementById("mostrarProyectoBtn");
var span = document.getElementById("close");

// Mostrar el modal cuando se haga clic en el botón
btn.onclick = function() {
    modal.style.display = "block";
    obtenerProyectoDetalles(); // Llamar a la función para obtener los detalles del proyecto
}

// Cerrar el modal cuando se haga clic en el 'x'
span.onclick = function() {
    modal.style.display = "none";
}

// Cerrar el modal si el usuario hace clic fuera del modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Función para obtener los detalles del proyecto (esto es solo un ejemplo)
async function obtenerProyectoDetalles() {
    const idProyecto = "id-del-proyecto"; // Aquí obtendrás el ID del proyecto de alguna forma

    // Aquí realizas la solicitud a tu backend para obtener los detalles del proyecto
    try {
        const response = await fetch(`http://localhost:5000/api/proyectos/${idProyecto}`);
        const proyecto = await response.json();
        
        // Aquí es donde se actualizan los detalles del proyecto en el modal
        const proyectoDetalles = document.getElementById("proyectoDetalles");
        proyectoDetalles.innerHTML = `
            <p><strong>Nombre:</strong> ${proyecto.nombre}</p>
            <p><strong>Descripción:</strong> ${proyecto.descripcion}</p>
            <p><strong>Fecha de inicio:</strong> ${proyecto.fechaInicio}</p>
            <p><strong>Fecha de fin:</strong> ${proyecto.fechaFin}</p>
        `;
    } catch (error) {
        console.error("Error al obtener los detalles del proyecto:", error);
    }
}
