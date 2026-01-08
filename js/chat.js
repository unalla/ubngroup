const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const loginBtn = document.getElementById("loginBtn");




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
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const values = new Uint32Array(8);
    crypto.getRandomValues(values);
    var randomValue = Array.from(values, (dec) => charset[dec % charset.length]).join('');     
    sessionStorage.setItem('sessionId', "user-"+randomValue);
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

sendBtn.addEventListener("click", handleChat);
userInput.addEventListener("keypress", (e) => { if (e.key === "Enter") handleChat(); });