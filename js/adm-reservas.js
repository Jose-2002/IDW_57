const tablaReservasBody = document.querySelector("#tablaReservas tbody");

function actualizarTablaReservas() {
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    const especialidades = JSON.parse(localStorage.getItem("especialidades")) || [];
    const obrasSociales = JSON.parse(localStorage.getItem("obrasSociales")) || [];
    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];

    if (reservas.length === 0) {
        tablaReservasBody.innerHTML = '<tr><td colspan="8" class="text-center">No hay reservas registradas.</td></tr>';
        return;
    }

    tablaReservasBody.innerHTML = reservas.map((r, i) => {
        const turno = turnos.find(t => t.id == r.turnoId);
        const medico = medicos.find(m => m.id == r.medicoId);
        const especialidad = especialidades.find(e => e.id == r.especialidadId);
        const obraSocial = obrasSociales.find(o => o.id == r.obraSocialId);

        const fechaHora = turno ? turno.fechaHora : 'N/A';
        const nombreMedico = medico ? `${medico.apellido}, ${medico.nombre}` : 'N/A';
        const nombreEspecialidad = especialidad ? especialidad.nombre : 'N/A';
        const nombreOS = obraSocial ? obraSocial.nombre : 'Particular';

        const posiblesValores = [
            r.valorTotal,
            r.valor,
            r.total,
            r.precio,
            turno && (turno.valorTotal || turno.precio || turno.valor),
            especialidad && (especialidad.precio || especialidad.valor)
        ];

        let valor = posiblesValores.find(v => v !== undefined && v !== null);
        valor = (valor !== undefined && valor !== null) ? Number(valor) : 0;

        if (Number.isNaN(valor)) valor = 0;

        const valorFormateado = valor.toFixed(2);

        return `
            <tr>
                <td>${r.id}</td>
                <td>${fechaHora}</td>
                <td>${nombreMedico}</td>
                <td>${r.apellidoNombre || 'N/D'} (${r.documento || 'N/D'})</td>
                <td>${nombreEspecialidad}</td>
                <td>${nombreOS}</td>
                <td>$${valorFormateado}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="cancelarReserva(${i})">Cancelar</button>
                </td>
            </tr>
        `;
    }).join("");
}

function cancelarReserva(index) {
    let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    let turnos = JSON.parse(localStorage.getItem("turnos")) || [];
    const reservaACancelar = reservas[index];

    if (!reservaACancelar) {
        alert("Reserva no encontrada.");
        return;
    }

    if (!confirm(`¿Está seguro de cancelar la reserva ID ${reservaACancelar.id} de ${reservaACancelar.apellidoNombre}? Esto liberará el turno.`)) {
        return;
    }

    const turnoIndex = turnos.findIndex(t => t.id == reservaACancelar.turnoId);
    if (turnoIndex !== -1) {
        turnos[turnoIndex].disponible = true;
        localStorage.setItem("turnos", JSON.stringify(turnos));
    }

    reservas.splice(index, 1);
    localStorage.setItem("reservas", JSON.stringify(reservas));

    actualizarTablaReservas();
    alert(`Reserva ${reservaACancelar.id} cancelada y Turno liberado.`);
}

actualizarTablaReservas();
