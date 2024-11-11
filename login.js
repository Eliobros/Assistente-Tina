document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o envio do formulário

    // Lógica para validar o login (pode ser expandida conforme necessidade)
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Aqui você pode adicionar validação ou envio dos dados ao servidor, se necessário

    // Após o login, redireciona para a página "index.html" ou outra página que você desejar
    window.location.href = "chat.html"; // Aqui você coloca o caminho para o arquivo desejado

    // Caso queira esconder o formulário e mostrar o chat, ainda é possível usar:
    // document.getElementById('form-container').style.display = 'none';
    // document.getElementById('chat-container').style.display = 'block';
});
