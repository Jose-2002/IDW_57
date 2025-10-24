document.addEventListener('DOMContentLoaded', function () {
    const contenedor = document.getElementById('medicos-dinamicos');
    if (!contenedor) return;

    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];

    medicos.forEach(medico => {
        const card = document.createElement('div');
        card.className = "col-12 col-md-6 col-lg-4";
        card.innerHTML = `
            <div class="card h-100">
                <div class="text-center pt-3">
                    <img src="${medico.img}" class="card-img-top" style="width: 200px; height: 200px; object-fit: cover;" alt="${medico.nombre}">
                </div>
                <div class="card-body">
                    <h5 class="card-title fw-bold">${medico.nombre}</h5>
                    <p class="card-text">
                        <strong>Especialidad:</strong> ${medico.especialidad}<br>
                        <strong>Obras Sociales:</strong> ${medico.obras}<br>
                        <strong>Horarios:</strong> ${medico.horarios}<br>
                        <strong>Consultorio:</strong> ${medico.consultorio}<br>
                        <strong>Matricula:</strong> ${medico.matricula}
                    </p>
                    <div class="d-grid gap-2">
                        <a href="#" class="btn btn-primary">Solicitar Turno</a>
                        <button class="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#info-${medico.matricula}">
                            Ver más información
                        </button>
                    </div>
                    <div class="collapse mt-3" id="info-${medico.matricula}">
                        <div class="card card-body">
                            <small>${medico.descripcion}</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
});
