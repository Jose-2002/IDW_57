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
            const horarios = document.getElementById('horarios').value.trim();
            const consultorio = document.getElementById('consultorio').value.trim();
            const matricula = document.getElementById('matricula').value.trim();
            const descripcion = document.getElementById('descripcion').value.trim();
            const imgInput = document.getElementById('img');
            let img = '';

            if (imgInput && imgInput.value.trim() !== '') {
                img = imgInput.value.trim();
            } else {
                img = 'img/medico_generico.jpg'; // Ruta de la imagen por defecto
            }

            const medicos = JSON.parse(localStorage.getItem('medicos')) || [];

            const nuevoMedico = {
                nombre,
                especialidad,
                obras,
                horarios,
                consultorio,
                matricula,
                descripcion,
                img
            };

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

            const index = medicos.findIndex(m => m.nombre.toLowerCase() === nombre);

            if (index !== -1) {
                medicos.splice(index, 1);
                localStorage.setItem('medicos', JSON.stringify(medicos));
                mensajeBaja.style.color = 'green';
                mensajeBaja.textContent = `Médico "${nombre}" dado de baja correctamente.`;
                formBaja.reset();

                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            } else {
                mensajeBaja.style.color = 'red';
                mensajeBaja.textContent = 'No se encontró un médico con ese nombre.';
            }
        });
    }

    //editar medicos
    const formEditar = document.getElementById('form-editar');
    const mensajeEditar = document.getElementById('mensaje-editar');

    if (formEditar) {
        formEditar.addEventListener('submit', function (e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre-editar').value.trim().toLowerCase();
            const nuevaEspecialidad = document.getElementById('nueva-especialidad').value.trim();
            const nuevaObra = document.getElementById('nueva-obra').value.trim();
            const nuevosHorarios = document.getElementById('nuevos-horarios').value.trim();
            const nuevoConsultorio = document.getElementById('nuevo-consultorio').value.trim();
            const nuevaMatricula = document.getElementById('nueva-matricula').value.trim();
            const nuevaDescripcion = document.getElementById('nueva-descripcion').value.trim();
            const nuevaImg = document.getElementById('nueva-img').value.trim();

            let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
            const medico = medicos.find(m => m.nombre.toLowerCase() === nombre);

            if (medico) {
                if (nuevaEspecialidad) medico.especialidad = nuevaEspecialidad;
                if (nuevaObra) medico.obras = nuevaObra;
                if (nuevosHorarios) medico.horarios = nuevosHorarios;
                if (nuevoConsultorio) medico.consultorio = nuevoConsultorio;
                if (nuevaMatricula) medico.matricula = nuevaMatricula;
                if (nuevaDescripcion) medico.descripcion = nuevaDescripcion;
                if (nuevaImg) medico.img = nuevaImg;

                localStorage.setItem('medicos', JSON.stringify(medicos));
                mensajeEditar.style.color = 'green';
                mensajeEditar.textContent = 'Datos actualizados correctamente.';
                formEditar.reset();

                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            } else {
                mensajeEditar.style.color = 'red';
                mensajeEditar.textContent = 'No se encontró un médico con ese nombre.';
            }
        });
    }
});