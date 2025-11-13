const form = document.getElementById("formMedico");
const tablaBody = document.querySelector("#tablaMedicos tbody");
let editIndex = null;

function cargarCombos() {
  const esp = JSON.parse(localStorage.getItem("especialidades")) || [];
  const os = JSON.parse(localStorage.getItem("obrasSociales")) || [];

  const espSel = document.getElementById("especialidad");
  const osSel = document.getElementById("obrasSociales");
  espSel.innerHTML = esp.map(e => `<option value="${e.id}">${e.nombre}</option>`).join("");
  osSel.innerHTML = os.map(o => `<option value="${o.id}">${o.nombre}</option>`).join("");
}

function actualizarTabla() {
  const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
  const esp = JSON.parse(localStorage.getItem("especialidades")) || [];
  const os = JSON.parse(localStorage.getItem("obrasSociales")) || [];

  tablaBody.innerHTML = medicos.map((m, i) => {
    const nombreEsp = esp.find(e => e.id == m.especialidad)?.nombre || "N/A";
    const nombreOS = (m.obrasSociales || []).map(id => os.find(o => o.id == id)?.nombre || "").join(", ");
    return `
      <tr>
        <td>${m.matricula}</td>
        <td>${m.apellido}</td>
        <td>${m.nombre}</td>
        <td>${nombreEsp}</td>
        <td>${nombreOS}</td>
        <td>${m.valorConsulta}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarMedico(${i})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarMedico(${i})">Eliminar</button>
        </td>
      </tr>`;
  }).join("");
}

function guardarMedico(e) {
  e.preventDefault();
  const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
  let nuevoId = null;
  
  // *** Lógica para generar ID correlativo (incremental) y único ***
  if (editIndex === null) {
    // 1. Encontrar el ID más alto actual. Convertimos a Number() para asegurar la comparación.
    const maxId = medicos.reduce((max, medico) => Math.max(max, Number(medico.id)), 0);
    // 2. El nuevo ID es el máximo + 1
    nuevoId = maxId + 1;
  }

  const medico = {
    id: (editIndex !== null) ? medicos[editIndex].id : nuevoId,
    matricula: Number(document.getElementById("matricula").value),
    apellido: document.getElementById("apellido").value.trim(),
    nombre: document.getElementById("nombre").value.trim(),
    especialidad: Number(document.getElementById("especialidad").value),
    descripcion: document.getElementById("descripcion").value.trim(),
    obrasSociales: Array.from(document.getElementById("obrasSociales").selectedOptions).map(o => Number(o.value)),
    valorConsulta: parseFloat(document.getElementById("valorConsulta").value) || 0,
    foto: document.getElementById("foto").dataset.base64 || "../img/medico_generico.jpg"
  };

  if (editIndex !== null) {
    medicos[editIndex] = medico;
    localStorage.setItem("medicos", JSON.stringify(medicos));
    mostrarMensaje(`Se han guardado los cambios del Dr. ${medico.apellido}.`, "success");
    editIndex = null;
  } else {
    medicos.push(medico);
    localStorage.setItem("medicos", JSON.stringify(medicos));
    mostrarMensaje(`Nuevo médico ${medico.nombre} ${medico.apellido} agregado correctamente.`, "success");
  }

  localStorage.setItem("medicos", JSON.stringify(medicos));
  form.reset();

  if (document.getElementById("foto")){
    delete document.getElementById("foto").dataset.base64;
  }
  actualizarTabla();
}

function editarMedico(i) {
  const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
  const m = medicos[i];
  editIndex = i;
  document.getElementById("matricula").value = m.matricula;
  document.getElementById("apellido").value = m.apellido;
  document.getElementById("nombre").value = m.nombre;
  document.getElementById("especialidad").value = m.especialidad;
  document.getElementById("descripcion").value = m.descripcion;
  document.getElementById("valorConsulta").value = m.valorConsulta;
  
  const osSelect = document.getElementById("obrasSociales");
  Array.from(osSelect.options).forEach(opt => {
    opt.selected = (m.obrasSociales || []).includes(Number(opt.value));
  });

  form.scrollIntoView({ behavior: "smooth", block: "start" });
  document.getElementById("matricula").focus();
}

function eliminarMedico(i) {
  const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
  if (confirm(`¿Eliminar al Dr. ${medicos[i].apellido}?`)) {
    const eliminado = medicos.splice(i, 1);
    localStorage.setItem("medicos", JSON.stringify(medicos));
    actualizarTabla();
    mostrarMensaje(`Se eliminó correctamente al Dr. ${eliminado.apellido}.`, "danger");
  }
}

// Convertir imagen a Base64
document.getElementById("foto")?.addEventListener("change", e => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => e.target.dataset.base64 = reader.result;
  if (file) reader.readAsDataURL(file);
});

function mostrarMensaje(texto, tipo = "success") {
  const msgDiv = document.getElementById("mensaje");
  msgDiv.textContent = texto;

  // Cambiar estilo según el tipo de mensaje
  msgDiv.className = "alert"; 
  msgDiv.classList.add(
    tipo === "success" ? "alert-success" :
    tipo === "warning" ? "alert-warning" :
    "alert-danger"
  );

  msgDiv.style.display = "block";

  // Ocultar mensaje después de 3 segundos
  setTimeout(() => {
    msgDiv.style.display = "none";
  }, 3000);
}


form.addEventListener("submit", guardarMedico);
cargarCombos();
actualizarTabla();
