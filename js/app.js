document.addEventListener('DOMContentLoaded', () => {
    
    const formulario = document.getElementById('formulario-tecnico') || document.getElementById('formulario-pedido');
    
    let claveStorage = '';
    if (document.getElementById('formulario-tecnico')) claveStorage = 'tickets_soporte';
    if (document.getElementById('formulario-pedido')) claveStorage = 'reservas_servidores';

    const mostrarHistorial = () => {
        const contenedorHistorial = document.getElementById('historial-registros');
        if (!contenedorHistorial) return;

        const registros = JSON.parse(localStorage.getItem(claveStorage)) || [];

        if (registros.length === 0) {
            contenedorHistorial.innerHTML = '<p style="color: var(--texto-mutado); font-style: italic;">No hay registros previos guardados en el almacenamiento local.</p>';
            return;
        }

        let htmlHTML = '<h3 style="margin-top: 1.5rem; font-size: 1.15rem; color: var(--neon-azul);">Historial Local (Guardado en localStorage):</h3><ul style="list-style: none; padding: 0; margin-top: 0.5rem;">';
        registros.forEach((item, index) => {
            htmlHTML += `
                <li style="background: #11141a; border: 1px solid var(--bordes); padding: 0.75rem; margin-bottom: 0.5rem; border-radius: 4px; font-size: 0.9rem;">
                    <strong>#${index + 1} - ${item.fecha}</strong><br>
                    <span style="color: var(--texto-brillante)">Usuario:</span> ${item.nombre} (${item.correo})<br>
                    <span style="color: var(--texto-brillante)">Detalle:</span> ${item.servicio} - "${item.mensaje}"
                </li>
            `;
        });
        htmlHTML += '</ul>';
        contenedorHistorial.innerHTML = htmlHTML;
    };

    mostrarHistorial();
    
    if (formulario) {
        formulario.addEventListener('submit', (evento) => {
            let tieneErrores = false;

            const nombre = document.getElementById('nombre');
            const correo = document.getElementById('correo');
            const motor = document.getElementById('motor');
            const mensaje = document.getElementById('mensaje');

            [nombre, correo, motor, mensaje].forEach(campo => {
                if (campo) {
                    campo.setAttribute('aria-invalid', 'false');
                    const contenedorError = document.getElementById(`error-${campo.id}`);
                    if (contenedorError) contenedorError.textContent = '';
                }
            });

            if (!nombre || nombre.value.trim() === '') {
                nombre.setAttribute('aria-invalid', 'true');
                document.getElementById('error-nombre').textContent = '!! Error: El campo de nombre es obligatorio.';
                tieneErrores = true;
            }

            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!correo || correo.value.trim() === '') {
                correo.setAttribute('aria-invalid', 'true');
                document.getElementById('error-correo').textContent = '!! Error: El correo electrónico es obligatorio.';
                tieneErrores = true;
            } else if (!regexEmail.test(correo.value.trim())) {
                correo.setAttribute('aria-invalid', 'true');
                document.getElementById('error-correo').textContent = '!! Error: Formato de correo no válido.';
                tieneErrores = true;
            }

            if (!motor || motor.value === '') {
                motor.setAttribute('aria-invalid', 'true');
                document.getElementById('error-motor').textContent = '!! Error: Debe seleccionar una opción técnica.';
                tieneErrores = true;
            }

            if (!mensaje || mensaje.value.trim() === '') {
                mensaje.setAttribute('aria-invalid', 'true');
                document.getElementById('error-mensaje').textContent = '!! Error: La descripción técnica es obligatoria.';
                tieneErrores = true;
            }

            if (tieneErrores) {
                evento.preventDefault();
                const primerError = formulario.querySelector('[aria-invalid="true"]');
                if (primerError) primerError.focus();
            } else {
                evento.preventDefault();

                const nuevoRegistro = {
                    nombre: nombre.value.trim(),
                    correo: correo.value.trim(),
                    servicio: motor.options[motor.selectedIndex].text,
                    mensaje: mensaje.value.trim(),
                    fecha: new Date().toLocaleString()
                };

                const historialExistente = JSON.parse(localStorage.getItem(claveStorage)) || [];
                historialExistente.push(nuevoRegistro);
                localStorage.setItem(claveStorage, JSON.stringify(historialExistente));

                formulario.reset();
                mostrarHistorial();
                alert(' ¡Datos procesados e insertados con éxito en el LocalStorage de la aplicación!');
            }
        });
    }

    const preguntasAcordeon = document.querySelectorAll('.item-acordeon h3');
    
    preguntasAcordeon.forEach(pregunta => {
        const panel = pregunta.parentElement.querySelector('.panel');
        
        if (panel) {
            panel.hidden = true;
        }
        pregunta.setAttribute('aria-expanded', 'false');
        pregunta.style.cursor = 'pointer';

        pregunta.addEventListener('click', () => {
            const panelAsociado = pregunta.parentElement.querySelector('.panel');
            if (panelAsociado) {
                const estaAbierto = pregunta.getAttribute('aria-expanded') === 'true';
                pregunta.setAttribute('aria-expanded', !estaAbierto);
                panelAsociado.hidden = estaAbierto;
            }
        });
    });
});


