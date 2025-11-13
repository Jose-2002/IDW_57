document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener y parsear los datos de médicos (asegurando un array vacío si no hay nada)
    const medicosData = JSON.parse(localStorage.getItem("medicos") || "[]");
    
    // 2. Obtener y parsear los datos de especialidades y obras sociales para mostrar sus nombres
    const especialidadesData = JSON.parse(localStorage.getItem("especialidades") || "[]");
    const obrasSocialesData = JSON.parse(localStorage.getItem("obrasSociales") || "[]");

    const contenedor = document.getElementById("medicos-dinamicos");

    if (contenedor && medicosData.length > 0) {
        contenedor.innerHTML = "";

        medicosData.forEach((medico, index) => {
            // Busca el nombre de la especialidad
            const especialidad = especialidadesData.find(e => e.id === medico.especialidad)?.nombre || "No especificada";
            
            // Busca los nombres de las obras sociales
            const obrasNombres = medico.obrasSociales.map(osId => {
                return obrasSocialesData.find(os => os.id === osId)?.nombre || 'Desconocida';
            }).join(', ');
            
            contenedor.innerHTML += `
                <div class="col-12 col-md-6 col-lg-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <div class="text-center pt-3">
                            <img src="${medico.foto}" class="card-img-top" style="width:200px;height:200px;object-fit:cover;" alt="${medico.nombre} ${medico.apellido}">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title fw-bold">${medico.nombre} ${medico.apellido}</h5>
                            <p class="card-text">
                                <strong>Especialidad:</strong> ${especialidad}<br>
                                <strong>Obras Sociales:</strong> ${obrasNombres}<br>
                                <strong>Valor:</strong> $${medico.valorConsulta.toFixed(2)}<br>
                                <strong>Matrícula:</strong> ${medico.matricula}
                            </p>
                            <div class="d-grid gap-2">
                                <a href="pacientes.html?medicoId=${medico.id}" class="btn btn-primary">Solicitar Turno</a>
                                <button class="btn btn-secondary ver-info-btn" data-descripcion="${medico.descripcion}">Ver más información</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Agregar la lógica para el botón "Ver más información"
        document.querySelectorAll('.ver-info-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const descripcion = btn.getAttribute('data-descripcion');
                const modalBody = document.getElementById('infoMedicoBody');
                modalBody.innerHTML = `<p>${descripcion}</p>`;
                
                const infoModal = new bootstrap.Modal(document.getElementById('infoMedicoModal'));
                infoModal.show();
            });
        });

    } else if (contenedor) {
        contenedor.innerHTML = `<p class="text-center">No hay médicos cargados en el sistema.</p>`;
    }
});