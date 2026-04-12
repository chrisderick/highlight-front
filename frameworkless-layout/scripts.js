const API_URL = 'http://127.0.0.1:5000';

let artistaAtualId = null;
let artistaAtualNome = null;
let musicaAtualId = null;
let musicaAtualTitulo = null;

const letrasCache = {};

window.addEventListener('DOMContentLoaded', () => {
    lerParametrosURL();
});

const lerParametrosURL = () => {
    const params = new URLSearchParams(window.location.search);
    const artistId = params.get('artist');
    const songId = params.get('song');

    if (songId && artistId) {
        artistaAtualId = artistId;
        musicaAtualId = songId;
        obterDetalhesMusica(songId).then(() => {
            mostrarSecao('secaoLetras');
            listarLetras(songId);
        });
    } else if (artistId) {
        artistaAtualId = artistId;
        obterDetalhesArtista(artistId).then(() => {
            mostrarSecao('secaoMusicas');
            listarMusicas(artistId);
        });
    } else {
        mostrarSecao('secaoArtistas');
        listarArtistas();
    }
};

const mostrarSecao = (idSecao) => {
    document.querySelectorAll('.secao').forEach(secao => {
        secao.classList.add('oculto');
    });
    document.getElementById(idSecao).classList.remove('oculto');
    atualizarBreadcrumbs();
};

const atualizarBreadcrumbs = () => {
    const breadcrumb = document.getElementById('breadcrumb');
    let html = '<a href="#" onclick="navegarParaArtistas()">Artistas</a>';
    
    if (artistaAtualNome) {
        html += ` > <a href="#" onclick="navegarParaMusicas(${artistaAtualId}, '${artistaAtualNome}')">${artistaAtualNome}</a>`;
    }
    
    if (musicaAtualTitulo) {
        html += ` > ${musicaAtualTitulo}`;
    }
    
    breadcrumb.innerHTML = html;
};

const navegarParaArtistas = () => {
    artistaAtualId = null;
    artistaAtualNome = null;
    musicaAtualId = null;
    musicaAtualTitulo = null;
    history.pushState({}, '', window.location.pathname);
    mostrarSecao('secaoArtistas');
    listarArtistas();
};

const navegarParaMusicas = (artistaId, nomeArtista) => {
    artistaAtualId = artistaId;
    artistaAtualNome = nomeArtista;
    musicaAtualId = null;
    musicaAtualTitulo = null;
    history.pushState({}, '', `?artist=${artistaId}`);
    document.getElementById('nomeArtistaAtual').textContent = nomeArtista;
    mostrarSecao('secaoMusicas');
    listarMusicas(artistaId);
};

const navegarParaLetras = (musicaId, tituloMusica) => {
    musicaAtualId = musicaId;
    musicaAtualTitulo = tituloMusica;
    history.pushState({}, '', `?artist=${artistaAtualId}&song=${musicaId}`);
    document.getElementById('tituloMusicaAtual').textContent = tituloMusica;
    mostrarSecao('secaoLetras');
    listarLetras(musicaId);
};

const voltarParaArtistas = () => {
    navegarParaArtistas();
};

const voltarParaMusicas = () => {
    navegarParaMusicas(artistaAtualId, artistaAtualNome);
};

//#region API: Artistas

const listarArtistas = async () => {
    try {
        const response = await fetch(`${API_URL}/artists`, {
            method: 'GET'
        });
        const data = await response.json();
        
        const listaArtistas = document.getElementById('listaArtistas');
        listaArtistas.innerHTML = '';
        
        if (data.items && data.items.length > 0) {
            data.items.forEach(artista => {
                inserirCardArtista(artista);
            });
        } else {
            listaArtistas.innerHTML = '<p class="mensagemVazia">Nenhum artista cadastrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao listar artistas:', error);
        alert('Erro ao carregar artistas!');
    }
};

const adicionarArtista = async () => {
    const nome = document.getElementById('nomeArtista').value.trim();
    
    if (nome === '') {
        alert('Por favor, informe o nome do artista!');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/artists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: nome })
        });
        
        if (response.ok) {
            document.getElementById('nomeArtista').value = '';
            alert('Artista adicionado com sucesso!');
            listarArtistas();
        } else {
            alert('Erro ao adicionar artista!');
        }
    } catch (error) {
        console.error('Erro ao adicionar artista:', error);
        alert('Erro ao adicionar artista!');
    }
};

const editarArtista = async (artistaId, nomeAtual) => {
    const novoNome = prompt('Novo nome do artista:', nomeAtual);
    
    if (novoNome === null || novoNome.trim() === '') {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/artists/${artistaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: novoNome.trim() })
        });
        
        if (response.ok) {
            alert('Artista atualizado com sucesso!');
            listarArtistas();
        } else {
            alert('Erro ao atualizar artista!');
        }
    } catch (error) {
        console.error('Erro ao atualizar artista:', error);
        alert('Erro ao atualizar artista!');
    }
};

const deletarArtista = async (artistaId, nomeArtista) => {
    if (!confirm(`Tem certeza que deseja deletar o artista "${nomeArtista}"?\n\nISTO DELETARÁ TODAS AS MÚSICAS E LETRAS ASSOCIADAS!`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/artists/${artistaId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Artista deletado com sucesso!');
            listarArtistas();
        } else {
            alert('Erro ao deletar artista!');
        }
    } catch (error) {
        console.error('Erro ao deletar artista:', error);
        alert('Erro ao deletar artista!');
    }
};

const obterDetalhesArtista = async (artistaId) => {
    try {
        const response = await fetch(`${API_URL}/artists/${artistaId}`, {
            method: 'GET'
        });
        const data = await response.json();
        
        if (response.ok) {
            artistaAtualNome = data.name;
            document.getElementById('nomeArtistaAtual').textContent = data.name;
        }
    } catch (error) {
        console.error('Erro ao obter detalhes do artista:', error);
    }
};

const inserirCardArtista = (artista) => {
    const listaArtistas = document.getElementById('listaArtistas');
    
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="cardHeader">
            <h3>${artista.name}</h3>
            <div class="acoes">
                <button class="btnEditar" onclick="editarArtista(${artista.id}, '${artista.name}')">✏️</button>
                <button class="btnDeletar" onclick="deletarArtista(${artista.id}, '${artista.name}')">🗑️</button>
            </div>
        </div>
        <div class="cardBody">
            <p class="dataInfo">Cadastrado em: ${formatarData(artista.created_at)}</p>
            <button class="btnAcessar" onclick="navegarParaMusicas(${artista.id}, '${artista.name}')">Ver Músicas →</button>
        </div>
    `;
    
    listaArtistas.appendChild(card);
};

//#endregion

//#region API: Músicas

const listarMusicas = async (artistaId) => {
    try {
        const response = await fetch(`${API_URL}/artists/${artistaId}/songs`, {
            method: 'GET'
        });
        const data = await response.json();
        
        const listaMusicas = document.getElementById('listaMusicas');
        listaMusicas.innerHTML = '';
        
        if (data.items && data.items.length > 0) {
            data.items.forEach(musica => {
                inserirCardMusica(musica);
            });
        } else {
            listaMusicas.innerHTML = '<p class="mensagemVazia">Nenhuma música cadastrada para este artista.</p>';
        }
    } catch (error) {
        console.error('Erro ao listar músicas:', error);
        alert('Erro ao carregar músicas!');
    }
};

const adicionarMusica = async () => {
    const titulo = document.getElementById('tituloMusica').value.trim();
    const ano = document.getElementById('anoLancamento').value.trim();
    
    if (titulo === '') {
        alert('Por favor, informe o título da música!');
        return;
    }
    
    try {
        const body = { title: titulo };
        
        if (ano !== '') {
            body.release_year = parseInt(ano);
        }
        
        const response = await fetch(`${API_URL}/artists/${artistaAtualId}/songs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if (response.ok) {
            document.getElementById('tituloMusica').value = '';
            document.getElementById('anoLancamento').value = '';
            alert('Música adicionada com sucesso!');
            listarMusicas(artistaAtualId);
        } else {
            alert('Erro ao adicionar música!');
        }
    } catch (error) {
        console.error('Erro ao adicionar música:', error);
        alert('Erro ao adicionar música!');
    }
};

const editarMusica = async (musicaId, tituloAtual, anoAtual) => {
    const novoTitulo = prompt('Novo título da música:', tituloAtual);
    
    if (novoTitulo === null) {
        return;
    }
    
    if (novoTitulo.trim() === '') {
        alert('O título não pode ser vazio!');
        return;
    }
    
    const novoAno = prompt('Novo ano de lançamento (deixe vazio para remover):', anoAtual || '');
    
    if (novoAno === null) {
        return;
    }
    
    try {
        const body = { title: novoTitulo.trim() };
        
        if (novoAno.trim() !== '') {
            body.release_year = parseInt(novoAno.trim());
        } else {
            body.release_year = null;
        }
        
        const response = await fetch(`${API_URL}/songs/${musicaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if (response.ok) {
            alert('Música atualizada com sucesso!');
            listarMusicas(artistaAtualId);
        } else {
            alert('Erro ao atualizar música!');
        }
    } catch (error) {
        console.error('Erro ao atualizar música:', error);
        alert('Erro ao atualizar música!');
    }
};

const deletarMusica = async (musicaId, tituloMusica) => {
    if (!confirm(`Tem certeza que deseja deletar a música "${tituloMusica}"?\n\nISTO DELETARÁ TODAS AS LETRAS ASSOCIADAS!`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/songs/${musicaId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Música deletada com sucesso!');
            listarMusicas(artistaAtualId);
        } else {
            alert('Erro ao deletar música!');
        }
    } catch (error) {
        console.error('Erro ao deletar música:', error);
        alert('Erro ao deletar música!');
    }
};

const obterDetalhesMusica = async (musicaId) => {
    try {
        const response = await fetch(`${API_URL}/songs/${musicaId}`, {
            method: 'GET'
        });
        const data = await response.json();
        
        if (response.ok) {
            musicaAtualTitulo = data.title;
            artistaAtualId = data.artist_id;
            document.getElementById('tituloMusicaAtual').textContent = data.title;
            
            await obterDetalhesArtista(data.artist_id);
        }
    } catch (error) {
        console.error('Erro ao obter detalhes da música:', error);
    }
};

const inserirCardMusica = (musica) => {
    const listaMusicas = document.getElementById('listaMusicas');
    
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="cardHeader">
            <h3>${musica.title}</h3>
            <div class="acoes">
                <button class="btnEditar" onclick="editarMusica(${musica.id}, '${musica.title}', '${musica.release_year || ''}')">✏️</button>
                <button class="btnDeletar" onclick="deletarMusica(${musica.id}, '${musica.title}')">🗑️</button>
            </div>
        </div>
        <div class="cardBody">
            ${musica.release_year ? `<p class="anoInfo">Ano: ${musica.release_year}</p>` : ''}
            <p class="dataInfo">Cadastrado em: ${formatarData(musica.created_at)}</p>
            <button class="btnAcessar" onclick="navegarParaLetras(${musica.id}, '${musica.title}')">Ver Letras →</button>
        </div>
    `;
    
    listaMusicas.appendChild(card);
};

//#endregion

//#region API: Letras

const listarLetras = async (musicaId) => {
    try {
        const response = await fetch(`${API_URL}/songs/${musicaId}/lyrics`, {
            method: 'GET'
        });
        const data = await response.json();
        
        const listaLetras = document.getElementById('listaLetras');
        listaLetras.innerHTML = '';
        
        if (data.items && data.items.length > 0) {
            data.items.forEach(letra => {
                inserirCardLetra(letra);
            });
        } else {
            listaLetras.innerHTML = '<p class="mensagemVazia">Nenhuma letra cadastrada para esta música.</p>';
        }
    } catch (error) {
        console.error('Erro ao listar letras:', error);
        alert('Erro ao carregar letras!');
    }
};

const adicionarLetra = async () => {
    const idioma = document.getElementById('idiomaLetra').value.trim();
    const conteudo = document.getElementById('conteudoLetra').value.trim();
    
    if (idioma === '') {
        alert('Por favor, informe o idioma da letra!');
        return;
    }
    
    if (conteudo === '') {
        alert('Por favor, informe o conteúdo da letra!');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/songs/${musicaAtualId}/lyrics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                language: idioma,
                content: conteudo
            })
        });
        
        if (response.ok) {
            document.getElementById('idiomaLetra').value = '';
            document.getElementById('conteudoLetra').value = '';
            alert('Letra adicionada com sucesso!');
            listarLetras(musicaAtualId);
        } else {
            alert('Erro ao adicionar letra!');
        }
    } catch (error) {
        console.error('Erro ao adicionar letra:', error);
        alert('Erro ao adicionar letra!');
    }
};

const editarLetraPorId = (letraId) => {
    const letra = letrasCache[letraId];
    if (!letra) {
        alert('Erro ao carregar dados da letra!');
        return;
    }
    editarLetra(letraId, letra.language, letra.content);
};

const editarLetra = (letraId, idiomaAtual, conteudoAtual) => {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const idiomaEscapado = idiomaAtual
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    
    const conteudoEscapado = conteudoAtual
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    modal.innerHTML = `
        <div class="modalConteudo">
            <h3>Editar Letra</h3>
            <label>Idioma:</label>
            <input type="text" id="editarIdioma" value="${idiomaEscapado}">
            <label>Conteúdo:</label>
            <textarea id="editarConteudo" rows="10">${conteudoEscapado}</textarea>
            <div class="modalAcoes">
                <button onclick="salvarEdicaoLetra(${letraId})">Salvar</button>
                <button onclick="fecharModal()">Cancelar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};

const salvarEdicaoLetra = async (letraId) => {
    const novoIdioma = document.getElementById('editarIdioma').value.trim();
    const novoConteudo = document.getElementById('editarConteudo').value.trim();
    
    if (novoIdioma === '') {
        alert('O idioma não pode ser vazio!');
        return;
    }
    
    if (novoConteudo === '') {
        alert('O conteúdo não pode ser vazio!');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/lyrics/${letraId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                language: novoIdioma,
                content: novoConteudo
            })
        });
        
        if (response.ok) {
            alert('Letra atualizada com sucesso!');
            fecharModal();
            listarLetras(musicaAtualId);
        } else {
            alert('Erro ao atualizar letra!');
        }
    } catch (error) {
        console.error('Erro ao atualizar letra:', error);
        alert('Erro ao atualizar letra!');
    }
};

const deletarLetra = async (letraId, idioma) => {
    if (!confirm(`Tem certeza que deseja deletar a letra em "${idioma}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/lyrics/${letraId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Letra deletada com sucesso!');
            listarLetras(musicaAtualId);
        } else {
            alert('Erro ao deletar letra!');
        }
    } catch (error) {
        console.error('Erro ao deletar letra:', error);
        alert('Erro ao deletar letra!');
    }
};

const inserirCardLetra = (letra) => {
    const listaLetras = document.getElementById('listaLetras');
    
    letrasCache[letra.id] = {
        language: letra.language,
        content: letra.content
    };
    
    const card = document.createElement('div');
    card.className = 'card cardLetra';
    
    const conteudoPreview = letra.content.length > 150 
        ? letra.content.substring(0, 150) + '...' 
        : letra.content;
    
    const conteudoPreviewEscapado = conteudoPreview
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    card.innerHTML = `
        <div class="cardHeader">
            <h3>🌐 ${letra.language}</h3>
            <div class="acoes">
                <button class="btnEditar" onclick="editarLetraPorId(${letra.id})">✏️</button>
                <button class="btnDeletar" onclick="deletarLetra(${letra.id}, '${letra.language.replace(/'/g, "\\'")}')">🗑️</button>
            </div>
        </div>
        <div class="cardBody">
            <pre class="letraConteudo">${conteudoPreviewEscapado}</pre>
            <p class="dataInfo">Criado em: ${formatarData(letra.created_at)}</p>
            ${letra.updated_at ? `<p class="dataInfo">Atualizado em: ${formatarData(letra.updated_at)}</p>` : ''}
            <button class="btnExpandir" onclick="expandirLetraPorId(${letra.id})">Ver letra completa</button>
        </div>
    `;
    
    listaLetras.appendChild(card);
};

const expandirLetraPorId = (letraId) => {
    const letra = letrasCache[letraId];
    if (!letra) {
        alert('Erro ao carregar conteúdo da letra!');
        return;
    }
    expandirLetra(letra.content);
};

const expandirLetra = (conteudo) => {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const conteudoEscapado = conteudo
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    modal.innerHTML = `
        <div class="modalConteudo modalLetraCompleta">
            <h3>Letra Completa</h3>
            <pre class="letraCompleta">${conteudoEscapado}</pre>
            <button onclick="fecharModal()">Fechar</button>
        </div>
    `;
    
    document.body.appendChild(modal);
};

const fecharModal = () => {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
};

//#endregion

const formatarData = (dataISO) => {
    if (!dataISO) return 'Data não disponível';
    
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    
    return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
};
