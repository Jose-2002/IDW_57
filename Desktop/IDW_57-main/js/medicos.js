document.addEventListener('DOMContentLoaded', () => {
    mostrarMedicos();
    configurarFormularioTurno();
});

// Datos ampliados de los médicos
const medicos = [
    {
        nombre: "Dra. Sonia Espinoza",
        especialidad: "Ginecología",
        subespecialidades: ["Medicina Materno-Fetal", "Endocrinología Ginecológica"],
        experiencia: "15 años",
        obras: "OSDE, Swiss Medical, Medifé",
        horarios: "Lun-Vie 08:00 - 16:00",
        consultorio: "103",
        matricula: "MN 12345",
        idiomas: ["Español", "Inglés"],
        estudios: "Universidad Nacional de Medicina - Especialista en Ginecología",
        servicios: ["Consulta presencial", "Teleconsulta", "Control prenatal"],
        precio_consulta: "ARS 3500 (primera consulta)",
        descripcion: "Atención integral en ginecología, control prenatal y climaterio. Enfoque en contención y prevención.",
        calificacion: 4.7,
        resenas: [
            {autor: "María", texto: "Excelente atención, muy profesional."},
            {autor: "Laura", texto: "Me explicó todo con mucha paciencia."}
        ],
        img: "img/ginecologa.png"
    },
    {
        nombre: "Dr. Martín Rivas",
        especialidad: "Cardiología",
        subespecialidades: ["Ecocardiografía"],
        experiencia: "10 años",
        obras: "OSDE",
        horarios: "Lun, Mié, Vie 09:00 - 18:00",
        consultorio: "305",
        matricula: "MN 11223",
        idiomas: ["Español"],
        estudios: "Universidad Privada - Especialista en Cardiología",
        servicios: ["Consulta cardiológica", "Ecocardiograma", "Pruebas de esfuerzo"],
        precio_consulta: "ARS 4200",
        descripcion: "Diagnóstico y tratamiento de patologías cardiacas, ecocardiogramas y pruebas de esfuerzo.",
        calificacion: 4.6,
        resenas: [
            {autor: "Carlos", texto: "Me atendió rápido y con buen diagnóstico."}
        ],
        img: "img/medico.png"
    },
    {
        nombre: "Dra. María Paz Frana",
        especialidad: "Pediatría",
        subespecialidades: ["Neonatología (consulta básica)"],
        experiencia: "12 años",
        obras: "Swiss Medical",
        horarios: "Mar, Jue 09:00 - 17:00",
        consultorio: "204",
        matricula: "MN 67890",
        idiomas: ["Español"],
        estudios: "Facultad de Medicina - Especialista en Pediatría",
        servicios: ["Controles de crecimiento", "Vacunación", "Teleconsulta pediátrica"],
        precio_consulta: "ARS 3000",
        descripcion: "Cuidado integral del niño: controles de crecimiento, vacunación y orientación familiar.",
        calificacion: 4.8,
        resenas: [
            {autor: "Pablo", texto: "Gran profesional, mi hijo la adora."}
        ],
        img: "img/medica.png"
    }
];

// Renderiza las cards con info ampliada (vista breve)
function mostrarMedicos() {
    const contenedor = document.getElementById('medicos-dinamicos');
    if (!contenedor) return;
    contenedor.innerHTML = '';

    medicos.forEach(medico => {
        // Generar estrellas para la calificación
        const estrellas = generarEstrellas(medico.calificacion);
        // Mostrar idiomas en línea (máx 2)
        const idiomas = (medico.idiomas || []).join(' · ');

        contenedor.innerHTML += `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body text-center">
                        <img src="${medico.img}" alt="${medico.nombre}" class="img-doctor mb-2">
                        <h5 class="card-title">${medico.nombre}</h5>
                        <div class="mb-2">
                            <span class="badge bg-primary">${medico.especialidad}</span>
                            <span class="text-muted small ms-2">${medico.experiencia}</span>
                        </div>
                        <div class="mb-2">${estrellas} <span class="text-muted small">(${medico.calificacion})</span></div>
                        <p class="card-text text-muted small mb-2">${idiomas}</p>
                        <p class="card-text mb-3" style="min-height:48px; overflow:hidden;">${medico.descripcion}</p>
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-primary" onclick="mostrarDetalleMedico('${escapeHtml(medico.nombre)}')">Ver perfil</button>
                            <button class="btn btn-primary" onclick="prepararTurnoDirecto('${escapeHtml(medico.nombre)}')">Solicitar Turno</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

// Mostrar modal con toda la información del médico
function mostrarDetalleMedico(nombre) {
    const medico = medicos.find(m => m.nombre === nombre);
    if (!medico) return;

    // rellenar campo oculto para el formulario de turno
    const oculto = document.getElementById('medicoSeleccionado');
    if (oculto) oculto.value = medico.nombre;

    const modalBody = document.getElementById('infoMedicoBody');
    if (!modalBody) return;

    const serviciosList = (medico.servicios || []).map(s => `<li>${s}</li>`).join('');
    const resenasList = (medico.resenas || []).map(r => `<li><strong>${r.autor}:</strong> ${r.texto}</li>`).join('');
    const idiomas = (medico.idiomas || []).join(', ');

    modalBody.innerHTML = `
        <div class="text-center">
            <img src="${medico.img}" class="rounded-circle mb-3 img-doctor" style="width:150px;height:150px;object-fit:cover;">
            <h4 class="mb-1">${medico.nombre}</h4>
            <div class="mb-2">
                <span class="badge bg-primary">${medico.especialidad}</span>
                <span class="text-muted small ms-2">${medico.experiencia}</span>
            </div>
            <div class="mb-3">${generarEstrellas(medico.calificacion)} <small class="text-muted">(${medico.calificacion})</small></div>
            <p class="text-start"><strong>Descripción:</strong> ${medico.descripcion}</p>
            <div class="text-start">
                <p><strong>Obras Sociales:</strong> ${medico.obras}</p>
                <p><strong>Horarios:</strong> ${medico.horarios}</p>
                <p><strong>Consultorio:</strong> ${medico.consultorio} — <strong>Matrícula:</strong> ${medico.matricula}</p>
                <p><strong>Idiomas:</strong> ${idiomas}</p>
                <p><strong>Estudios:</strong> ${medico.estudios}</p>
                <p><strong>Servicios:</strong></p>
                <ul>${serviciosList}</ul>
                <p><strong>Precio aproximado:</strong> ${medico.precio_consulta}</p>
                <p><strong>Reseñas:</strong></p>
                <ul>${resenasList || '<li class="text-muted">Aún no hay reseñas.</li>'}</ul>
            </div>
        </div>
    `;

    new bootstrap.Modal(document.getElementById('infoMedicoModal')).show();
}

// Preparar turno directamente desde la card (abre modal turno)
function prepararTurnoDirecto(nombre) {
    // rellenar campo oculto para el formulario de turno
    const oculto = document.getElementById('medicoSeleccionado');
    if (oculto) oculto.value = nombre;

    // resetear formulario y abrir modal de turno
    const form = document.getElementById('formTurno');
    if (form) form.reset();

    // configurar fecha mínima si no está hecha
    configurarFechaMinima();

    new bootstrap.Modal(document.getElementById('turnoModal')).show();
}

// Configura opciones de horario y fecha mínima
function configurarFormularioTurno() {
    const selectHorario = document.getElementById('horaTurno');
    if (selectHorario && selectHorario.options.length <= 1) {
        const horarios = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00'];
        horarios.forEach(h => {
            const opt = document.createElement('option');
            opt.value = h;
            opt.textContent = h;
            selectHorario.appendChild(opt);
        });
    }
    configurarFechaMinima();
}

function configurarFechaMinima() {
    const fechaTurno = document.getElementById('fechaTurno');
    if (!fechaTurno) return;
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);
    fechaTurno.min = manana.toISOString().split('T')[0];
}

// Confirmar y guardar turno en localStorage
function confirmarTurno() {
    const form = document.getElementById('formTurno');
    if (!form) return;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const turno = {
        medico: document.getElementById('medicoSeleccionado').value,
        paciente: document.getElementById('nombrePaciente').value,
        fecha: document.getElementById('fechaTurno').value,
        hora: document.getElementById('horaTurno').value,
        creadoEn: new Date().toISOString()
    };

    const turnos = JSON.parse(localStorage.getItem('turnos') || '[]');
    turnos.push(turno);
    localStorage.setItem('turnos', JSON.stringify(turnos));

    // cerrar modal de turno
    const modal = bootstrap.Modal.getInstance(document.getElementById('turnoModal'));
    if (modal) modal.hide();

    alert('Turno registrado exitosamente');
    // redirigir a la página de turnos si existe
    if (location.pathname.endsWith('index.html') || location.pathname.endsWith('/')) {
        // mantener en la misma página, o redirigir si desea:
        // window.location.href = 'turnos.html';
    }
}

// Utilidades
function generarEstrellas(puntuacion) {
    const full = Math.floor(puntuacion);
    const half = (puntuacion - full) >= 0.5;
    let html = '';
    for (let i = 0; i < full; i++) html += '★';
    if (half) html += '☆';
    for (let i = full + (half ? 1 : 0); i < 5; i++) html += '☆';
    return `<span class="text-warning" style="font-size:1.1rem;">${html}</span>`;
}

function escapeHtml(text) {
    if (!text) return text;
    return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
}
