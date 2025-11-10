document.addEventListener('DOMContentLoaded', () => {
    mostrarTurnos();
});

function mostrarTurnos() {
    const turnos = JSON.parse(localStorage.getItem('turnos')) || [];
    const tabla = document.getElementById('listaTurnos');
    
    if (turnos.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No hay turnos registrados</td>
            </tr>
        `;
        return;
    }

    tabla.innerHTML = turnos.map((turno, index) => `
        <tr>
            <td>${turno.paciente}</td>
            <td>${turno.medico}</td>
            <td>${formatearFecha(turno.fecha)}</td>
            <td>${turno.hora}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="cancelarTurno(${index})">
                    Cancelar
                </button>
            </td>
        </tr>
    `).join('');
}

function cancelarTurno(index) {
    if (confirm('¿Está seguro de cancelar este turno?')) {
        const turnos = JSON.parse(localStorage.getItem('turnos')) || [];
        turnos.splice(index, 1);
        localStorage.setItem('turnos', JSON.stringify(turnos));
        mostrarTurnos();
    }
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-AR');
}
