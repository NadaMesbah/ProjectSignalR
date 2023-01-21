var connectionChat = new signalR.HubConnectionBuilder().withUrl("/hubs/chat").build();

document.getElementById("sendMessage").disabled = true;

connectionChat.on("MessageRecieved", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messageList").append(li);
    li.textContent = `${user} says ${message}`;
    li.style.listStyleType = 'none';
});

document.getElementById("sendMessage").addEventListener("click", function (event) {
    var sender = document.getElementById("senderEmail").value;
    var message = document.getElementById("chatMessage").value;
    var reciever = document.getElementById("recieverEmail").value;

    if (reciever.length > 0) {
        connectionChat.send("sendMessageToReciever", sender, reciever, message);
    } else { 
    //sending a message to all the users
    connectionChat.send("SendMessageToAll", sender, message).catch(function (err) {
        return console.error(err.toString());
    });
    }
    event.preventDefault();
});

connectionChat.start().then(function () {
    document.getElementById("sendMessage").disabled = false;
});
