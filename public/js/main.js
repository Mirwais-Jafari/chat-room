(function () {
  const socket = io();
  const app = document.querySelector(".app");
  let uname;

  function joinUser() {
    let username = app.querySelector(".join-screen #username").value;
    if (username.length == 0) {
      return;
    }
    socket.emit("newuser", username);
    uname = username;

    // Display the username
  let usernameDisplay = app.querySelector(".display-username");
  usernameDisplay.textContent = uname;

    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
  }


  function sendMessage() {
    let message = app.querySelector(".chat-screen #message-input").value;
    if (message.length == 0) {
      return;
    }
    renderMessage("my", {
      username: uname,
      text: message,
    });
    socket.emit("chat", {
      username: uname,
      text: message,
    });
    app.querySelector(".chat-screen #message-input").value = "";
  }

  function exitChat() {
    socket.emit("exituser", uname);
    window.location.href = window.location.href;
  }

  app
    .querySelector(".join-screen #join-user")
    .addEventListener("click", joinUser);
  app
    .querySelector(".chat-screen #send-message")
    .addEventListener("click", sendMessage);
  app
    .querySelector(".chat-screen #exit-chat")
    .addEventListener("click", exitChat);

  socket.on("update", function (message) {
    renderUpdateMessage(message);
  });

  socket.on("chat", function (message) {
    renderMessage("other", message);
  });

  function renderUpdateMessage(message) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    let el = document.createElement("div");
    el.classList.add("message", "update-message");
    el.innerText = message;
    messageContainer.appendChild(el);
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
  }

  function renderMessage(type, message) {
    // Get current date and time
  let currentDate = new Date();
  let time = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  let month = currentDate.toLocaleString('default', { month: 'long' });
  let day = currentDate.getDay();

    let messageContainer = app.querySelector(".chat-screen .messages");
    let el = document.createElement("div");
    el.classList.add("message", type === "my" ? "my-message" : "other-message");
    el.innerHTML = `
      <div>
        <div class="name">${type === "my" ? "You" : message.username}</div>
        <div class="text">${message.text}</div>
        <div class="time">${time} | ${month} ${day}</div>
        </div>
    `;
    messageContainer.appendChild(el);
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
  }
})();
