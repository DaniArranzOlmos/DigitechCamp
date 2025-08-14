(function () {
    const tagsInput = document.querySelector('#tags_input');
    if (tagsInput) {
        const tagsDiv = document.querySelector('#tags');
        const tagsInputHidden = document.querySelector('[name="tags"]');

        let tags = [];

        if(tagsInputHidden.value !== '') {
            tags = tagsInputHidden.value.split(',');
            console.log(tagsInputHidden.value.split(','));
            mostrarTags();
        }

        tagsInput.addEventListener('keypress', guardarTag);

        function guardarTag(e) {
            if (e.keyCode === 44) { // tecla coma
                if (e.target.value.trim() === '') {
                    return;
                }
                e.preventDefault();
                tags = [...tags, e.target.value.trim()];
                tagsInput.value = '';
                mostrarTags();
            }
        }

        function mostrarTags() {
            tagsDiv.textContent = '';
        
            // Filtrar valores vacíos o el valor "0" (como cadena de texto)
            tags = tags.filter(tag => tag.trim() !== '' && tag !== '0');
        
            if (tags.length > 0) {
                tags.forEach(tag => {
                    const etiqueta = document.createElement('LI');
                    etiqueta.classList.add('formulario__tag');
                    etiqueta.textContent = tag;
                    etiqueta.ondblclick = eliminarTag;
                    tagsDiv.appendChild(etiqueta);
                });
            }
        
            actualizarInputHidden();
        }
        
        

        function eliminarTag(e) {
            tags = tags.filter(tag => tag !== e.target.textContent);
            mostrarTags();
        }

        function actualizarInputHidden() {
            tagsInputHidden.value = tags.join(',');
        }
    }
})();
(function(){
    const horas = document.querySelector('#horas')

    if(horas) {
        const categoria = document.querySelector('[name="categoria_id"]')
        const dias = document.querySelectorAll('[name="dia"]');
        const inputHiddenDia = document.querySelector('[name="dia_id"]');
        const inputHiddenHora = document.querySelector('[name="hora_id"]');

        categoria.addEventListener('change', terminoBusqueda)
        dias.forEach( dia => dia.addEventListener('change', terminoBusqueda))


        let busqueda = {
            categoria_id: +categoria.value || '',
            dia: +inputHiddenDia.value || ''
        }

                
        if(!Object.values(busqueda).includes('')) {
            async function iniciarApp () {
                await buscarEventos();

                const id = inputHiddenHora.value;

                // Resaltar la hora actual
                const horaSeleccionada = document.querySelector(`[data-hora-id="${id}"]`)
                horaSeleccionada.classList.remove('horas__hora--deshabilitada')
                horaSeleccionada.classList.add('horas__hora--seleccionada')

                horaSeleccionada.onclick = seleccionarHora;
            }
            iniciarApp();
        }

        function terminoBusqueda(e) {
            busqueda[e.target.name] = e.target.value;

            // Reiniciar los campos ocultos y el selector de horas
            inputHiddenHora.value = '';
            inputHiddenDia.value = '';
            
            const horaPrevia = document.querySelector('.horas__hora--seleccionada')
            if(horaPrevia) {
                horaPrevia.classList.remove('horas__hora--seleccionada')
            }

            if(Object.values(busqueda).includes('')) {
                return
            }

            buscarEventos();
        }

        async function buscarEventos() {
            const { dia, categoria_id } = busqueda
            const url = `/api/eventos-horario?dia_id=${dia}&categoria_id=${categoria_id}`;

            const resultado = await fetch(url);
            const eventos = await resultado.json();
            obtenerHorasDisponibles(eventos);
        }

        function obtenerHorasDisponibles(eventos) {
            // Reiniciar las horas
            const listadoHoras = document.querySelectorAll('#horas li');
            listadoHoras.forEach(li => li.classList.add('horas__hora--deshabilitada'))

            // Comprobar eventos ya tomados, y quitar la variable de deshabilitado
            const horasTomadas = eventos.map( evento => evento.hora_id);            
            const listadoHorasArray = Array.from(listadoHoras);

            const resultado = listadoHorasArray.filter( li =>  !horasTomadas.includes(li.dataset.horaId) );
            resultado.forEach( li => li.classList.remove('horas__hora--deshabilitada'))

            const horasDisponibles = document.querySelectorAll('#horas li:not(.horas__hora--deshabilitada)');
            horasDisponibles.forEach( hora => hora.addEventListener('click', seleccionarHora));
        }

        function seleccionarHora(e) {
            // Deshabilitar la hora previa, si hay un nuevo click
            const horaPrevia = document.querySelector('.horas__hora--seleccionada')
            if(horaPrevia) {
                horaPrevia.classList.remove('horas__hora--seleccionada')
            }

            // Agregar clase de seleccionado
            e.target.classList.add('horas__hora--seleccionada')

            inputHiddenHora.value = e.target.dataset.horaId

            // Llenar el campo oculto de dia
            inputHiddenDia.value = document.querySelector('[name="dia"]:checked').value
        }
    }
    
})();
(function() {
    const ponentesInput = document.querySelector('#ponentes');

    if(ponentesInput) {
        let ponentes = [];
        let ponentesFiltrados = [];

        const listadoPonentes = document.querySelector('#listado-ponentes')
        const ponenteHidden = document.querySelector('[name="ponente_id"]')

        obtenerPonentes();
        ponentesInput.addEventListener('input', buscarPonentes)

        if(ponenteHidden.value) {
            async function iniciarApp () {
                const ponente = await obtenerPonente(ponenteHidden.value)
                const {nombre, apellido} = ponente

                // Insertar en el HTML
                const ponenteDOM = document.createElement('LI');
                ponenteDOM.classList.add('listado-ponentes__ponente', 'listado-ponentes__ponente--seleccionado');
                ponenteDOM.textContent = `${nombre} ${apellido}`

                listadoPonentes.appendChild(ponenteDOM)
           }
           iniciarApp();
        }

        async function obtenerPonentes() {
            const url = `/api/ponentes`;
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();
            formatearPonentes(resultado)
        }

        async function obtenerPonente(id) {
            const url = `/api/ponente?id=${id}`;
            const respuesta = await fetch(url)
            const resultado = await respuesta.json()
            return resultado;
        }

        function formatearPonentes(arrayPonentes = []) {
            ponentes = arrayPonentes.map( ponente => {
                return {
                    nombre: `${ponente.nombre.trim()} ${ponente.apellido.trim()}`,
                    id: ponente.id
                } 
            })
        }

        function buscarPonentes(e) {
            const busqueda = e.target.value;

            if(busqueda.length > 3) {
                const expresion = new RegExp(busqueda, "i");
                ponentesFiltrados = ponentes.filter(ponente => {
                    if(ponente.nombre.toLowerCase().search(expresion) != -1) {
                        return ponente
                    }
                })
            } else {
                ponentesFiltrados = []
            }

            mostrarPonentes();
        }

        function mostrarPonentes() {

            while(listadoPonentes.firstChild) {
                listadoPonentes.removeChild(listadoPonentes.firstChild)
            }

            if(ponentesFiltrados.length > 0) {
                ponentesFiltrados.forEach(ponente => {
                    const ponenteHTML = document.createElement('LI');
                    ponenteHTML.classList.add('listado-ponentes__ponente')
                    ponenteHTML.textContent = ponente.nombre;
                    ponenteHTML.dataset.ponenteId = ponente.id
                    ponenteHTML.onclick = seleccionarPonente

                    // Añadir al dom
                    listadoPonentes.appendChild(ponenteHTML)
                })
            } else {
                const noResultados = document.createElement('P')
                noResultados.classList.add('listado-ponentes__no-resultado')
                noResultados.textContent = 'No hay resultados para tu búsqueda'
                listadoPonentes.appendChild(noResultados)              
            }
        }

        function seleccionarPonente(e) {
            const ponente = e.target;

            // Remover la clase previa
            const ponentePrevio = document.querySelector('.listado-ponentes__ponente--seleccionado')
            if(ponentePrevio) {
                ponentePrevio.classList.remove('listado-ponentes__ponente--seleccionado')
            }
            ponente.classList.add('listado-ponentes__ponente--seleccionado')

            ponenteHidden.value = ponente.dataset.ponenteId
        }
    }
})();
import Swiper, { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
document.addEventListener('DOMContentLoaded', function() {
    if(document.querySelector('.slider')) {
        const opciones = {
            slidesPerView: 1,
            spaceBetween: 15,
            freeMode: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            breakpoints: {
                768: {
                    slidesPerView: 2
                },
                1024: {
                    slidesPerView: 3
                },
                1200: {
                    slidesPerView: 4
                }
            }
        }

        Swiper.use([Navigation])
        new Swiper('.slider', opciones)
    }
});
if(document.querySelector('#mapa')) {
    const lat = 40.44735817936383
    const lng = -3.665675135534326
    const zoom = 16

    const map = L.map('mapa').setView([lat, lng], zoom);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map)
        .bindPopup(`
            <h2 class="mapa__heading">DigitechCamp</h2>
            <p class="mapa__texto">Centro de Formación Digitech FP</p>
        `)
        .openPopup();
}
import Swal from 'sweetalert2'
(function(){
    let eventos = [];

    const resumen = document.querySelector('#registro-resumen');
    if(resumen) {
        const eventosBoton = document.querySelectorAll('.evento__agregar');
        eventosBoton.forEach(boton => boton.addEventListener('click', seleccionarEvento));

        const formularioRegistro = document.querySelector('#registro');
        formularioRegistro.addEventListener('submit', submitFormulario);

        mostrarEventos();

        function seleccionarEvento({target}) {
            if(eventos.length < 5) {
                target.disabled = true;
                eventos = [...eventos, {
                    id: target.dataset.id,
                    titulo: target.parentElement.querySelector('.evento__nombre').textContent.trim()
                }];

                mostrarEventos();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Máximo 5 eventos por registro',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }

        function mostrarEventos() {
            limpiarEventos();

            if(eventos.length > 0 ) {
                eventos.forEach( evento => {
                    const eventoDOM = document.createElement('DIV');
                    eventoDOM.classList.add('registro__evento');

                    const titulo = document.createElement('H3');
                    titulo.classList.add('registro__nombre');
                    titulo.textContent = evento.titulo;

                    const botonEliminar = document.createElement('BUTTON');
                    botonEliminar.classList.add('registro__eliminar');
                    botonEliminar.innerHTML = `<i class="fa-solid fa-trash"></i>`;
                    botonEliminar.onclick = function() {
                        eliminarEvento(evento.id);
                    };

                    eventoDOM.appendChild(titulo);
                    eventoDOM.appendChild(botonEliminar);
                    resumen.appendChild(eventoDOM);
                });
            } else {
                const noRegistro = document.createElement('P');
                noRegistro.textContent = 'No hay eventos, añade hasta 5 del lado izquierdo';
                noRegistro.classList.add('registro__texto');
                resumen.appendChild(noRegistro);
            }
        }

        function eliminarEvento(id) {
            eventos = eventos.filter(evento => evento.id !== id);
            const botonAgregar = document.querySelector(`[data-id="${id}"]`);
            if(botonAgregar) botonAgregar.disabled = false;
            mostrarEventos();
        }

        function limpiarEventos() {
            while(resumen.firstChild) {
                resumen.removeChild(resumen.firstChild);
            }
        }

        async function submitFormulario(e) {
            e.preventDefault();

            const regaloId = document.querySelector('#regalo').value;
            const eventosId = eventos.map(evento => evento.id);

            if(eventosId.length === 0 || regaloId === '') {
                Swal.fire({
                    title: 'Error',
                    text: 'Elige al menos un Evento y un Regalo',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                return;
            }

            const datos = new FormData();
            datos.append('eventos', eventosId.join(',')); // ✅ Aquí corregido
            datos.append('regalo_id', regaloId);

            const url = '/finalizar-registro/conferencias';
            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            });

            const resultado = await respuesta.json();

            if(resultado.resultado) {
                Swal.fire(
                    'Registro Exitoso',
                    'Tus conferencias se han almacenado y tu registro fue exitoso, te esperamos en DigitechCamp',
                    'success'
                ).then(() => location.href = `/boleto?id=${resultado.token}`);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error',
                    icon: 'error',
                    confirmButtonText: 'OK'
                }).then(() => location.reload());
            }
        }
    }
})();

(function() {
    const grafica = document.querySelector('#regalos-grafica');
    if(grafica) {
            obtenerDatos()
            async function obtenerDatos() {
                const url = '/api/regalos'
                const respuesta = await fetch(url)
                const resultado = await respuesta.json()

                const ctx = document.getElementById('regalos-grafica').getContext('2d');
                const myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: resultado.map( regalo => regalo.nombre),
                        datasets: [{
                            label: '',
                            data: resultado.map( regalo => regalo.total),
                            backgroundColor: [
                                '#ea580c',
                                '#84cc16',
                                '#22d3ee',
                                '#a855f7',
                                '#ef4444',
                                '#14b8a6',
                                '#db2777',
                                '#e11d48',
                                '#7e22ce'
                            ]
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                });
            }

            
    }
    
})();