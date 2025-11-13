// Elementos del DOM
const formReserva = document.getElementById('formReserva');
const fechaInput = document.getElementById('fechaSeleccionada');
const listaTurnosDiv = document.getElementById('listaTurnos');
const resumenCostoSpan = document.getElementById('resumen-costo');
const btnConfirmar = document.getElementById('btnConfirmarReserva');

// Nuevos Selects
const especialidadSelect = document.getElementById('especialidadSelect');
const medicoSelect = document.getElementById('medicoSelect');

// Variables de estado
let medicoIdGlobal = null;
let medicoSeleccionado = null;
let medicosData = []; // Necesitamos cargar los médicos
let especialidadesData = [];
let obrasSocialesData = [];
let turnosDisponibles = [];
let turnoSeleccionadoId = null;
let costoTotal = 0;

document.addEventListener('DOMContentLoaded', () => {
    medicosData = JSON.parse(localStorage.getItem("medicos") || "[]");
    especialidadesData = JSON.parse(localStorage.getItem("especialidades") || "[]");
    obrasSocialesData = JSON.parse(localStorage.getItem("obrasSociales") || "[]");
    cargarEspecialidadesCombo();
    cargarObrasSocialesCombo();

    const today = new Date().toISOString().split('T')[0];
    fechaInput.setAttribute('min', today);
    
    especialidadSelect.addEventListener('change', actualizarMedicosCombo);
    medicoSelect.addEventListener('change', seleccionarMedico);
    fechaInput.addEventListener('change', actualizarTurnosDisponibles);
    document.getElementById('obraSocialId').addEventListener('change', actualizarResumen);
    formReserva.addEventListener('submit', confirmarReserva);

    deshabilitarCamposReserva(true);
});


function cargarEspecialidadesCombo() {
    especialidadSelect.innerHTML = '<option value="" disabled selected>Seleccione una Especialidad</option>';
    especialidadSelect.innerHTML += especialidadesData.map(e => 
        `<option value="${e.id}">${e.nombre}</option>`
    ).join("");
}


function actualizarMedicosCombo() {
    medicoSelect.innerHTML = '<option value="" disabled selected>Seleccione un Médico</option>';
    medicoSelect.disabled = true;
    medicoIdGlobal = null;
    medicoSeleccionado = null;
    fechaInput.value = '';
    fechaInput.disabled = true;
    listaTurnosDiv.innerHTML = '';
    document.getElementById('turno-seleccionado-info').classList.add('d-none');
    document.getElementById('mensaje-turnos').textContent = "Por favor, seleccione un médico y una fecha para ver los turnos disponibles.";
    document.getElementById('mensaje-turnos').classList.remove('d-none');
    document.getElementById('medico-seleccionado').textContent = "Por favor, seleccione una especialidad y un médico.";
    actualizarResumen(); 
    deshabilitarCamposReserva(true);

    const especialidadId = Number(especialidadSelect.value);
    
    if (especialidadId) {
        const medicosFiltrados = medicosData.filter(m => m.especialidad === especialidadId);
        
        if (medicosFiltrados.length > 0) {
            medicoSelect.innerHTML += medicosFiltrados.map(m => 
                `<option value="${m.id}">${m.apellido}, ${m.nombre}</option>`
            ).join("");
            medicoSelect.disabled = false;
        } else {
            medicoSelect.innerHTML = '<option value="" disabled selected>No hay médicos en esta especialidad</option>';
        }
    }
}

function seleccionarMedico() {
    medicoIdGlobal = Number(medicoSelect.value);
    
    if (medicoIdGlobal) {
        cargarInfoMedico(medicoIdGlobal);
        fechaInput.disabled = false; 
        fechaInput.focus();
        
        listaTurnosDiv.innerHTML = '';
        document.getElementById('turno-seleccionado-info').classList.add('d-none');
        document.getElementById('mensaje-turnos').textContent = "Seleccione una fecha para ver los turnos disponibles.";
        document.getElementById('mensaje-turnos').classList.remove('d-none');
        
        deshabilitarCamposReserva(false);
        
        actualizarResumen(); 

        
        if (fechaInput.value) {
            actualizarTurnosDisponibles();
        }
    }
}

/**Habilita o deshabilita los campos de datos del paciente (Apellido/Nombre, Doc, OS). */
function deshabilitarCamposReserva(deshabilitar) {
    document.getElementById('apellidoNombre').disabled = deshabilitar;
    document.getElementById('documento').disabled = deshabilitar;
    document.getElementById('obraSocialId').disabled = deshabilitar;
}

/**Obtiene la información del médico y la muestra en la cabecera.*/
function cargarInfoMedico(id) {
    medicoSeleccionado = medicosData.find(m => m.id === id);

    if (medicoSeleccionado) {
        const especialidad = especialidadesData.find(e => e.id === medicoSeleccionado.especialidad);
        const nombreEspecialidad = especialidad ? especialidad.nombre : 'Desconocida';
        
        document.getElementById('medico-seleccionado').innerHTML = 
            `**Médico seleccionado:** <span class="h5 text-primary">${medicoSeleccionado.apellido}, ${medicoSeleccionado.nombre}</span> (${nombreEspecialidad})`;
        
        // Rellenar campos ocultos/informativos del formulario
        document.getElementById('inputMedicoId').value = medicoSeleccionado.id;
        document.getElementById('especialidadId').value = medicoSeleccionado.especialidad;
        document.getElementById('especialidadNombre').value = nombreEspecialidad;
        document.getElementById('resumen-medico').textContent = `${medicoSeleccionado.apellido}, ${medicoSeleccionado.nombre}`;
        document.getElementById('resumen-especialidad').textContent = nombreEspecialidad;
    }
}

// Carga las opciones de Obra Social en el combo.
function cargarObrasSocialesCombo() {
    const osCombo = document.getElementById("obraSocialId");
    osCombo.innerHTML = '<option value="0" selected>Particular / Sin Obra Social</option>';
    osCombo.innerHTML += obrasSocialesData.map(os => 
        `<option value="${os.id}">${os.nombre}</option>`
    ).join("");
}

//Muestra los turnos disponibles para el médico y la fecha seleccionada.
function actualizarTurnosDisponibles() {
    turnoSeleccionadoId = null; // Resetear selección
    listaTurnosDiv.innerHTML = '';
    btnConfirmar.disabled = true;

    const turnosData = JSON.parse(localStorage.getItem("turnos") || "[]");
    const fecha = fechaInput.value;
    const mensajeTurnos = document.getElementById('mensaje-turnos');
    mensajeTurnos.classList.add('d-none');
    
    if (!fecha || !medicoIdGlobal) return;

// Filtra turnos: 1. Por Médico, 2. Por Fecha (YYYY-MM-DD), 3. Disponibles (disponible=true)
    turnosDisponibles = turnosData.filter(t => 
        t.medicoId === medicoIdGlobal && 
        t.fechaHora.startsWith(fecha) && 
        t.disponible === true
    );

    if (turnosDisponibles.length === 0) {
        listaTurnosDiv.innerHTML = '';
        mensajeTurnos.textContent = `No hay turnos disponibles para el Dr/a. ${medicoSeleccionado.apellido} el ${fecha.split('-').reverse().join('/')}.`;
        mensajeTurnos.classList.remove('d-none');
        return;
    }

    turnosDisponibles.forEach(t => {
        const hora = t.fechaHora.split('T')[1];
        listaTurnosDiv.innerHTML += `
            <div class="col-6 col-sm-4 col-md-3 mb-3">
                <div class="card text-center p-3 turno-card" data-turno-id="${t.id}" data-fecha-hora="${t.fechaHora}">
                    <h5 class="m-0">${hora} hs</h5>
                </div>
            </div>
        `;
    });

    // Agregar evento de click a los nuevos turnos
    document.querySelectorAll('.turno-card').forEach(card => {
        card.addEventListener('click', seleccionarTurno);
    });
}

//Maneja la selección de un turno.
function seleccionarTurno() {
    document.querySelectorAll('.turno-card').forEach(card => card.classList.remove('selected'));
    
    this.classList.add('selected');
    turnoSeleccionadoId = Number(this.getAttribute('data-turno-id'));
    const fechaHora = this.getAttribute('data-fecha-hora');

    const [fecha, hora] = fechaHora.split('T');
    const fechaFormateada = fecha.split('-').reverse().join('/');
    
    document.getElementById('turno-seleccionado-detalle').textContent = `${fechaFormateada} a las ${hora} hs`;
    document.getElementById('turno-seleccionado-info').classList.remove('d-none');
    document.getElementById('inputTurnoId').value = turnoSeleccionadoId;
    
    btnConfirmar.disabled = false;
    actualizarResumen();
}

//Calcula y actualiza el costo total de la reserva y el resumen.
function actualizarResumen() {
    const obraSocialId = Number(document.getElementById('obraSocialId').value);

    // 1. Calcular Costo
    costoTotal = calcularValorTotal(medicoIdGlobal, obraSocialId);

    // 2. Actualizar Resumen
    const osSeleccionada = obrasSocialesData.find(os => os.id === obraSocialId);
    const nombreOS = osSeleccionada ? osSeleccionada.nombre : 'Particular';

    document.getElementById('resumen-os').textContent = nombreOS;
    resumenCostoSpan.textContent = `$${costoTotal.toFixed(2)}`; 
    
    const detalleTurno = document.getElementById('turno-seleccionado-detalle').textContent;
    document.getElementById('resumen-fecha-hora').textContent = detalleTurno || 'N/A';

    // Asegurar que el botón de confirmar se actualice 
    btnConfirmar.disabled = !turnoSeleccionadoId;
}

// Función auxiliar para calcular el valor de la consulta
function calcularValorTotal(medicoId, obraSocialId) {
    if (!medicoSeleccionado) return 0;
    
    const valorConsulta = Number(medicoSeleccionado.valorConsulta) || 0; 

    if (obraSocialId === 0) {
        return valorConsulta;
    }

    const aceptaObraSocial = (medicoSeleccionado.obrasSociales || []).includes(obraSocialId);

    if (aceptaObraSocial) {
        return 0.00;
    } else {
        return valorConsulta;
    }
}


function confirmarReserva(e) {
    e.preventDefault();

    if (!turnoSeleccionadoId) {
        alert("Por favor, seleccione un horario disponible.");
        return;
    }

    // Obtener datos de la reserva
    const nuevaReserva = {
        id: Date.now(), 
        turnoId: turnoSeleccionadoId,
        medicoId: medicoIdGlobal, 
        especialidadId: medicoSeleccionado.especialidad, 
        apellidoNombre: document.getElementById('apellidoNombre').value,
        documento: document.getElementById('documento').value,
        obraSocialId: Number(document.getElementById('obraSocialId').value),
        costoTotal: costoTotal, 
        fechaReserva: new Date().toISOString()
    };
    
    // Validación de campos del paciente
    if (!nuevaReserva.apellidoNombre || !nuevaReserva.documento) {
        alert("Por favor, complete su Apellido, Nombre y Documento.");
        return;
    }

    // Guardar la reserva
    let reservas = JSON.parse(localStorage.getItem("reservas") || "[]");
    reservas.push(nuevaReserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));

    // Marcar el turno como NO DISPONIBLE
    let turnos = JSON.parse(localStorage.getItem("turnos") || "[]");
    const turnoIndex = turnos.findIndex(t => t.id === turnoSeleccionadoId);
    if (turnoIndex !== -1) {
        turnos[turnoIndex].disponible = false;
        localStorage.setItem("turnos", JSON.stringify(turnos));
    }

    // Mostrar éxito y descargar comprobante
    const mensajeDiv = document.getElementById('mensaje-reserva');
    mensajeDiv.classList.remove('d-none', 'alert-danger');
    mensajeDiv.classList.add('alert-success');
    mensajeDiv.innerHTML = '¡Turno confirmado con éxito! Descargando su comprobante...';

    descargarComprobante(nuevaReserva);

    // Reiniciar formulario (o redirigir)
    setTimeout(() => {
        formReserva.reset();
        actualizarTurnosDisponibles(); 
        actualizarResumen(); 
        document.getElementById('turno-seleccionado-info').classList.add('d-none');
        turnoSeleccionadoId = null;
        btnConfirmar.disabled = true;
        
        
        especialidadSelect.value = "";
        actualizarMedicosCombo(); 
        deshabilitarCamposReserva(true);

    }, 2000);
}

//Genera y descarga un archivo de texto simple con la confirmación de la reserva.
function descargarComprobante(reserva) {
    const osSeleccionada = obrasSocialesData.find(os => os.id === reserva.obraSocialId);
    const nombreOS = osSeleccionada ? osSeleccionada.nombre : 'Particular';

    const turno = turnosDisponibles.find(t => t.id === reserva.turnoId);
    const fechaHora = turno ? turno.fechaHora.split('T') : ['Fecha Desconocida', 'Hora Desconocida'];
    const fechaFormateada = fechaHora[0].split('-').reverse().join('/');
    const horaFormateada = fechaHora[1];

    const contenido = `
    ========================================================
    CONFIRMACIÓN DE RESERVA - CENTRO MÉDICO IDW_57
    ========================================================
    
    ID de Reserva: ${reserva.id}
    Fecha de Emisión: ${new Date(reserva.fechaReserva).toLocaleString()}

    --- DATOS DEL TURNO ---
    Médico: ${medicoSeleccionado.apellido}, ${medicoSeleccionado.nombre}
    Especialidad: ${document.getElementById('resumen-especialidad').textContent}
    Fecha: ${fechaFormateada}
    Hora: ${horaFormateada} hs
    
    --- DATOS DEL PACIENTE ---
    Nombre y Apellido: ${reserva.apellidoNombre}
    Documento (DNI/CI): ${reserva.documento}
    Obra Social / Cobertura: ${nombreOS}
    
    --- INFORMACIÓN DE PAGO ---
    Costo Total a Pagar: $${reserva.costoTotal.toFixed(2)}
    
    --- CANCELACIÓN DE TURNO ---
    Comuníquese con nosotro si desea cancelar el turno
    (011) 1234-5678
    email: clinica_idw57@centromedico.com
    Horarios:Lunes a Viernes de 8:00 a 20:00

    ========================================================
    PRESENTAR ESTE COMPROBANTE AL LLEGAR.
    ========================================================
    `;

    // Lógica para descargar archivo de texto (.txt)
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Comprobante_Turno_${reserva.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}