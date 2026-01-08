const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const loginBtn = document.getElementById("loginBtn");


// 1. Generate a secure random string for the code verifier
function generateRandomString(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const values = new Uint32Array(length);
    crypto.getRandomValues(values);
    return Array.from(values, (dec) => charset[dec % charset.length]).join('');
}

// 2. Hash the verifier and encode it to base64url format for Cognito
async function generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function redirectToCognito() {
    // Replace with your values from the Cognito console
    const domain = 'https://ubngroup.auth.us-east-1.amazoncognito.com';
    const clientId = '4cmejouq9l40q5a8dfgr5ekq30';
    const redirectUri = 'https://ubngroup.net';

    const verifier = generateRandomString(64);
    sessionStorage.setItem('code_verifier', verifier);

    const challenge = await generateCodeChallenge(verifier);
    
    const loginUrl = `${domain}/login?client_id=${clientId}&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge=${challenge}&code_challenge_method=S256`;
    
    window.location.assign(loginUrl);
}

async function checkAuth() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const verifier = sessionStorage.getItem('code_verifier');

    if (code && verifier) {
        const domain = 'https://ubngroup.auth.us-east-1.amazoncognito.com';
        const clientId = '4cmejouq9l40q5a8dfgr5ekq30';
        const redirectUri = 'https://ubngroup.net';

        const response = await fetch(`${domain}/oauth2/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: clientId,
                code: code,
                redirect_uri: redirectUri,
                code_verifier: verifier
            })
        });

        const tokens = await response.json();
        console.log("Authenticated! ID Token:", tokens.id_token);
        
        // Clean up URL and storage
        sessionStorage.removeItem('code_verifier');
        window.history.replaceState({}, document.title, "/"); 
        
        // You can now use tokens.id_token to authorize your chatbot requests
        sessionStorage.setItem('id_token', tokens.id_token);
        console.log("Authentication successful!");
    }
}

async function generateSessionId()
{
    sessionStorage.setItem('sessionId', "user-"+generateRandomString(8));
}

// Run on page load
generateSessionId();
checkAuth();

// Replace with your actual API Gateway Invoke URL
const API_URL = "https://8p0tjkw1m6.execute-api.us-east-1.amazonaws.com/prod/InvokeAgent"; 

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    chatLi.innerHTML = `<p>${message}</p>`;
    return chatLi;
};

const handleChat = async () => {
    const message = userInput.value.trim();
    if (!message) return;

    // Append user message
    chatbox.appendChild(createChatLi(message, "outgoing"));
    userInput.value = "";
    chatbox.scrollTo(0, chatbox.scrollHeight);

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem('id_token') 
             },
            body: JSON.stringify({ inputText: message, sessionId: sessionStorage.getItem('sessionId') })
        });

        const data = await response.json();
        // The response structure depends on your Lambda's return object
        const botMessage = data.response || data.message || "I couldn't process that.";
        
        chatbox.appendChild(createChatLi(botMessage, "incoming"));
    } catch (error) {
        chatbox.appendChild(createChatLi("Error: Could not connect to the server.", "incoming"));
    }
    chatbox.scrollTo(0, chatbox.scrollHeight);
};
loginBtn.addEventListener("click", redirectToCognito);
sendBtn.addEventListener("click", handleChat);
userInput.addEventListener("keypress", (e) => { if (e.key === "Enter") handleChat(); });