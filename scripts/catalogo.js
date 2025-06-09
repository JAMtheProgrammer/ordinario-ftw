document.addEventListener('DOMContentLoaded', () => {
  let cancionesXML = [];
  fetch('data/canciones.xml')
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, 'application/xml');
      cancionesXML = Array.from(xml.querySelectorAll('cancion')).map(c => ({
        titulo: c.querySelector('titulo').textContent,
        artista: c.querySelector('artista').textContent,
        genero: c.querySelector('genero').textContent,
        anio: c.querySelector('anio').textContent,
        calificacion: c.querySelector('calificacion').textContent,
        url: c.querySelector('url').textContent
      }));
      mostrarCanciones();
    });

  document.getElementById('genero').addEventListener('change', mostrarCanciones);

  function mostrarCanciones() {
    const generoFiltro = document.getElementById('genero').value;
    let todas = cancionesXML;
    if (generoFiltro !== 'todos') {
      todas = todas.filter(c => c.genero === generoFiltro);
    }
    const tbody = document.getElementById('tabla-canciones').querySelector('tbody');
    tbody.innerHTML = '';
    const alerta = document.getElementById('alerta-busqueda');
    if (todas.length === 0) {
      alerta.textContent = "No se encontraron canciones para ese género.";
    } else {
      alerta.textContent = "";
    }
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
    document.getElementById('total-canciones').textContent = todas.length;
    document.getElementById('total-generos').textContent = [...new Set(cancionesXML.map(c => c.genero))].length;
  }

  fetch('data/top_canciones.xml')
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, 'application/xml');
      const top = Array.from(xml.querySelectorAll('cancion')).map(c => ({
        titulo: c.querySelector('titulo').textContent,
        artista: c.querySelector('artista').textContent,
        genero: c.querySelector('genero').textContent,
        url: c.querySelector('url').textContent
      }));
      
      const ul = document.querySelector('.top-canciones');
      if (ul) {
        ul.innerHTML = '';
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
