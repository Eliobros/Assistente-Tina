// Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  sendEmailVerification, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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

// Inicializando Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Função para redirecionar ao chat
function redirectToChat(uid) {
  window.location.href = `chat.html?uid=${uid}`;
}

// Salvar dados do usuário no Firestore
async function saveUserData(uid, name, email) {
  try {
    await setDoc(doc(db, "users", uid), {
      name: name,
      email: email,
      createdAt: new Date().toISOString(),
    });
    console.log("Dados do usuário salvos com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar os dados no Firestore:", error.message);
  }
}

// Cadastro de usuário
function registerUser() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      sendEmailVerification(user).then(() => {
        alert("E-mail de verificação enviado!");
      });
      saveUserData(user.uid, name, email);
    })
    .catch((error) => alert(error.message));
}

// Login de usuário
function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (user.emailVerified) {
        redirectToChat(user.uid);
      } else {
        alert("E-mail não verificado.");
      }
    })
    .catch((error) => alert(error.message));
}

// Login com Google
function loginWithGoogle() {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      const user = result.user;
      redirectToChat(user.uid);
    })
    .catch((error) => alert(error.message));
}

// Resetar senha
function resetPassword() {
  const email = document.getElementById("resetEmail").value;

  sendPasswordResetEmail(auth, email)
    .then(() => alert("E-mail de redefinição enviado!"))
    .catch((error) => alert(error.message));
}

// Reenviar e-mail de verificação
function resendVerificationEmail() {
  const user = auth.currentUser;

  if (user) {
    sendEmailVerification(user)
      .then(() => {
        alert("Um novo e-mail de verificação foi enviado.");
      })
      .catch((error) => {
        console.error("Erro ao reenviar e-mail de verificação:", error.message);
      });
  } else {
    alert("Nenhum usuário conectado.");
  }
}

// Adicionar event listeners após carregar o DOM
document.addEventListener("DOMContentLoaded", () => {
  // Botões de ações
  document.getElementById("loginBtn").addEventListener("click", loginUser);
  document.getElementById("googleLoginBtn").addEventListener("click", loginWithGoogle);
  document.getElementById("registerBtn").addEventListener("click", registerUser);
  document.getElementById("googleRegisterBtn").addEventListener("click", loginWithGoogle);
  document.getElementById("resetPasswordBtn").addEventListener("click", resetPassword);

  // Alternar entre as telas
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const resetPasswordForm = document.getElementById("resetPasswordForm");

  document.getElementById("toRegister").addEventListener("click", () => {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  });

  document.getElementById("toLoginFromRegister").addEventListener("click", () => {
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  });

  document.getElementById("toResetPassword").addEventListener("click", () => {
    loginForm.style.display = "none";
    resetPasswordForm.style.display = "block";
  });

  document.getElementById("toLoginFromReset").addEventListener("click", () => {
    resetPasswordForm.style.display = "none";
    loginForm.style.display = "block";
  });
});