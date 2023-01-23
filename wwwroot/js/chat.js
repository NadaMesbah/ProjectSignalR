var connectionC = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/chat")
    .withAutomaticReconnect([0, 1000, 5000, null])
    .build();

connectionC.on("RecieveConnectedUser", function (userId, userName, isOldConnection) {
    if (!isOldConnection)
    {
        addMessage(`${userName} is online`);
    }   
});

function addMessage(msg) {
    if (msg == null && msg == '') {
        return;
    }
    let ul = document.getElementById("messagesList");
    let li = document.createElement("li");
    li.style.listStyleType = 'none';
    li.innerHTML = msg;
    ul.appendChild(li);
}

connectionC.start();