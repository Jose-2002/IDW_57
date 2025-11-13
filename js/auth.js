// Usuario local
const usuariosLocales = [
    { usuario: "superadmin", clave: "1234", rol: "superadmin" }
];

//LOGIN
async function iniciarSesion(usuario, clave) {
    try {
        //Verificar si es un usuario local
        const usuarioLocal = usuariosLocales.find(u => u.usuario === usuario && u.clave === clave);
        if (usuarioLocal) {
            sessionStorage.setItem('usuarioLogeado', usuarioLocal.usuario);
            sessionStorage.setItem('rol', usuarioLocal.rol);
            window.location.href = 'administracion.html';
            return;
        }

        // Si no es local, intentar autenticación con DummyJSON
        const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usuario, password: clave })
        });

        if (!response.ok) throw new Error('Usuario o contraseña incorrectos');

        const data = await response.json();

        //Detalles del usuario (DummyJSON)
        const detallesResponse = await fetch(`https://dummyjson.com/users/${data.id}`, {
            headers: { 'Authorization': `Bearer ${data.token}` }
        });
        const detalles = await detallesResponse.json();

        //Asignar rol desde DummyJSON
        const rol = detalles.role || 'user'; // Por defecto "user"

        //Guardar sesión
        sessionStorage.setItem('usuarioLogeado', data.username);
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('rol', rol);

        //Redirigir
        window.location.href = 'administracion.html';

    } catch (error) {
        const loginError = document.getElementById('login-error');
        if (loginError) loginError.textContent = error.message;
        console.error('Error de inicio de sesión:', error);
    }
}

//VERIFICAR SESIÓN
function verificarSesion() {
    const paginaActual = window.location.pathname.split("/").pop();
    if (paginaActual !== "login.html") {
        const usuarioLogeado = sessionStorage.getItem('usuarioLogeado');
        const rol = sessionStorage.getItem('rol');

        if (!usuarioLogeado) {
            window.location.href = 'login.html';
            return;
        }

        //Mostrar usuario logueado con botón logout
        const navbar = document.querySelector('.navbar-nav');
        if (navbar && !document.getElementById('logout-btn')) {
            const liBienvenida = document.createElement('li');
            liBienvenida.classList.add('nav-item');
            liBienvenida.innerHTML = `
                <span class="nav-link text-dark">
                    Bienvenido, ${usuarioLogeado} (${rol})
                </span>
            `;
            navbar.appendChild(liBienvenida);

            const liLogout = document.createElement('li');
            liLogout.classList.add('nav-item');
            liLogout.innerHTML = `
                <button id="logout-btn" class="btn btn-outline-danger btn-sm ms-2">
                    Cerrar sesión
                </button>
            `;
            navbar.appendChild(liLogout);

            document.getElementById('logout-btn').addEventListener('click', cerrarSesion);
        }

        //Control de acceso a Administración
        if (paginaActual === "administracion.html") {
    if (rol === "user") {
        // Ocultar todos los botones de acción menos "Usuarios"
        const botonesAccion = document.querySelectorAll('.btn-action');
        botonesAccion.forEach(el => {
            if (!/usuarios/i.test(el.textContent.trim().toLowerCase())) {
                el.style.display = 'none';
            }
        });

        // Mostrar aviso
        const contenedor = document.querySelector('main') || document.body;
        const aviso = document.createElement('div');
        aviso.className = 'alert alert-info text-center mt-3';
        aviso.textContent = 'Modo usuario: solo acceso a la sección "Usuarios"';
        contenedor.prepend(aviso);
    }
}

        //Ocultar botones del superadmin
        if (rol !== 'superadmin') {
            const botonesPrivados = document.querySelectorAll('.btn-admin-super');
            botonesPrivados.forEach(btn => btn.style.display = 'none');
        }
    }
}


//CERRAR SESIÓN
function cerrarSesion() {
    sessionStorage.clear();
    window.location.href = '../index.html';
}

//CARGAR USUARIOS (solo si estamos en usuarios.html)
async function cargarUsuarios() {
    const tablaUsuarios = document.querySelector("#tablaUsuarios tbody");
    if (!tablaUsuarios) return; // Evita errores si no hay tabla

    try {
        const respuesta = await fetch("https://dummyjson.com/users");
        const datos = await respuesta.json();
        const usuarios = datos.users;

        const rol = sessionStorage.getItem('rol');

        // Cabecera si es superadmin
        const cabecera = document.querySelector("#tablaUsuarios thead tr");
        if (cabecera && rol === "superadmin" && !document.querySelector("#columnaPass")) {
            const th = document.createElement("th");
            th.id = "columnaPass";
            th.textContent = "Contraseña";
            cabecera.appendChild(th);
        }

        tablaUsuarios.innerHTML = "";

        usuarios.forEach(usuario => {
            const fila = document.createElement("tr");

            let contenido = `
                <td>${usuario.firstName}</td>
                <td>${usuario.lastName}</td>
                <td>${usuario.username}</td>
                <td>${usuario.email}</td>
                <td>${usuario.phone}</td>
            `;

            if (rol === "superadmin") {
                contenido += `<td>${usuario.password || '<span class="text-muted">N/A</span>'}</td>`;
            }

            fila.innerHTML = contenido;
            tablaUsuarios.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        const tablaUsuarios = document.querySelector("#tablaUsuarios tbody");
        if (tablaUsuarios) {
            tablaUsuarios.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger">
                        ❌ Error al cargar los usuarios. Intente nuevamente más tarde.
                    </td>
                </tr>`;
        }
    }
}


//EVENTO SUBMIT LOGIN
const formularioLogin = document.getElementById('form');
if (formularioLogin) {
    formularioLogin.addEventListener('submit', function (event) {
        event.preventDefault();
        const usuario = document.getElementById('usuario').value.trim();
        const clave = document.getElementById('clave').value.trim();
        iniciarSesion(usuario, clave);
    });
}

//INICIALIZACIONES
document.addEventListener('DOMContentLoaded', () => {
    verificarSesion();
    cargarUsuarios();
});
