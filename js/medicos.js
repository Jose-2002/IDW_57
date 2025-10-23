const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
const contenedor = document.getElementById('medicos-dinamicos');

if (medicos.length > 0) {
     medicos.forEach(medico => {
         const col = document.createElement('div');
         col.className = "col-12 col-md-6 col-lg-4";

         col.innerHTML = `
              <div class="card h-100">
                 <div class="text-center pt-3">
                    <img src="img/sinfoto.jpg" class="card-img-top" style="width: 200px; height: 200px; object-fit: cover;" alt="${medico.nombre}">
                   </div>
                   <div class="card-body">
                       <h5 class="card-title fw-bold">${medico.nombre}</h5>
                       <p class="card-text">
                           <strong>Especialidad:</strong> ${medico.especialidad}<br>
                           <strong>Obras Sociales:</strong> ${medico.obras}<br>
                           <strong>Horarios:</strong> ${medico.horarios || 'A confirmar'}<br>
                           <strong>Consultorio:</strong> ${medico.consultorio || 'A asignar'}<br>
                           <strong>Matricula:</strong> ${medico.matricula || 'En trámite'}
                       </p>
                       <div class="d-grid gap-2">
                            <a href="#" class="btn btn-primary">Solicitar Turno</a>
                            <button class="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#info-${medico.id || 'nuevo'}">
                                  Ver más información
                             </button>
                         </div>
                         <div class="collapse mt-3" id="info-${medico.id || 'nuevo'}">
                               <div class="card card-body">
                                         <small>${medico.descripcion || 'Información adicional próximamente.'}</small>
                                    </div>
                              </div>
                        </div>
                   </div>
               `;
           contenedor.appendChild(col);
         });
     }

           contenedor.appendChild(col);
         });
     }
