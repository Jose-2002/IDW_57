const formOS = document.getElementById("formObraSocial");
const tablaOSBody = document.querySelector("#tablaObrasSociales tbody");
let editIndexOS = null;

function actualizarTablaOS() {
  const obras = JSON.parse(localStorage.getItem("obrasSociales")) || [];
  tablaOSBody.innerHTML = obras.map((o, i) => `
    <tr>
      <td>${o.id}</td>
      <td>${o.nombre}</td>
      <td>${o.descripcion}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="editarOS(${i})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarOS(${i})">Eliminar</button>
      </td>
    </tr>
  `).join("");
}

function guardarOS(e) {
  e.preventDefault();
  const obras = JSON.parse(localStorage.getItem("obrasSociales")) || [];
  let nuevoId;

  if (editIndexOS === null) {  
    const maxId = obras.reduce((max, obra) => Math.max(max, Number(obra.id)), 0);
    nuevoId = maxId + 1;
  }
  
  const obra = {
    id: (editIndexOS !== null) ? document.getElementById("idObraSocial").value : nuevoId,
    nombre: document.getElementById("nombreObraSocial").value.trim(),
    descripcion: document.getElementById("descripcionObraSocial").value.trim()
  };

  if (!obra.nombre) {
    alert("Ingrese el nombre de la Obra Social");
    return;
  }

  if (editIndexOS !== null) {
    obras[editIndexOS] = obra;
    editIndexOS = null;
  } else {
    obras.push(obra);
  }

  localStorage.setItem("obrasSociales", JSON.stringify(obras));
  formOS.reset();
  actualizarTablaOS();
}

function editarOS(i) {
  const obras = JSON.parse(localStorage.getItem("obrasSociales")) || [];
  const o = obras[i];
  editIndexOS = i;
  document.getElementById("idObraSocial").value = o.id;
  document.getElementById("nombreObraSocial").value = o.nombre;
  document.getElementById("descripcionObraSocial").value = o.descripcion;
}

function eliminarOS(i) {
  const obras = JSON.parse(localStorage.getItem("obrasSociales")) || [];
  if (confirm(`¿Eliminar la Obra Social "${obras[i].nombre}"?`)) {
    obras.splice(i, 1);
    localStorage.setItem("obrasSociales", JSON.stringify(obras));
    actualizarTablaOS();
  }
}

formOS.addEventListener("submit", guardarOS);
actualizarTablaOS();
