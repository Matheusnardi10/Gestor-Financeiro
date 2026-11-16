import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
app.use(express.json()); // API aceita JSON
app.use(morgan('dev')); // log das requisições

app.use(cors({
  origin: 'http://localhost:4200', // URL do Angular
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// Conectar no MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { dbName: 'Financas' })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro na conexão:', err.message));

// Modelo Movimentacao
const movimentacaoSchema = new mongoose.Schema({
  descricao: { type: String, required: true, trim: true, minlength: 2 },
  tipo:      { type: String, required: true, enum: ['entrada', 'saida'] },
  categoria: { type: String, required: true, trim: true },
  valor:     { type: Number, required: true, min: 0.01 },
  data:      { type: Date, required: true }
}, { timestamps: true });
const Movimentacao = mongoose.model('Movimentacao', movimentacaoSchema, 'Movimentacoes');

// Rota inicial
app.get('/', (req, res) => res.json({ msg: 'API rodando' }));

// Criar movimentação
app.post('/movimentacoes', async (req, res) => {
  try {
    const mov = await Movimentacao.create(req.body);
    res.status(201).json(mov);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar movimentações (mais recentes primeiro)
app.get('/movimentacoes', async (req, res) => {
  try {
    const movs = await Movimentacao.find().sort({ data: -1, createdAt: -1 });
    res.json(movs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Consulta pelo ID
app.get('/movimentacoes/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const mov = await Movimentacao.findById(req.params.id);
    if (!mov) return res.status(404).json({ error: 'Movimentação não encontrada' });
    res.json(mov);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar
app.put('/movimentacoes/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const mov = await Movimentacao.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, overwrite: true }
    );
    if (!mov) return res.status(404).json({ error: 'Movimentação não encontrada' });
    res.json(mov);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Excluir
app.delete('/movimentacoes/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const mov = await Movimentacao.findByIdAndDelete(req.params.id);
    if (!mov) return res.status(404).json({ error: 'Movimentação não encontrada' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciar servidor
app.listen(process.env.PORT, () =>
  console.log(`Servidor rodando em http://localhost:${process.env.PORT}`)
);