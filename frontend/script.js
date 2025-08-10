const API_BASE_URL = '/api';

const elements = {
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    addBookBtn: document.getElementById('addBookBtn'),
    bookFormModal: document.getElementById('bookFormModal'),
    bookForm: document.getElementById('bookForm'),
    modalTitle: document.getElementById('modalTitle'),
    closeModal: document.querySelector('.close'),
    cancelBtn: document.getElementById('cancelBtn'),
    booksContainer: document.getElementById('booksContainer'),
    booksCount: document.getElementById('booksCount'),
    emptyState: document.getElementById('emptyState'),
    loading: document.getElementById('loading'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    toastClose: document.getElementById('toastClose')
};

let currentBooks = [];
let isEditing = false;
let editingBookId = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

function setupEventListeners() {
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.clearSearchBtn.addEventListener('click', clearSearch);
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    elements.addBookBtn.addEventListener('click', openAddModal);
    elements.closeModal.addEventListener('click', closeModal);
    elements.cancelBtn.addEventListener('click', closeModal);
    
    elements.bookForm.addEventListener('submit', handleFormSubmit);
    
    elements.toastClose.addEventListener('click', hideToast);
    
    elements.bookFormModal.addEventListener('click', (e) => {
        if (e.target === elements.bookFormModal) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !elements.bookFormModal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

async function initializeApp() {
    try {
        showLoading(true);
        await loadBooks();
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
        showToast('Erro ao carregar dados', 'error');
    } finally {
        showLoading(false);
    }
}

async function loadBooks(searchTerm = '') {
    try {
        const url = searchTerm 
            ? `${API_BASE_URL}/books?search=${encodeURIComponent(searchTerm)}`
            : `${API_BASE_URL}/books`;
            
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            currentBooks = data.data;
            renderBooks(currentBooks);
            updateBooksCount(currentBooks.length);
        } else {
            throw new Error(data.message || 'Erro ao carregar livros');
        }
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
        showToast('Erro ao carregar livros', 'error');
        renderBooks([]);
    }
}

function renderBooks(books) {
    if (books.length === 0) {
        elements.booksContainer.classList.add('hidden');
        elements.emptyState.classList.remove('hidden');
        return;
    }
    
    elements.emptyState.classList.add('hidden');
    elements.booksContainer.classList.remove('hidden');
    
    elements.booksContainer.innerHTML = books.map(book => `
        <div class="book-card" data-book-id="${book.id}">
            <div class="book-title">${escapeHtml(book.titulo)}</div>
            <div class="book-author">por ${escapeHtml(book.autor)}</div>
            <div class="book-details">
                <span class="book-year">${book.ano}</span>
                <span class="book-genre">${escapeHtml(book.genero)}</span>
            </div>
            ${book.descricao ? `<div class="book-description">${escapeHtml(book.descricao)}</div>` : ''}
            <div class="book-actions">
                <button class="btn btn-edit" onclick="editBook(${book.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger" onclick="deleteBook(${book.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');
}

function updateBooksCount(count) {
    elements.booksCount.textContent = `${count} ${count === 1 ? 'livro' : 'livros'}`;
}

async function handleSearch() {
    const searchTerm = elements.searchInput.value.trim();
    showLoading(true);
    await loadBooks(searchTerm);
    showLoading(false);
}

async function clearSearch() {
    elements.searchInput.value = '';
    showLoading(true);
    await loadBooks();
    showLoading(false);
}

function openAddModal() {
    isEditing = false;
    editingBookId = null;
    elements.modalTitle.textContent = 'Adicionar Novo Livro';
    elements.bookForm.reset();
    elements.bookFormModal.style.display = 'block';
    elements.searchInput.focus();
}

async function editBook(bookId) {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
        const data = await response.json();
        
        if (data.success) {
            const book = data.data;
            isEditing = true;
            editingBookId = bookId;
            
            elements.modalTitle.textContent = 'Editar Livro';
            document.getElementById('titulo').value = book.titulo;
            document.getElementById('autor').value = book.autor;
            document.getElementById('ano').value = book.ano;
            document.getElementById('genero').value = book.genero;
            document.getElementById('descricao').value = book.descricao || '';
            
            elements.bookFormModal.style.display = 'block';
        } else {
            throw new Error(data.message || 'Erro ao carregar livro');
        }
    } catch (error) {
        console.error('Erro ao carregar livro:', error);
        showToast('Erro ao carregar dados do livro', 'error');
    } finally {
        showLoading(false);
    }
}

async function deleteBook(bookId) {
    if (!confirm('Tem certeza que deseja excluir este livro?')) {
        return;
    }
    
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Livro excluído com sucesso!', 'success');
            await loadBooks(elements.searchInput.value.trim());
        } else {
            throw new Error(data.message || 'Erro ao excluir livro');
        }
    } catch (error) {
        console.error('Erro ao excluir livro:', error);
        showToast('Erro ao excluir livro', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(elements.bookForm);
    const bookData = {
        titulo: formData.get('titulo').trim(),
        autor: formData.get('autor').trim(),
        ano: parseInt(formData.get('ano')),
        genero: formData.get('genero'),
        descricao: formData.get('descricao').trim()
    };
    
    if (!bookData.titulo || !bookData.autor || !bookData.ano || !bookData.genero) {
        showToast('Por favor, preencha todos os campos obrigatórios', 'warning');
        return;
    }
    
    if (bookData.ano < 1000 || bookData.ano > new Date().getFullYear() + 1) {
        showToast('Por favor, insira um ano válido', 'warning');
        return;
    }
    
    try {
        showLoading(true);
        
        const url = isEditing 
            ? `${API_BASE_URL}/books/${editingBookId}`
            : `${API_BASE_URL}/books`;
            
        const method = isEditing ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            const message = isEditing ? 'Livro atualizado com sucesso!' : 'Livro adicionado com sucesso!';
            showToast(message, 'success');
            closeModal();
            await loadBooks(elements.searchInput.value.trim());
        } else {
            throw new Error(data.message || 'Erro ao salvar livro');
        }
    } catch (error) {
        console.error('Erro ao salvar livro:', error);
        showToast('Erro ao salvar livro', 'error');
    } finally {
        showLoading(false);
    }
}

function closeModal() {
    elements.bookFormModal.style.display = 'none';
    elements.bookForm.reset();
    isEditing = false;
    editingBookId = null;
}

function showLoading(show) {
    if (show) {
        elements.loading.classList.remove('hidden');
    } else {
        elements.loading.classList.add('hidden');
    }
}

function showToast(message, type = 'info') {
    elements.toastMessage.textContent = message;
    elements.toast.className = `toast ${type}`;
    elements.toast.classList.remove('hidden');
    
    setTimeout(() => {
        hideToast();
    }, 5000);
}

function hideToast() {
    elements.toast.classList.add('hidden');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.openAddModal = openAddModal;
window.editBook = editBook;
window.deleteBook = deleteBook;

async function checkAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/test`);
        const data = await response.json();
        console.log('API Status:', data);
    } catch (error) {
        console.error('API não está respondendo:', error);
        showToast('Erro de conexão com o servidor', 'error');
    }
}

checkAPI();