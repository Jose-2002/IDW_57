// DATOS POR DEFECTO

// Evitar duplicar datos si ya existen
if (!localStorage.getItem("especialidades")) {
  const especialidades = [
    { id: 1, nombre: "Cardiología" },
    { id: 2, nombre: "Pediatría" },
    { id: 3, nombre: "Dermatología" },
    { id: 4, nombre: "Traumatología" },
    { id: 5, nombre: "Ginecología"},
    { id: 6, nombre: "Clínica Médica"}
  ];
  localStorage.setItem("especialidades", JSON.stringify(especialidades));
  console.log("Especialidades iniciales cargadas");
}

if (!localStorage.getItem("obrasSociales")) {
  const obrasSociales = [
    { id: 1, nombre: "OSDE", descripcion: "Obra social de directivos y ejecutivos" },
    { id: 2, nombre: "IOMA", descripcion: "Instituto de Obra Médico Asistencial" },
    { id: 3, nombre: "Swiss Medical", descripcion: "Cobertura médica privada integral" },
    { id: 4, nombre: "GALENO", descripcion: "Azul, Bronce, Oro, Plata"}
  ];
  localStorage.setItem("obrasSociales", JSON.stringify(obrasSociales));
  console.log("Obras Sociales iniciales cargadas");
}

if (!localStorage.getItem("medicos")) {
  const medicos = [
    {
      id: 1,
      matricula: 123,
      apellido: "Gómez",
      nombre: "Laura",
      especialidad: 1, // Cardiología
      descripcion: "Cardióloga con 10 años de experiencia en clínica IDW.",
      obrasSociales: [1, 3], // OSDE, Swiss Medical
      foto: "img/medica.png", 
      valorConsulta: 15000.0
    },
    {
      id: 2,
      matricula: 456,
      apellido: "Pérez",
      nombre: "Andrea",
      especialidad: 2, // Pediatría
      descripcion: "Pediatra especializada en medicina preventiva infantil.",
      obrasSociales: [2],
      foto: "img/pediatra.png",
      valorConsulta: 12000.0
    },
    {
      id: 3,
      matricula: 789,
      apellido: "Fernández",
      nombre: "Mariano",
      especialidad: 3, // Dermatología
      descripcion: "Dermatólogo experto en tratamientos estéticos y clínicos.",
      obrasSociales: [1, 2, 3],
      foto: "img/medico.png",
      valorConsulta: 18000.0
    },
    {
      id: 4,
      matricula: 321,
      apellido: "Riquelme",
      nombre: "Román",
      especialidad: 6, // Clínica Médica
      descripcion: "Especializado en medicina familiar.",
      obrasSociales: [1, 3, 4], // OSDE, Swiss Medical, Galeno
      foto: "img/medico_clinico.png", 
      valorConsulta: 15000.0
    },
    {
      id: 5,
      matricula: 654,
      apellido: "Pérez",
      nombre: "Andrés",
      especialidad: 4, // Traumatología
      descripcion: "Especializado en traumas del deporte.",
      obrasSociales: [1, 2],
      foto: "img/traumatologo.png",
      valorConsulta: 12000.0
    },
    {
      id: 6,
      matricula: 987,
      apellido: "Rovina",
      nombre: "Gabriela",
      especialidad: 5, // Ginecología
      descripcion: "Especializada en cuidado de la mujer.",
      obrasSociales: [1, 2, 3],
      foto: "img/ginecologa.png",
      valorConsulta: 18000.0
    }
  ];
  localStorage.setItem("medicos", JSON.stringify(medicos));
  console.log("Médicos iniciales cargados");
}

console.log("Datos de ejemplo inicializados correctamente en localStorage");

if (!localStorage.getItem("turnos")) {
    // Turnos de ejemplo
    // Formato: YYYY-MM-DDTHH:mm
    const turnos = [
        // Turno Reservado - Médico 1 (Cardiología)
        { id: 101, medicoId: 1, fechaHora: "2025-11-20T10:00", disponible: false }, 
        // Turno Disponible - Médico 1 (Cardiología)
        { id: 102, medicoId: 1, fechaHora: "2025-11-20T10:30", disponible: true },
        { id: 103, medicoId: 1, fechaHora: "2025-11-20T11:00", disponible: true },
        
        // Turnos Disponibles - Médico 3 (Dermatología)
        { id: 301, medicoId: 3, fechaHora: "2025-11-21T09:00", disponible: true },
        { id: 302, medicoId: 3, fechaHora: "2025-11-21T09:30", disponible: true },
        
        // Turno Reservado - Médico 4 (Clínica Médica)
        { id: 401, medicoId: 4, fechaHora: "2025-11-22T14:00", disponible: false },
        { id: 402, medicoId: 4, fechaHora: "2025-11-22T14:30", disponible: true }
    ];
    localStorage.setItem("turnos", JSON.stringify(turnos));
    console.log("Turnos iniciales cargados");
}

if (!localStorage.getItem("reservas")) {
    // Reservas de ejemplo
    const reservas = [
        {
            id: 1, // ID de la reserva
            turnoId: 101, // Corresponde al turno 101 (reservado)
            medicoId: 1, 
            especialidadId: 1, 
            apellidoNombre: "González, Ana",
            documento: "34567890",
            obraSocialId: 1, // OSDE (Médico 1 acepta OSDE, costo debería ser 0)
            costoTotal: 0.00, 
            fechaReserva: new Date().toISOString()
        },
        {
            id: 2,
            turnoId: 401, // Corresponde al turno 401 (reservado)
            medicoId: 4, 
            especialidadId: 6, // Clínica Médica
            apellidoNombre: "Rodríguez, Jorge",
            documento: "20123456",
            obraSocialId: 5, // Una obra social que no existe en datos_iniciales (se cobra como Particular)
            costoTotal: 15000.00, // Valor de la consulta del Médico 4
            fechaReserva: new Date().toISOString()
        }
    ];
    localStorage.setItem("reservas", JSON.stringify(reservas));
    console.log("Reservas iniciales cargadas");
}