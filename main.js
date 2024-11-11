// Importa os módulos do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBxml_34BiDbOmMxclzM-UnFzke9ymcf8A",
    authDomain: "tina-chat-87cc1.firebaseapp.com",
    projectId: "tina-chat-87cc1",
    storageBucket: "tina-chat-87cc1.firebasestorage.app",
    messagingSenderId: "518858413060",
    appId: "1:518858413060:web:86c6cb8f5094a9b5291151",
    measurementId: "G-CB39SE8MQZ"
};

// Inicializa o Firebase e o Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para carregar mensagens do Firestore
async function carregarMensagens() {
    try {
        console.log("Carregando mensagens...");
        const messagesQuery = query(collection(db, "messages"), orderBy("timestamp"));
        const querySnapshot = await getDocs(messagesQuery);

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            appendMessage(data.sender, data.message, data.time);
        });
        console.log("Mensagens carregadas com sucesso.");
    } catch (error) {
        console.error("Erro ao carregar as mensagens do Firestore:", error);
    }
}

// Função para salvar uma mensagem no Firestore
async function salvarMensagem(sender, messageText, time) {
    try {
        console.log("Salvando mensagem no Firestore:", messageText);
        await addDoc(collection(db, "messages"), {
            sender: sender,
            message: messageText,
            time: time,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Erro ao salvar a mensagem no Firestore:", error);
    }
}

// O restante do seu código, como `sendMessage`, `appendMessage`, etc., deve permanecer como estava

const API_KEY = 'app-hWyXMuzlYLsodBKfZH5BhXR6';  // Substitua com sua chave da API Dify
const DIFY_API_URL = 'https://api.dify.ai/v1/chat-messages';

let userName = ''; // Variável para armazenar o nome do usuário
let chatHistory = [];  // Array para armazenar o histórico da conversa

document.addEventListener('DOMContentLoaded', carregarMensagens); // Carregar mensagens ao carregar a página

// Função para definir o nome do usuário após login/cadastro
function setUserName(name) {
    userName = name;
    console.log("Nome do usuário definido:", userName);
}

async function sendMessage() {
    const messageInput = document.getElementById('userMessage');
    const messageText = messageInput.value.trim();

    if (messageText !== "") {
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        console.log("Enviando mensagem:", messageText);
        
        // Adiciona a mensagem ao histórico
        chatHistory.push({ sender: 'user', message: `${userName}: ${messageText}`, time: currentTime });
        appendMessage('user', `${userName}: ${messageText}`, currentTime);
        salvarMensagem('user', `${userName}: ${messageText}`, currentTime);
        
        messageInput.value = "";
        scrollToBottom();

        if (messageText.toLowerCase() === "pagamento") {
            const payment_url = "https://tinapagamentos.netlify.app/";
            const paymentMessage = `Assistente Tina: Você pode realizar o pagamento através do seguinte link: ${payment_url}`;
            chatHistory.push({ sender: 'bot', message: paymentMessage, time: currentTime });
            appendMessage('bot', paymentMessage, currentTime);
            salvarMensagem('bot', paymentMessage, currentTime);
        } else {
            // Passa o histórico para a API
            const response = await sendMessageToAPI(messageText, chatHistory);
            if (response) {
                const botMessage = response.answer || 'Desculpe, não consegui entender sua pergunta.';
                chatHistory.push({ sender: 'bot', message: `Assistente Tina: ${botMessage}`, time: currentTime });
                appendMessage('bot', `Assistente Tina: ${botMessage}`, currentTime);
                salvarMensagem('bot', `Assistente Tina: ${botMessage}`, currentTime);
            } else {
                appendMessage('bot', 'Assistente Tina: Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.', currentTime);
                salvarMensagem('bot', 'Assistente Tina: Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.', currentTime);
            }
        }
        scrollToBottom();
    } else {
        console.log("Campo de mensagem está vazio.");
    }
}

async function sendMessageToAPI(userMessage, chatHistory) {
    try {
        const data = {
            query: userMessage,
            inputs: {},
            response_mode: "blocking",
            user: `${Date.now()}`,
            conversation_id: "",
            files: [],
            context: chatHistory  // Envia o histórico da conversa
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
            console.error('Erro na resposta da API:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Erro ao chamar a API:', error);
        alert('Ocorreu um erro ao chamar a API. Tente novamente mais tarde.');
        return null;
    }
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

    const chatBox = document.getElementById('chatBox');
    if (chatBox) {
        chatBox.appendChild(messageContainer);
    }
}

function scrollToBottom() {
    const chatBox = document.getElementById('chatBox');
    if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Verifica se os elementos de entrada e botão estão sendo referenciados corretamente
const sendMessageButton = document.getElementById('sendMessage');
const userMessageInput = document.getElementById('userMessage');

if (sendMessageButton && userMessageInput) {
    sendMessageButton.addEventListener('click', sendMessage);
    userMessageInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
} else {
    console.error("Elemento de entrada ou botão de envio não encontrado.");
}
