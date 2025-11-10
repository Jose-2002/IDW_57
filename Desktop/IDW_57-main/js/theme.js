document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const body = document.body;
    
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = html.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    function applyTheme(theme) {
        html.setAttribute('data-bs-theme', theme);
        body.style.backgroundColor = theme === 'dark' ? '#1a1d20' : '#ffffff';
        themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
        themeToggle.classList.toggle('btn-outline-light', theme === 'light');
        themeToggle.classList.toggle('btn-outline-dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }
});
