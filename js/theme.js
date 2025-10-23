// Obtener el body
const body = document.body;

// Recuperar tema guardado
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }
}

// Manejar botón si existe
const btn = document.getElementById('theme-toggle');
if (btn) {
  // Actualizar texto del botón según tema guardado
  btn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  // Cambiar tema al hacer click
  btn.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
      body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
      btn.textContent = '🌙';
    } else {
      body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
      btn.textContent = '☀️';
    }
  });
}
