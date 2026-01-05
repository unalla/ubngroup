const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Replace with your actual API Gateway Invoke URL
const API_URL = "https://8p0tjkw1m6.execute-api.us-east-1.amazonaws.com/InvokeAgent"; //"L9sjSWml2KacRnixM12jq2L5nTVueiNW4jDt0Ki8";

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
            headers: { "Content-Type": "application/json", "x-api-key": "L9sjSWml2KacRnixM12jq2L5nTVueiNW4jDt0Ki8" },
            body: JSON.stringify({ inputText: message, sessionId: "user-123" })
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