document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // FUNCIÓN PARA ALERTAS BONITAS CON BOOTSTRAP
    // ==========================================
    function mostrarAlerta(mensaje, tipo, contenedorId) {
        const alertaHtml = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

        const contenedor = document.getElementById(contenedorId);
        if (contenedor) {
            contenedor.innerHTML = alertaHtml;

            setTimeout(() => {
                const alerta = contenedor.querySelector('.alert');
                if (alerta) alerta.remove();
            }, 4000);
        }
    }

    // FORMULARIO DE CONTACTO
    const formContacto = document.getElementById('formContacto');
    const btnEnviarOriginal = document.getElementById('btnEnviar');

    if (formContacto) {
        const modalElement = document.getElementById('modalConfirmacion');
        const modalContacto = modalElement ? new bootstrap.Modal(modalElement) : null;

        formContacto.addEventListener('submit', (e) => {
            e.preventDefault();

            if (modalContacto) {
                const nombre = document.getElementById('nombre').value;
                const apellido = document.getElementById('apellido').value;
                const correo = document.getElementById('email').value;
                const textoMensaje = document.getElementById('mensaje').value;

                document.getElementById('verifNombreCompleto').textContent = `${nombre} ${apellido}`;
                document.getElementById('verifEmail').textContent = correo;
                document.getElementById('verifMensaje').textContent = textoMensaje;

                modalContacto.show();
            }
        });

        const btnConfirmarFinalContacto = document.getElementById('btnConfirmarFinal');
        if (btnConfirmarFinalContacto) {
            btnConfirmarFinalContacto.addEventListener('click', async () => {
                if (modalContacto) modalContacto.hide();

                const textoOriginal = btnEnviarOriginal.innerHTML;
                btnEnviarOriginal.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Enviando...';
                btnEnviarOriginal.disabled = true;

                try {
                    // NOTA: Cuando crees tu endpoint de mensajes, usa la ruta relativa aquí
                    mostrarAlerta("Mensaje enviado con éxito", "success", "mensajeContacto");
                    formContacto.reset();
                } catch (error) {
                    console.error('Error:', error);
                    mostrarAlerta("Error de conexión con el servidor", "danger", "mensajeContacto");
                } finally {
                    btnEnviarOriginal.innerHTML = textoOriginal;
                    btnEnviarOriginal.disabled = false;
                }
            });
        }
    }

    // FLUJO DE DONACIONES
    const btnDonar = document.getElementById('btnDonarAhora');

    if (btnDonar) {
        const btnUnaVez = document.getElementById('btnUnaVez');
        const btnMensual = document.getElementById('btnMensual');
        const inputOtraCantidad = document.getElementById('inputOtraCantidad');
        const botonesMonto = document.querySelectorAll('.monto-fijo');

        let frecuenciaActual = 'Una vez';

        const alternarFrecuencia = (activo, inactivo, tipo) => {
            activo.style.backgroundColor = "#212529";
            activo.style.color = "#ffffff";
            activo.classList.add('shadow-sm');

            inactivo.style.backgroundColor = "#f8f9fa";
            inactivo.style.color = "#212529";
            inactivo.classList.remove('shadow-sm');

            frecuenciaActual = tipo;
        };

        if (btnUnaVez && btnMensual) {
            alternarFrecuencia(btnUnaVez, btnMensual, 'Una vez');

            btnUnaVez.addEventListener('click', () => alternarFrecuencia(btnUnaVez, btnMensual, 'Una vez'));
            btnMensual.addEventListener('click', () => alternarFrecuencia(btnMensual, btnUnaVez, 'Mensual'));
        }

        botonesMonto.forEach(boton => {
            boton.addEventListener('click', () => {
                botonesMonto.forEach(b => {
                    b.style.backgroundColor = 'transparent';
                    b.style.color = '#6c757d';
                    b.style.borderColor = '#6c757d';
                });

                boton.style.backgroundColor = 'var(--naranja)';
                boton.style.borderColor = 'var(--naranja)';
                boton.style.color = 'white';

                inputOtraCantidad.value = boton.textContent.replace('S/. ', '').trim();
            });
        });

        btnDonar.addEventListener('click', () => {
            const monto = inputOtraCantidad.value;
            if (!monto || parseFloat(monto) <= 0) {
                inputOtraCantidad.classList.add('is-invalid');
                return;
            }

            const resumenTipo = document.getElementById('resumenTipo');
            const resumenMonto = document.getElementById('resumenMonto');
            if (resumenTipo) resumenTipo.innerText = frecuenciaActual.toUpperCase();
            if (resumenMonto) resumenMonto.innerText = `S/. ${parseFloat(monto).toFixed(2)}`;

            const modalConfirmarDonar = new bootstrap.Modal(document.getElementById('modalConfirmar'));
            modalConfirmarDonar.show();
        });

        const btnConfirmarFinalDonar = document.getElementById('btnConfirmarFinalDonar');
        if (btnConfirmarFinalDonar) {
            btnConfirmarFinalDonar.addEventListener('click', async () => {
                const modalInst = bootstrap.Modal.getInstance(document.getElementById('modalConfirmar'));
                if (modalInst) modalInst.hide();

                const monto = parseFloat(document.getElementById('inputOtraCantidad').value);
                const tipo = frecuenciaActual;
                const donadorId = sessionStorage.getItem('donadorId');

                if (!donadorId) {
                    mostrarAlerta("Debes iniciar sesión para donar", "warning", "mensajeDonacion");
                    setTimeout(() => {
                        window.location.href = '/login'; // CORREGIDO: Ruta limpia del controlador
                    }, 1500);
                    return;
                }

                const elementos = [btnDonar, btnUnaVez, btnMensual, inputOtraCantidad, ...botonesMonto];
                elementos.forEach(el => { if (el) el.disabled = true; });

                btnDonar.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Procesando...`;

                try {
                    // CORREGIDO: Ruta relativa para la API de donaciones
                    const response = await fetch('/api/donaciones/crear', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            monto: monto,
                            tipo: tipo,
                            donadorId: donadorId,
                            campaniaId: 1
                        })
                    });

                    if (response.ok) {
                        mostrarAlerta(`¡Donación de S/. ${monto.toFixed(2)} registrada con éxito!`, "success", "mensajeDonacion");
                        setTimeout(() => {
                            location.reload();
                        }, 1500);
                    } else {
                        mostrarAlerta("Error al registrar la donación", "danger", "mensajeDonacion");
                    }
                } catch (error) {
                    console.error('Error:', error);
                    mostrarAlerta("Error de conexión con el servidor", "danger", "mensajeDonacion");
                } finally {
                    btnDonar.innerHTML = 'Donar ahora';
                    elementos.forEach(el => { if (el) el.disabled = false; });
                }
            });
        }
    }

    // REGISTRO DE USUARIOS
    const formRegistro = document.getElementById('formRegistro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('regNombre').value;
            const email = document.getElementById('regEmail').value;
            const pass = document.getElementById('regPass').value;

            try {
                // CORREGIDO: Ruta relativa para registro
                const response = await fetch('/api/donadores/registrar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombre: nombre,
                        email: email,
                        contrasenia: pass
                    })
                });

                if (response.ok) {
                    mostrarAlerta("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.", "success", "mensajeRegistro");
                    setTimeout(() => {
                        window.location.href = '/login'; // CORREGIDO: Ruta limpia del controlador
                    }, 1500);
                } else {
                    const error = await response.json();
                    mostrarAlerta(error.mensaje || "Error al crear la cuenta", "danger", "mensajeRegistro");
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarAlerta("Error de conexión con el servidor", "danger", "mensajeRegistro");
            }
        });
    }

    // FORMULARIO DE LOGIN
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const pass = document.getElementById('loginPass').value;
            const btnLogin = document.getElementById('btnLogin');

            try {
                btnLogin.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Ingresando...';
                btnLogin.disabled = true;

                // CORREGIDO: Ruta relativa para consultar la API de donadores
                const response = await fetch('/api/donadores');

                if (response.ok) {
                    const donadores = await response.json();
                    const donador = donadores.find(d => d.email === email && d.contrasenia === pass);

                    if (donador) {
                        sessionStorage.setItem('donadorId', donador.id);
                        sessionStorage.setItem('usuarioLogueado', donador.nombre);
                        mostrarAlerta(`¡Bienvenido ${donador.nombre}!`, "success", "mensajeLogin");
                        setTimeout(() => {
                            window.location.href = '/'; // CORREGIDO: Redirige a la raíz del home
                        }, 1500);
                    } else {
                        mostrarAlerta("Correo o contraseña incorrectos", "danger", "mensajeLogin");
                    }
                } else {
                    mostrarAlerta("Error de conexión con el servidor", "danger", "mensajeLogin");
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarAlerta("Error de conexión con el servidor", "danger", "mensajeLogin");
            } finally {
                btnLogin.innerHTML = 'Ingresar';
                btnLogin.disabled = false;
            }
        });
    }

    // ESTADÍSTICAS EN EL HOME
    const cargarEstadisticasImpacto = async () => {
        const seccionCifras = document.querySelector('.seccion-cifras');
        if (!seccionCifras) return;

        try {
            // CORREGIDO: Ruta relativa para estadísticas
            const response = await fetch('/api/donaciones/estadisticas');
            if (response.ok) {
                const stats = await response.json();
                const contadores = seccionCifras.querySelectorAll('.numero');

                if (contadores.length >= 3) {
                    const montoFormateado = Math.floor(stats.totalMonto).toLocaleString('es-PE');
                    contadores[1].textContent = montoFormateado;
                    contadores[2].textContent = stats.totalDonadores;
                }
            }
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    cargarEstadisticasImpacto();

    // MODAL DE RECUPERACIÓN (SI EXISTE EN EL LOGIN)
    const linkOlvidaste = document.getElementById('linkOlvidaste');
    const modalForgot = document.getElementById('modalForgot');
    const btnEnviarReset = document.getElementById('btnEnviarReset');
    const btnCerrarModal = document.getElementById('btnCerrarModal');
    const mensajeReset = document.getElementById('mensajeReset');

    if (linkOlvidaste && modalForgot) {
        linkOlvidaste.addEventListener('click', (e) => {
            e.preventDefault();
            modalForgot.style.display = 'flex';
        });

        if (btnCerrarModal) {
            btnCerrarModal.addEventListener('click', () => {
                modalForgot.style.display = 'none';
                if (mensajeReset) mensajeReset.innerHTML = '';
                if (document.getElementById('emailReset')) document.getElementById('emailReset').value = '';
            });
        }

        if (btnEnviarReset) {
            btnEnviarReset.addEventListener('click', async () => {
                const email = document.getElementById('emailReset').value;

                if (!email) {
                    mostrarAlerta("Ingresa tu correo electrónico", "warning", "mensajeReset");
                    return;
                }

                btnEnviarReset.disabled = true;
                btnEnviarReset.innerHTML = 'Enviando...';

                try {
                    // CORREGIDO: Ruta relativa para recuperar contraseña
                    const response = await fetch('/api/donadores/forgot-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        mostrarAlerta(data.mensaje, "success", "mensajeReset");
                        document.getElementById('emailReset').value = '';
                    } else {
                        mostrarAlerta(data.error || "Error al enviar", "danger", "mensajeReset");
                    }
                } catch (error) {
                    console.error('Error:', error);
                    mostrarAlerta("Error de conexión con el servidor", "danger", "mensajeReset");
                } finally {
                    btnEnviarReset.disabled = false;
                    btnEnviarReset.innerHTML = 'Enviar instrucciones';
                }
            });
        }
    }

});