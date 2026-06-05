document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. FORMULARIO DE CONTACTO (Acerca de)
       ========================================== */
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

                const nombre = document.getElementById('nombre').value;
                const apellido = document.getElementById('apellido').value;
                const correo = document.getElementById('email').value;
                const textoMensaje = document.getElementById('mensaje').value;

                const textoOriginal = btnEnviarOriginal.innerHTML;
                btnEnviarOriginal.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Enviando...';
                btnEnviarOriginal.disabled = true;

                try {
                    //(falta endpoint de mensajes)
                    /* 
                    const response = await fetch('http://localhost:8080/api/mensajes/contacto', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            nombre: nombre,
                            apellido: apellido,
                            email: correo,
                            mensaje: textoMensaje
                        })
                    });

                    if (response.ok) {
                        alert("¡Mensaje enviado con éxito!");
                        formContacto.reset();
                    } else {
                        alert("Error al enviar el mensaje");
                    }
                    */
                    alert("Mensaje enviado con éxito (demo)");
                    formContacto.reset();
                } catch (error) {
                    console.error('Error:', error);
                    alert("Error de conexión con el servidor");
                } finally {
                    btnEnviarOriginal.innerHTML = textoOriginal;
                    btnEnviarOriginal.disabled = false;
                }
            });
        }
    }

    /* ==========================================
       2. LÓGICA PARA DONACIONES (Página Donar)
       ========================================== */
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
                    alert("Debes iniciar sesión para donar");
                    window.location.href = 'login.html';
                    return;
                }

                const elementos = [btnDonar, btnUnaVez, btnMensual, inputOtraCantidad, ...botonesMonto];
                elementos.forEach(el => { if (el) el.disabled = true; });

                btnDonar.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Procesando...`;

                try {
                    const response = await fetch('http://localhost:8080/api/donaciones/crear', {
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
                        alert(`¡Donación de S/. ${monto.toFixed(2)} registrada con éxito!`);
                        location.reload();
                    } else {
                        alert("Error al registrar la donación");
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert("Error de conexión con el servidor");
                }
            });
        }
    }

    /* ==========================================
       3. LÓGICA DE REGISTRO (PostgreSQL)
       ========================================== */
    const formRegistro = document.getElementById('formRegistro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('regNombre').value;
            const email = document.getElementById('regEmail').value;
            const pass = document.getElementById('regPass').value;

            try {
                const response = await fetch('http://localhost:8080/api/donadores/registrar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombre: nombre,
                        email: email,
                        telefono: pass  //  Guarda la contraseña en teléfono (temporal)
                    })
                });

                if (response.ok) {
                    alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
                    window.location.href = 'login.html';
                } else {
                    const error = await response.json();
                    alert(error.mensaje || "Error al crear la cuenta");
                }
            } catch (error) {
                console.error('Error:', error);
                alert("Error de conexión con el servidor");
            }
        });
    }

    /* ==========================================
       4. LÓGICA DE LOGIN (PostgreSQL)
       ========================================== */
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

                const response = await fetch('http://localhost:8080/api/donadores');
                
                if (response.ok) {
                    const donadores = await response.json();
                    //  Busca por email y contraseña (guardada en telefono)
                    const donador = donadores.find(d => d.email === email && d.telefono === pass);
                    
                    if (donador) {
                        sessionStorage.setItem('donadorId', donador.id);
                        sessionStorage.setItem('usuarioLogueado', donador.nombre);
                        window.location.href = 'index.html';
                    } else {
                        alert("Correo o contraseña incorrectos");
                    }
                } else {
                    alert("Error de conexión con el servidor");
                }
            } catch (error) {
                console.error('Error:', error);
                alert("Error de conexión con el servidor");
            } finally {
                btnLogin.innerHTML = 'Ingresar';
                btnLogin.disabled = false;
            }
        });
    }

    /* ==========================================
       5. ACTUALIZACIÓN DINÁMICA DE CIFRAS
       ========================================== */
    const cargarEstadisticasImpacto = async () => {
        const seccionCifras = document.querySelector('.seccion-cifras');
        if (!seccionCifras) return; // Solo ejecutar si existe la sección (index.html)

        try {
            const response = await fetch('http://localhost:8080/api/donaciones/estadisticas');
            if (response.ok) {
                const stats = await response.json();
                const contadores = seccionCifras.querySelectorAll('.numero');
                
                // En index.html: Index 0 = Familias, Index 1 = Dinero, Index 2 = Donadores
                if (contadores.length >= 3) {
                    // Formatear monto: si es 1500.50 -> 1,500
                    const montoFormateado = Math.floor(stats.totalMonto).toLocaleString('es-PE');
                    
                    // Actualizamos solo los valores que vienen de la base de datos
                    contadores[1].textContent = montoFormateado;
                    contadores[2].textContent = stats.totalDonadores;
                }
            }
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    cargarEstadisticasImpacto();
});