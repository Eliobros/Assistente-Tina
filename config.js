function confButton() {
    // Lógica para abrir a janela de configurações
    const modal = document.createElement('div');
    modal.classList.add('modal');

    // Adiciona conteúdo à janela de configurações
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Configurações</h2>
            <ul>
                <li><button onclick="toggleTheme()">Mudar Tema</button></li>
                <li><button onclick="showSupport()">Suporte</button></li>
                <li><button onclick="changeName()">Alterar Nome</button></li>
                <li><button onclick="logout()">Sair</button></li>
                <li><a href="/politica-privacidade" target="_blank">Política de Privacidade & Termos de Serviços</a></li>
            </ul>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function toggleTheme() {
    // Lógica para mudar o tema
    document.body.classList.toggle('dark-theme');
}

function showSupport() {
    alert("Suporte: Entre em contato com nosso time.");
}

function changeName() {
    const newName = prompt("Digite o novo nome:");
    if (newName) {
        alert("Nome alterado para: " + newName);
    }
}

function logout() {
    alert("Você saiu.");
    // Lógica de logout
}