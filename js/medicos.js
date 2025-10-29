document.addEventListener("DOMContentLoaded", function () {

    //medicos cargados por defecto
    const medicosBase = [
        {
            nombre: "Dra. Sonia Espinoza",
            especialidad: "Ginecología",
            obras: "OSDE, Swiss Medical, Medifé",
            horarios: "Lunes a Viernes 8:00 - 16:00",
            consultorio: "103",
            matricula: "MN 12345",
            descripcion: "Especialista en ginecología general, control prenatal y menopausia. Más de 15 años de experiencia.",
            img: "img/ginecologa.png"
        },
        {
            nombre: "Dra. María Paz Frana",
            especialidad: "Medicina Familiar",
            obras: "Swiss Medical",
            horarios: "Martes, Jueves y Viernes 9:00 - 17:00",
            consultorio: "204",
            matricula: "MN 67890",
            descripcion: "Especialista en medicina general, prevención y tratamiento de enfermedades crónicas. Atención integral de adultos y niños.",
            img: "img/medica.png"
        },
        {
            nombre: "Dr. Martín Rivas",
            especialidad: "Cardiología",
            obras: "OSDE",
            horarios: "Lunes, Miércoles y Viernes 9:00 - 18:00",
            consultorio: "305",
            matricula: "MN 11223",
            descripcion: "Especialista en diagnóstico y tratamiento de enfermedades del corazón. Realización de ecocardiogramas y pruebas de esfuerzo.",
            img: "img/medico.png"
        },
        {
            nombre: "Dra. Valentina Sotto",
            especialidad: "Pediatría",
            obras: "Medifé, PAMI",
            horarios: "Lunes, Miércoles y Viernes 8:00 - 16:00",
            consultorio: "406",
            matricula: "MN 44556",
            descripcion: "Especialista en salud infantil, control de crecimiento y desarrollo. Vacunación y atención de enfermedades pediátricas comunes.",
            img: "img/pediatra.png"
        },
        {
            nombre: "Dr. Nicolás Herrera",
            especialidad: "Traumatología",
            obras: "PAMI, OSDE",
            horarios: "Martes, Jueves y Sábado 9:00 - 14:00",
            consultorio: "507",
            matricula: "MN 77889",
            descripcion: "Especialista en lesiones y enfermedades del aparato locomotor. Cirugía ortopédica y traumatológica.",
            img: "img/traumatologo.png"
        }
    ];

    // LocalStorage de médicos
    let medicos = JSON.parse(localStorage.getItem("medicos")) || [];

    //agrega predeterminados si no estan cargados
    medicosBase.forEach(base => {
        if (!medicos.some(m => m.nombre === base.nombre)) {
            medicos.push(base);
        }
    });

    //guarda y actualiza
    localStorage.setItem("medicos", JSON.stringify(medicos));

    //renderiza catalogo en el index.html
const contenedor = document.getElementById("medicos-dinamicos");
if (contenedor) {
    contenedor.innerHTML = "";

    medicos.forEach((medico, index) => {
        contenedor.innerHTML += `
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="text-center pt-3">
                        <img src="${medico.img}" class="card-img-top" style="width:200px;height:200px;object-fit:cover;" alt="${medico.nombre}">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title fw-bold">${medico.nombre}</h5>
                        <p class="card-text">
                            <strong>Especialidad:</strong> ${medico.especialidad}<br>
                            <strong>Obras Sociales:</strong> ${medico.obras}<br>
                            <strong>Horarios:</strong> ${medico.horarios}<br>
                            <strong>Consultorio:</strong> N° ${medico.consultorio}<br>
                            <strong>Matrícula:</strong> ${medico.matricula}
                        </p>
                        <div class="d-grid gap-2">
                            <a href="#" class="btn btn-primary">Solicitar Turno</a>
                            <button class="btn btn-secondary ver-info-btn" data-index="${index}">Ver más información</button>
                        </div>

                        <!-- Sección oculta para descripción -->
                        <div class="info-extra mt-3" style="display:none;">
                            <hr>
                            <p><strong>Descripción:</strong> ${medico.descripcion}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    //activa la función de "ver mas informacion"
    document.querySelectorAll('.ver-info-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const cardBody = btn.closest('.card-body');
            const info = cardBody.querySelector('.info-extra');
            
            //mostrar/ocultar la información adicional
            if (info.style.display === 'none') {
                info.style.display = 'block';
                btn.textContent = 'Ocultar información';
            } else {
                info.style.display = 'none';
                btn.textContent = 'Ver más información';
            }
        });
    });
}
});
