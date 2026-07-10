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
                const campaniaSelect = document.getElementById('selectCampania');
                const campaniaId = campaniaSelect.value ? parseInt(campaniaSelect.value, 10) : null;

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
                            campaniaId: campaniaId
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
                        sessionStorage.setItem('usuarioRol', donador.rol); // Guardamos el rol del usuario
                        mostrarAlerta(`¡Bienvenido ${donador.nombre}!`, "success", "mensajeLogin");
                        setTimeout(() => {
                            window.location.href = '/home'; // CORREGIDO: Redirige a la nueva ruta del home
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

    // ==========================================
    // FUNCIÓN PARA ANIMAR NÚMEROS (CONTADOR)
    // ==========================================
    function animarContador(elemento, valorFinal, duracion = 2000) {
        let inicio = null;
        const obj = elemento;

        const step = (timestamp) => {
            if (!inicio) inicio = timestamp;
            const progreso = Math.min((timestamp - inicio) / duracion, 1);
            const valorActual = Math.floor(progreso * valorFinal);

            // Formatea el número con separadores de miles para mejor lectura
            obj.textContent = valorActual.toLocaleString('es-PE');

            if (progreso < 1) {
                window.requestAnimationFrame(step);
            } else {
                // Asegura que el valor final se muestre correctamente formateado
                obj.textContent = valorFinal.toLocaleString('es-PE');
            }
        };
        window.requestAnimationFrame(step);
    }

    // ESTADÍSTICAS EN EL HOME CON ANIMACIÓN AL SER VISIBLE
    const cargarEstadisticasImpacto = async () => {
        const seccionCifras = document.querySelector('.seccion-cifras');
        if (!seccionCifras) return;

        const observer = new IntersectionObserver(async (entries, observer) => {
            if (entries[0].isIntersecting) {
                try {
                    const response = await fetch('/api/donaciones/estadisticas');
                    if (response.ok) {
                        const stats = await response.json();
                        const contadores = seccionCifras.querySelectorAll('.numero');

                        if (contadores.length >= 3) {
                            animarContador(contadores[1], Math.floor(stats.totalMonto));
                            animarContador(contadores[2], stats.totalDonadores);
                        }
                    }
                } catch (error) {
                    console.error('Error al cargar estadísticas:', error);
                }
                observer.unobserve(seccionCifras); // La animación se ejecuta una sola vez
            }
        }, { threshold: 0.5 }); // Se activa cuando el 50% de la sección es visible

        observer.observe(seccionCifras);
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

    // ================================================================
    // GESTIÓN DE SESIÓN DE USUARIO EN EL NAVBAR Y PÁGINA DE PERFIL
    // ================================================================

    const gestionarSesionNavbar = () => {
        const usuarioLogueado = sessionStorage.getItem('usuarioLogueado');
        const navUsuario = document.getElementById('nav-usuario');

        if (usuarioLogueado && navUsuario) {
            // Si el usuario está logueado, muestra el menú de perfil
            navUsuario.innerHTML = `
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle btn-ingresar rounded fw-bold py-1 px-3" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-person-circle me-1"></i> Hola, ${usuarioLogueado}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" href="/perfil">Mi Perfil</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" id="btnLogout">Cerrar Sesión</a></li>
                    </ul>
                </li>
            `;

            // Añadir evento para cerrar sesión
            const btnLogout = document.getElementById('btnLogout');
            if (btnLogout) {
                btnLogout.addEventListener('click', (e) => {
                    e.preventDefault();
                    sessionStorage.removeItem('donadorId');
                    sessionStorage.removeItem('usuarioLogueado');
                    window.location.href = '/login';
                });
            }
        }
    };

    const cargarDatosPerfil = async () => {
        const perfilContainer = document.getElementById('perfil-container');
        if (!perfilContainer) return;

        const donadorId = sessionStorage.getItem('donadorId');
        if (!donadorId) {
            window.location.href = '/login'; // Si no hay sesión, redirige al login
            return;
        }

        try {
            // Obtener datos del donador
            const donadorResponse = await fetch(`/api/donadores/${donadorId}`);
            if (donadorResponse.ok) {
                const donador = await donadorResponse.json();
                document.getElementById('perfil-nombre').textContent = donador.nombre;
                document.getElementById('perfil-email').textContent = donador.email;
            }

            // Obtener donaciones del donador
            const donacionesResponse = await fetch(`/api/donaciones/donador/${donadorId}`);
            if (donacionesResponse.ok) {
                const donaciones = await donacionesResponse.json();
                const lista = document.getElementById('perfil-donaciones-lista');
                lista.innerHTML = donaciones.map(d => {
                    const destino = d.campania
                        ? `a la campaña <strong>"${d.campania.nombre}"</strong>`
                        : 'a la <strong>Fundación</strong>';
                    return `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span>Donación de <strong>S/. ${d.monto.toFixed(2)}</strong> ${destino}</span>
                            <span class="badge bg-success rounded-pill">${new Date(d.fechaDonacion).toLocaleDateString()}</span>
                        </li>`;
                }).join('') || '<li class="list-group-item">Aún no has realizado donaciones.</li>';
            }
        } catch (error) {
            console.error('Error al cargar datos del perfil:', error);
        }
    };

    const gestionarCambioPassword = () => {
        const form = document.getElementById('formCambiarPass');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const passActual = document.getElementById('pass-actual').value;
            const passNueva = document.getElementById('pass-nueva').value;
            const passConfirmar = document.getElementById('pass-confirmar').value;
            const donadorId = sessionStorage.getItem('donadorId');

            if (passNueva !== passConfirmar) {
                mostrarAlerta("Las nuevas contraseñas no coinciden.", "warning", "mensajeCambioPass");
                return;
            }

            if (!donadorId) {
                window.location.href = '/login';
                return;
            }

            const btn = document.getElementById('btnCambiarPass');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Guardando...';

            try {
                const response = await fetch('/api/donadores/cambiar-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        donadorId: donadorId,
                        passActual: passActual,
                        passNueva: passNueva
                    })
                });

                const resultado = await response.json();

                if (response.ok) {
                    mostrarAlerta(resultado.mensaje, "success", "mensajeCambioPass");
                    form.reset();
                } else {
                    mostrarAlerta(resultado.error, "danger", "mensajeCambioPass");
                }
            } catch (error) {
                mostrarAlerta("Error de conexión con el servidor.", "danger", "mensajeCambioPass");
            } finally {
                btn.disabled = false;
                btn.innerHTML = 'Guardar Cambios';
            }
        });
    };

    // ==========================================
    // GESTIÓN DE CAMPAÑAS
    // ==========================================

    const cargarCampanias = async () => {
        const listaCampanias = document.getElementById('lista-campanias');
        if (!listaCampanias) return;

        try {
            const response = await fetch('/api/campanias/activas');
            if (response.ok) {
                const campanias = await response.json();

                // Filtra campañas cuya fecha de finalización ya pasó
                const campaniasActivas = campanias.filter(c => {
                    return c.fechaFin ? new Date(c.fechaFin) >= new Date() : true;
                });

                if (campaniasActivas.length > 0) {
                    listaCampanias.innerHTML = campaniasActivas.map(c => {
                        const metaAlcanzada = c.recaudadoActual >= c.metaRecaudacion;
                        const progreso = metaAlcanzada ? 100 : (c.recaudadoActual / c.metaRecaudacion) * 100;

                        let botonHTML;
                        if (metaAlcanzada) {
                            botonHTML = `
                                <button class="btn btn-success mt-auto" disabled>
                                    <i class="bi bi-check-circle-fill me-1"></i> ¡Meta Alcanzada!
                                </button>
                            `;
                        } else {
                            botonHTML = `
                                <button class="btn btn-outline-dark mt-auto" 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#modalDonarCampania"
                                        data-bs-campaign-id="${c.id}"
                                        data-bs-campaign-name="${c.nombre}">Donar a esta causa</button>
                            `;
                        }

                        return `
                            <div class="col-md-6 col-lg-4">
                                <div class="card h-100 shadow-sm border-0">
                                    <div class="card-body d-flex flex-column">
                                        <h5 class="card-title fw-bold">${c.nombre}</h5>
                                        <p class="card-text small text-muted flex-grow-1">${c.descripcion}</p>
                                        <div class="mb-3">
                                            <div class="d-flex justify-content-between small">
                                                <span>S/. ${c.recaudadoActual.toLocaleString('es-PE')}</span>
                                                <span>S/. ${c.metaRecaudacion.toLocaleString('es-PE')}</span>
                                            </div>
                                            <div class="progress" style="height: 8px;">
                                                <div class="progress-bar ${metaAlcanzada ? 'bg-warning' : 'bg-success'}" role="progressbar" style="width: ${progreso.toFixed(2)}%;" aria-valuenow="${progreso.toFixed(2)}" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                        ${botonHTML}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('');
                } else {
                    listaCampanias.innerHTML = '<p class="text-center">No hay campañas activas en este momento.</p>';
                }
            }
        } catch (error) {
            console.error('Error al cargar campañas:', error);
            listaCampanias.innerHTML = '<p class="text-center text-danger">No se pudieron cargar las campañas.</p>';
        }
    };

    const gestionarCreacionCampania = () => {
        const form = document.getElementById('formCrearCampania');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Ajuste: Convertir la fecha a un formato ISO con hora para que coincida con LocalDateTime en Java
            if (data.fechaFin) {
                data.fechaFin = new Date(data.fechaFin).toISOString();
            }

            const response = await fetch('/api/campanias/crear', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                window.location.href = '/campanias';
            } else {
                mostrarAlerta('Error al crear la campaña.', 'danger', 'mensajeCrearCampania');
            }
        });
    };

    const gestionarModalDonacionCampania = () => {
        const modalElement = document.getElementById('modalDonarCampania');
        if (!modalElement) return;

        const modal = new bootstrap.Modal(modalElement);
        const inputMonto = document.getElementById('inputMontoModal');
        const botonesMontoModal = document.querySelectorAll('.monto-fijo-modal');
        let campaniaIdActual = null;

        // 1. Capturar datos cuando se abre el modal
        modalElement.addEventListener('show.bs.modal', (event) => {
            const button = event.relatedTarget;
            campaniaIdActual = button.getAttribute('data-bs-campaign-id');
            const campaignName = button.getAttribute('data-bs-campaign-name');

            const modalTitle = modalElement.querySelector('.modal-title');
            modalTitle.textContent = `Donar a: ${campaignName}`;

            // Limpiar estado previo
            inputMonto.value = '';
            document.getElementById('mensajeDonacionModal').innerHTML = '';
            botonesMontoModal.forEach(b => {
                b.classList.remove('active', 'btn-dark');
                b.classList.add('btn-outline-secondary');
            });
        });

        // 2. Lógica de selección de montos
        botonesMontoModal.forEach(boton => {
            boton.addEventListener('click', () => {
                botonesMontoModal.forEach(b => {
                    b.classList.remove('active', 'btn-dark');
                    b.classList.add('btn-outline-secondary');
                });
                boton.classList.add('active', 'btn-dark');
                boton.classList.remove('btn-outline-secondary');
                inputMonto.value = boton.textContent.replace('S/. ', '').trim();
            });
        });

        // 3. Lógica para confirmar y enviar la donación
        const btnConfirmar = document.getElementById('btnConfirmarDonacionModal');
        btnConfirmar.addEventListener('click', async () => {
            const monto = parseFloat(inputMonto.value);
            const donadorId = sessionStorage.getItem('donadorId');

            if (!donadorId) {
                mostrarAlerta("Debes iniciar sesión para poder donar.", "warning", "mensajeDonacionModal");
                setTimeout(() => { window.location.href = '/login'; }, 2000);
                return;
            }

            if (!monto || monto <= 0) {
                mostrarAlerta("Por favor, ingresa un monto válido.", "danger", "mensajeDonacionModal");
                return;
            }

            btnConfirmar.disabled = true;
            btnConfirmar.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Procesando...';

            try {
                const response = await fetch('/api/donaciones/crear', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        monto: monto,
                        tipo: 'Una vez', // O podrías añadir opción mensual en el modal
                        donadorId: donadorId,
                        campaniaId: campaniaIdActual
                    })
                });

                if (response.ok) {
                    mostrarAlerta(`¡Gracias! Tu donación de S/. ${monto.toFixed(2)} ha sido registrada.`, "success", "mensajeDonacionModal");
                    setTimeout(() => {
                        modal.hide();
                        cargarCampanias(); // Recargar las campañas para ver el progreso actualizado
                    }, 2000);
                } else {
                    mostrarAlerta("Hubo un error al procesar tu donación.", "danger", "mensajeDonacionModal");
                }
            } catch (error) {
                console.error('Error al donar desde modal:', error);
                mostrarAlerta("Error de conexión. Inténtalo de nuevo.", "danger", "mensajeDonacionModal");
            } finally {
                btnConfirmar.disabled = false;
                btnConfirmar.innerHTML = 'Confirmar Donación';
            }
        });
    };

    const cargarCampaniasEnSelect = async () => {
        const select = document.getElementById('selectCampania');
        if (!select) return;

        try {
            const response = await fetch('/api/campanias/activas');
            if (response.ok) {
                const campanias = await response.json();
                campanias.forEach(c => {
                    const option = document.createElement('option');
                    option.value = c.id;
                    option.textContent = c.nombre;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error al cargar campañas en el select:', error);
        }
    };

    const gestionarVisibilidadAdmin = () => {
        const rol = sessionStorage.getItem('usuarioRol');
        const elementosAdmin = document.querySelectorAll('.admin-only');

        if (rol !== 'ADMIN') {
            elementosAdmin.forEach(el => {
                el.style.display = 'none';
            });
        } else {
            elementosAdmin.forEach(el => {
                el.style.display = ''; // Muestra los elementos si es admin
            });
        }
    };

    // Ejecutar al cargar la página
    gestionarSesionNavbar();
    cargarDatosPerfil();
    gestionarCambioPassword();
    cargarCampanias();
    gestionarCreacionCampania();
    gestionarModalDonacionCampania();
    cargarCampaniasEnSelect();
    gestionarVisibilidadAdmin();
});