const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let whereClause = {};
    
    if (search) {
      whereClause = {
        [Op.or]: [
          { titulo: { [Op.like]: `%${search}%` } },
          { autor: { [Op.like]: `%${search}%` } }
        ]
      };
    }
    
    const books = await Book.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: books,
      count: books.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar livros',
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Livro não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar livro',
      error: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { titulo, autor, ano, genero, descricao } = req.body;
    
    if (!titulo || !autor || !ano || !genero) {
      return res.status(400).json({
        success: false,
        message: 'Título, autor, ano e gênero são obrigatórios'
      });
    }
    
    const book = await Book.create({
      titulo,
      autor,
      ano: parseInt(ano),
      genero,
      descricao
    });
    
    res.status(201).json({
      success: true,
      message: 'Livro criado com sucesso',
      data: book
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao criar livro',
      error: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { titulo, autor, ano, genero, descricao } = req.body;
    
    const book = await Book.findByPk(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Livro não encontrado'
      });
    }
    
    await book.update({
      titulo: titulo || book.titulo,
      autor: autor || book.autor,
      ano: ano ? parseInt(ano) : book.ano,
      genero: genero || book.genero,
      descricao: descricao !== undefined ? descricao : book.descricao
    });
    
    res.json({
      success: true,
      message: 'Livro atualizado com sucesso',
      data: book
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao atualizar livro',
      error: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Livro não encontrado'
      });
    }
    
    await book.destroy();
    
    res.json({
      success: true,
      message: 'Livro deletado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar livro',
      error: error.message
    });
  }
});

module.exports = router;