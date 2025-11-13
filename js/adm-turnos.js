const formTurno = document.getElementById("formTurno");
const tablaTurnosBody = document.querySelector("#tablaReservas tbody"); 

function cargarComboMedicos() {
    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    const medicoSel = document.getElementById("medicoId");
    medicoSel.innerHTML = '<option value="" disabled selected>Seleccione un Médico...</option>' + medicos.map(m => 
        `<option value="${m.id}">${m.apellido}, ${m.nombre}</option>`
    ).join("");
}

function generarTurnos(medicoId, fecha, horaInicio, horaFin, intervaloMinutos) {
    const turnosGenerados = [];
    let [hInicio, mInicio] = horaInicio.split(':').map(Number);
    let [hFin, mFin] = horaFin.split(':').map(Number);

    let fechaHoraActual = new Date(`${fecha}T${horaInicio}:00`);
    const fechaFin = new Date(`${fecha}T${horaFin}:00`);

    if (fechaHoraActual >= fechaFin) {
        alert("La hora de inicio debe ser anterior a la hora de fin.");
        return [];
    }
    
    while (fechaHoraActual < fechaFin) {
        const fechaHoraStr = fechaHoraActual.toISOString().substring(0, 16);

        turnosGenerados.push({
            medicoId: Number(medicoId),
            fechaHora: fechaHoraStr,
            disponible: true 
        });

        fechaHoraActual.setMinutes(fechaHoraActual.getMinutes() + intervaloMinutos);
    }
    
    return turnosGenerados;
}


function guardarTurno(e) {
    e.preventDefault();
    let turnos = JSON.parse(localStorage.getItem("turnos")) || [];
    
    const medicoId = document.getElementById("medicoId").value;
    const fecha = document.getElementById("fecha").value;
    const horaInicio = document.getElementById("horaInicio").value;
    const horaFin = document.getElementById("horaFin").value;
    const intervalo = Number(document.getElementById("intervalo").value);

    const inicioTurnos = new Date(`${fecha}T${horaInicio}:00`); 

    const ahora = new Date();

    if (inicioTurnos.getTime() < ahora.getTime()) {
        alert("No se pueden generar turnos en el pasado. Verifique la Fecha y Hora de Inicio.");
        return;
    }

    if (!medicoId || !fecha || !horaInicio || !horaFin || !intervalo) {
        alert("Por favor, complete todos los campos para generar los turnos.");
        return;
    }
    
    const nuevosTurnos = generarTurnos(medicoId, fecha, horaInicio, horaFin, intervalo);

    if (nuevosTurnos.length === 0) {
        return; 
    }
    
    let maxId = turnos.reduce((max, t) => Math.max(max, Number(t.id)), 0);
    
    nuevosTurnos.forEach(t => {
        maxId += 1;
        t.id = maxId; 
        turnos.push(t);
    });

    localStorage.setItem("turnos", JSON.stringify(turnos));
    formTurno.reset();
    actualizarTablaTurnos();
    alert(`Se generaron y guardaron ${nuevosTurnos.length} turnos para el médico ${medicoId} el día ${fecha}.`);
}


function editarTurno(i) {
    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
    const t = turnos[i];
    
    if (!t.disponible) {
        alert("No se puede editar un turno reservado. Debe cancelarse la reserva primero.");
        return;
    }
    
    alert("La edición individual de turnos está deshabilitada tras la refactorización para generación en lote. Por favor, elimine y regenere el turno si es necesario. Puede eliminar si NO está reservado.");

}


function actualizarTablaTurnos() {
    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

    if (!tablaTurnosBody) {
        console.error("No se encontró el cuerpo de la tabla de turnos.");
        return;
    }

    tablaTurnosBody.innerHTML = turnos.map((t, i) => {
        const medico = medicos.find(m => m.id == t.medicoId);
        const nombreMedico = medico ? `${medico.apellido}, ${medico.nombre}` : 'Médico Desconocido';
        
        let estado = 'Disponible';
        let estadoClase = 'text-success';
        let pacienteInfo = ''; 
        let disabledEdit = ''; 

        if (t.disponible === false) { 
            const reserva = reservas.find(r => r.turnoId == t.id); 
            if (reserva) {
                estado = `Reservado`;
                estadoClase = 'text-danger';
                pacienteInfo = `<br>(${reserva.apellidoNombre}, Doc: ${reserva.documento})`; 
            }
            disabledEdit = 'disabled';
        }

        const [fecha, hora] = t.fechaHora.split('T');
        const fechaFormateada = fecha.split('-').reverse().join('/'); 
        
        return `
            <tr>
                <td>${t.id}</td>
                <td>${nombreMedico}</td>
                <td>${fechaFormateada} ${hora}${pacienteInfo}</td> 
                <td class="${estadoClase}">${estado}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-2" onclick="editarTurno(${i})" ${disabledEdit}>Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarTurno(${i})" ${disabledEdit}>Eliminar</button>
                </td>
            </tr>
        `;
    }).join("");
}

function eliminarTurno(i) {
    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
    
    if (!turnos[i]) {
        alert("El turno seleccionado no existe.");
        return;
    }

    if (!turnos[i].disponible) {
        alert("No se puede eliminar un turno que ya está reservado.");
        return;
    }
    
    const t = turnos[i];
    if (confirm(`¿Eliminar el turno ID ${t.id} del médico ${t.medicoId} en ${t.fechaHora}?`)) {
        turnos.splice(i, 1);
        localStorage.setItem("turnos", JSON.stringify(turnos));
        actualizarTablaTurnos();
    }
}


formTurno.addEventListener("submit", guardarTurno);
cargarComboMedicos();
actualizarTablaTurnos();