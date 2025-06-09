// Espera a que todo el DOM esté cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {

  // Se declara un arreglo para guardar las canciones extraídas del XML
  let cancionesXML = [];

  // Solicita el archivo XML de canciones usando fetch
  fetch('data/canciones.xml')
    .then(response => response.text()) // Convierte la respuesta a texto
    .then(data => {
      // Parsea el texto XML a un objeto DOM
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, 'application/xml');
      // Extrae todas las canciones y las transforma en objetos de JS
      cancionesXML = Array.from(xml.querySelectorAll('cancion')).map(c => ({
        titulo: c.querySelector('titulo').textContent,
        artista: c.querySelector('artista').textContent,
        genero: c.querySelector('genero').textContent,
        anio: c.querySelector('anio').textContent,
        calificacion: c.querySelector('calificacion').textContent,
        url: c.querySelector('url').textContent
      }));
      // Muestra las canciones en la tabla al cargar la página
      mostrarCanciones();
    });

  // Agrega un evento para filtrar canciones por género al cambiar el select
  document.getElementById('genero').addEventListener('change', mostrarCanciones);

  // Función principal para mostrar las canciones en la tabla
  function mostrarCanciones() {
    // Obtiene el género seleccionado en el filtro
    const generoFiltro = document.getElementById('genero').value;
    // Por defecto, usa todas las canciones
    let todas = cancionesXML;
    // Si se selecciona un género distinto a 'todos', filtra el arreglo
    if (generoFiltro !== 'todos') {
      todas = todas.filter(c => c.genero === generoFiltro);
    }
    // Obtiene el cuerpo de la tabla para mostrar los resultados
    const tbody = document.getElementById('tabla-canciones').querySelector('tbody');
    tbody.innerHTML = ''; // Limpia el contenido anterior

    // Referencia al elemento de alerta para mostrar mensajes
    const alerta = document.getElementById('alerta-busqueda');
    if (todas.length === 0) {
      // Si no hay canciones, muestra un mensaje de alerta
      alerta.textContent = "No se encontraron canciones para ese género.";
    } else {
      alerta.textContent = ""; // Limpia la alerta si hay resultados
    }

    // Recorre todas las canciones a mostrar y crea una fila en la tabla por cada una
    todas.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c.titulo}</td>
        <td>${c.artista}</td>
        <td>${c.genero}</td>
        <td>${c.anio}</td>
        <td>${c.calificacion}</td>
        <td>
          <a href="${c.url}" target="_blank" aria-label="Escuchar en YouTube">
            <svg height="18" viewBox="0 0 24 24" fill="none" style="vertical-align:middle;">
              <path d="M9 19V5l12-2v14" stroke="#586E7D" stroke-width="2" stroke-linecap="round"/>
              <circle cx="9" cy="19" r="3" stroke="#586E7D" stroke-width="2" />
              <circle cx="21" cy="17" r="3" stroke="#586E7D" stroke-width="2" />
            </svg>
          </a>
        </td> 
      `;
      tbody.appendChild(tr);
    });

    // Muestra el total de canciones y de géneros (únicos) en los contadores del dashboard
    document.getElementById('total-canciones').textContent = todas.length;
    document.getElementById('total-generos').textContent = [...new Set(cancionesXML.map(c => c.genero))].length;
  }

  // Segunda petición: carga el top de canciones desde otro XML
  fetch('data/top_canciones.xml')
    .then(response => response.text())
    .then(data => {
      // Parsea el XML recibido
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, 'application/xml');
      // Extrae el top de canciones a un arreglo
      const top = Array.from(xml.querySelectorAll('cancion')).map(c => ({
        titulo: c.querySelector('titulo').textContent,
        artista: c.querySelector('artista').textContent,
        genero: c.querySelector('genero').textContent,
        url: c.querySelector('url').textContent
      }));

      // Busca la lista ul donde se mostrará el top
      const ul = document.querySelector('.top-canciones');
      if (ul) {
        ul.innerHTML = ''; // Limpia la lista antes de agregar los nuevos
        // Agrega cada canción como un <li> en la lista
        top.forEach(song => {
          const li = document.createElement('li');
          li.innerHTML = `
            <span class="badge-genero ${song.genero.toLowerCase()}">${song.genero}</span>
            <strong>${song.titulo}</strong> – ${song.artista}
            <a href="${song.url}" target="_blank" aria-label="Escuchar ${song.titulo} en YouTube">Escuchar</a>
          `;
          ul.appendChild(li);
        });
      }
    });
});
