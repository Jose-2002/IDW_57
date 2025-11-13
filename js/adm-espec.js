const formEsp = document.getElementById("formEspecialidad");
const tablaEspBody = document.querySelector("#tablaEspecialidades tbody");
let editIndexEsp = null;

function actualizarTablaEsp() {
  const especialidades = JSON.parse(localStorage.getItem("especialidades")) || [];
  tablaEspBody.innerHTML = especialidades.map((e, i) => `
    <tr>
      <td>${e.id}</td>
      <td>${e.nombre}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="editarEsp(${i})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarEsp(${i})">Eliminar</button>
      </td>
    </tr>
  `).join("");
}

function guardarEsp(e) {
  e.preventDefault();
  const especialidades = JSON.parse(localStorage.getItem("especialidades")) || [];
  let nuevoId = null;

  // *** Lógica para generar ID correlativo (incremental) y único ***
  if (editIndexEsp === null) {
    const maxId = especialidades.reduce((max, esp) => Math.max(max, Number(esp.id)), 0);
    nuevoId = maxId + 1;
  }
  
  const especialidad = {
    id: (editIndexEsp !== null) ? document.getElementById("idEspecialidad").value : nuevoId,
    nombre: document.getElementById("nombreEspecialidad").value.trim()
  };

  if (!especialidad.nombre) {
    alert("Ingrese el nombre de la especialidad");
    return;
  }

  if (editIndexEsp !== null) {
    especialidades[editIndexEsp] = especialidad;
    editIndexEsp = null;
  } else {
    especialidades.push(especialidad);
  }

  localStorage.setItem("especialidades", JSON.stringify(especialidades));
  formEsp.reset();
  actualizarTablaEsp();
}

function editarEsp(i) {
  const especialidades = JSON.parse(localStorage.getItem("especialidades")) || [];
  const e = especialidades[i];
  editIndexEsp = i;
  document.getElementById("idEspecialidad").value = e.id;
  document.getElementById("nombreEspecialidad").value = e.nombre;
}

function eliminarEsp(i) {
  const especialidades = JSON.parse(localStorage.getItem("especialidades")) || [];
  if (confirm(`¿Eliminar la especialidad "${especialidades[i].nombre}"?`)) {
    especialidades.splice(i, 1);
    localStorage.setItem("especialidades", JSON.stringify(especialidades));
    actualizarTablaEsp();
  }
}

formEsp.addEventListener("submit", guardarEsp);
actualizarTablaEsp();
