const express = require('express');
const path = require('path'); // Adicione esta linha
const app = express();

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

let animes = [
  { id: 1, name: 'Naruto', genre: 'Ação', studio: 'Pierrot' },
  { id: 2, name: 'Neon Genesis Evangelion', genre: 'Mecha/Psicológico', studio: 'Gainax' },
  { id: 3, name: 'Cowboy Bebop', genre: 'Sci-Fi/Noir', studio: 'Sunrise' },
  { id: 4, name: 'Berserk', genre: 'Dark Fantasy', studio: 'OLM' },
  { id: 5, name: 'Yu Yu Hakusho', genre: 'Ação/Sobrenatural', studio: 'Pierrot' },
  { id: 6, name: 'Vinland Saga', genre: 'Histórico/Ação', studio: 'WIT Studio' }
];

// Rota padrão para servir o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rotas de API mantidas iguais
app.get('/animes', (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filteredAnimes = animes.filter(a => 
      a.genre.toLowerCase().includes(genre.toLowerCase())
    );
    return res.json(filteredAnimes);
  }
  res.json(animes);
});

app.get('/animes/:id', (req, res) => {
  const anime = animes.find(a => a.id === parseInt(req.params.id));
  if (!anime) return res.status(404).send('Anime não encontrado');
  res.json(anime);
});

app.post('/animes', (req, res) => {
  const { name, genre, studio = 'Não especificado' } = req.body;
  
  // Validações
  if (!name || !genre) {
    return res.status(400).send('Nome e gênero são obrigatórios');
  }

  if (name.length < 2) {
    return res.status(400).json({ 
      message: 'O nome do anime deve ter pelo menos 2 caracteres' 
    });
  }

  if (animes.some(a => a.name.toLowerCase() === name.toLowerCase())) {
    return res.status(409).json({ 
      message: 'Já existe um anime com este nome' 
    });
  }

  const newAnime = {
    id: animes.length ? animes[animes.length - 1].id + 1 : 1,
    name,
    genre,
    studio
  };
  animes.push(newAnime);
  res.status(201).json(newAnime);
});

// As outras rotas (PUT, DELETE) permanecem iguais

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Ocorreu um erro interno no servidor',
    error: err.message
  });
});

module.exports = app;