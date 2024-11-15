// Variáveis globais
const animeForm = document.getElementById('animeForm');
const animeList = document.getElementById('animeList');

// Evento de submissão do formulário
animeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const animeName = document.getElementById('animeName').value;
    const animeGenre = document.getElementById('animeGenre').value;
    const animeStudio = document.getElementById('animeStudio').value;

    try {
        const response = await fetch('/animes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                name: animeName, 
                genre: animeGenre, 
                studio: animeStudio 
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            addAnimeToTable(data);
            animeForm.reset();
        } else {
            alert(data.message || 'Erro ao adicionar anime');
        }
    } catch (error) {
        console.error('Erro ao adicionar anime:', error);
    }
});

// Função para adicionar anime à tabela
function addAnimeToTable(anime) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${anime.name}</td>
        <td>${anime.genre}</td>
        <td>${anime.studio || 'Não especificado'}</td>
        <td>
            <button onclick="editAnime(${anime.id})">Editar</button>
            <button onclick="deleteAnime(${anime.id})">Excluir</button>
        </td>
    `;
    animeList.appendChild(tr);
}

// Função para carregar animes existentes ao iniciar
async function loadAnimes() {
    try {
        const response = await fetch('/animes');
        const animes = await response.json();
        
        animeList.innerHTML = ''; // Limpa a lista atual
        animes.forEach(addAnimeToTable);
    } catch (error) {
        console.error('Erro ao carregar animes:', error);
    }
}

// Função para editar anime (placeholder)
function editAnime(id) {
    // Implementação da edição
    console.log('Editar anime:', id);
}

// Função para deletar anime
async function deleteAnime(id) {
    try {
        const response = await fetch(`/animes/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadAnimes(); // Recarrega a lista após deletar
        } else {
            alert('Erro ao deletar anime');
        }
    } catch (error) {
        console.error('Erro ao deletar anime:', error);
    }
}

// Carregar animes ao iniciar
loadAnimes();