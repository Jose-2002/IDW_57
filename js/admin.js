document.addEventListener('DOMContentLoaded', function () {
    // alta de medicos
const formAlta = document.getElementById('form-alta');
const mensajeAlta = document.getElementById('mensaje-alta');

if (formAlta) {
    formAlta.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const especialidad = document.getElementById('especialidad').value.trim();
        const obras = document.getElementById('obras').value.trim();

        if (!nombre || !especialidad || !obras) {
            alert('Por favor completá todos los campos.');
            return;
        }

        const nuevoMedico = {
            nombre,
            especialidad,
            obras,
            img: "img/medico.png"
        };

        const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
        medicos.push(nuevoMedico);
        localStorage.setItem('medicos', JSON.stringify(medicos));

        mensajeAlta.textContent = `Médico "${nombre}" registrado correctamente.`;

        formAlta.reset();

        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
    });
}

    //baja de medicos
    const formBaja = document.getElementById('form-baja');
    const mensajeBaja = document.getElementById('mensaje-baja');

    if (formBaja) {
        formBaja.addEventListener('submit', function (e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim().toLowerCase();

            let medicos = JSON.parse(localStorage.getItem('medicos')) || [];

            const index = medicos.findIndex(medico =>
                medico.nombre.toLowerCase() === nombre
            );

    if (index !== -1) {
    medicos.splice(index, 1);
    localStorage.setItem('medicos', JSON.stringify(medicos));
    mensajeBaja.style.color = 'green';
    mensajeBaja.textContent = `Médico "${nombre}" dado de baja correctamente.`;
    formBaja.reset();

    // Redireccionar al catálogo
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1500);
}
    else {
                mensajeBaja.style.color = 'red';
                mensajeBaja.textContent = 'No se encontró un médico con ese nombre.';
            }
        });
    }

    // mostar catálogo -  index.html ==========
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        mostrarCatalogoMedicos();
    }
});

// muestra catalogo
function mostrarCatalogoMedicos() {
    const catalogo = document.getElementById('catalogo-medicos');
    if (!catalogo) return;

    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];

    catalogo.innerHTML = '';

    medicos.forEach(medico => {
        const card = document.createElement('div');
        card.className = 'col-12 col-md-6 col-lg-4 d-flex';
        card.innerHTML = `
            <div class="card w-18rem">
                <img src="${medico.img || 'img/medico.png'}" width="100" height="140" alt="Foto de ${medico.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${medico.nombre}</h5>
                    <p class="card-text">
                        Especialidad: ${medico.especialidad}<br>
                        Obra Social: ${medico.obras}
                    </p>
                    <a href="#" class="btn btn-primary">Turnos</a>
                </div>
            </div>
        `;
        catalogo.appendChild(card);
    });
}

// editar medicos
const formEditar = document.getElementById('form-editar');
const mensajeEditar = document.getElementById('mensaje-editar');

if (formEditar) {
    formEditar.addEventListener('submit', function(e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim().toLowerCase();
        const nuevaEspecialidad = document.getElementById('nueva-especialidad').value.trim();
        const nuevaObra = document.getElementById('nueva-obra').value.trim();

        let medicos = JSON.parse(localStorage.getItem('medicos')) || [];

        const medico = medicos.find(m => m.nombre.toLowerCase() === nombre);

        if (medico) {
    if (nuevaEspecialidad) medico.especialidad = nuevaEspecialidad;
    if (nuevaObra) medico.obras = nuevaObra;

    localStorage.setItem('medicos', JSON.stringify(medicos));
    mensajeEditar.style.color = 'green';
    mensajeEditar.textContent = `Datos actualizados correctamente.`;
    formEditar.reset();

    // Redireccionar al catálogo
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1500);}
    else {
            mensajeEditar.style.color = 'red';
            mensajeEditar.textContent = 'No se encontró un médico con ese nombre.';
        }
    });
}
