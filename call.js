
// script.js

const API_KEY = 'app-hWyXMuzlYLsodBKfZH5BhXR6';
const DIFY_API_URL = 'https://api.dify.ai/v1/chat-messages';

// Configurando o reconhecimento de fala
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'pt-BR'; // Mudei para português do Brasil
recognition.interimResults = false;
recognition.continuous = true;

const logo = document.getElementById('logo');
const speakButton = document.getElementById('speak-button');

speakButton.addEventListener('click', () => {
    logo.classList.add('listening');
    recognition.start();
});

recognition.onend = () => {
    logo.classList.remove('listening');
};

recognition.onresult = async (event) => {
    const userSpeech = event.results[0][0].transcript;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    appendMessage('user', userSpeech, currentTime);
    salvarMensagem('user', userSpeech, currentTime);

    const response = await sendMessageToAPI(userSpeech);

    if (response) {
        const botMessage = response.answer || 'Desculpe, não consegui entender sua pergunta.';
        const donationMessage = createDonationMessage(botMessage);
        appendMessage('bot', donationMessage, currentTime);
        salvarMensagem('bot', donationMessage, currentTime);

        // Responder em voz usando ResponsiveVoice
        responsiveVoice.speak(botMessage, "Portuguese Female", { rate: 1, pitch: 1 });
    } else {
        appendMessage('bot', 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.', currentTime);
        salvarMensagem('bot', 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.', currentTime);
    }
};

async function sendMessageToAPI(userMessage) {
    try {
        const data = {
            query: userMessage,
            inputs: {},
            response_mode: "blocking",
            user: "12345",
            conversation_id: "",
            files: []
        };

        const headers = {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        };

        const response = await fetch(DIFY_API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Resposta da API:', responseData);
            return responseData;
        } else {
            console.error('Erro na resposta da API');
            return null;
        }
    } catch (error) {
        console.error('Erro ao chamar a API:', error);
        return null;
    }
}

function createDonationMessage(botMessage) {
    return (
        `Por favor ajude a Tina e a empresa Eliobros Tech, fazendo uma pequena doação para manter os trabalhos funcionando. ` +
        `Faça uma doação de pelo menos 10 meticais ou 5 reais pelos seguintes métodos:\n\n` +
        `M-pesa: 841617651\nE-mola: 862840075\nPaypal: habibosalimo0@gmail.com\nPix: eliobrostech3@gmail.com\n\n` +
        `**Sua mensagem abaixo**\n_____________________\n${botMessage}`
    );
}

function appendMessage(sender, messageText, time) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message', sender);

    const messageBubble = document.createElement('div');
    messageBubble.classList.add('message-bubble');
    messageBubble.textContent = messageText;

    const messageTime = document.createElement('span');
    messageTime.classList.add('message-time');
    messageTime.textContent = time;

    messageBubble.appendChild(messageTime);
    messageContainer.appendChild(messageBubble);

    document.getElementById('chatBox').appendChild(messageContainer);
    scrollToBottom();
}

function salvarMensagem(sender, messageText, time) {
    let mensagens = JSON.parse(sessionStorage.getItem('chat')) || [];
    mensagens.push({ sender, message: messageText, time });
    sessionStorage.setItem('chat', JSON.stringify(mensagens));
}

function carregarMensagens() {
    const mensagens = JSON.parse(sessionStorage.getItem('chat')) || [];
    mensagens.forEach(mensagem => appendMessage(mensagem.sender, mensagem.message, mensagem.time));
}

function scrollToBottom() {
    const chatBox = document.getElementById('chatBox');
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.addEventListener('DOMContentLoaded', carregarMensagens);