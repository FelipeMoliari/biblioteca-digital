# Sistema de Gerenciamento de Livros - CRUD Full Stack

## Descrição do Projeto
Um sistema simples para gerenciar uma biblioteca pessoal, permitindo:
- **Create**: Adicionar novos livros
- **Read**: Visualizar lista de livros e detalhes
- **Update**: Editar informações dos livros
- **Delete**: Remover livros da biblioteca

## Tecnologias Utilizadas
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js com Express
- **Banco de Dados**: SQLite (simples e não requer instalação)
- **ORM**: Sequelize (para facilitar operações SQL)

## Estrutura do Projeto
```
projeto/
├── backend/
│   ├── server.js
│   ├── models/
│   │   └── Book.js
│   ├── routes/
│   │   └── books.js
│   └── database.db
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── package.json
└── README.md
```

## Funcionalidades
1. **Listar Livros**: Exibe todos os livros cadastrados
2. **Adicionar Livro**: Formulário para cadastrar novo livro (título, autor, ano, gênero)
3. **Editar Livro**: Permite modificar informações de um livro existente
4. **Excluir Livro**: Remove um livro da biblioteca
5. **Buscar Livros**: Filtro por título ou autor


## Como Executar
1. Instalar dependências: `npm install`
2. Iniciar servidor: `npm start`
3. Abrir `frontend/index.html` no navegador
