var connectionC = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/chat")
    .withAutomaticReconnect([0, 1000, 5000, null])
    .build();

connectionC.on("RecieveConnectedUser", function (userId, userName) {
        addMessage(`${userName} has joined`);
});

connectionC.on("RecieveDisconnectedUser", function (userId, userName) {
        addMessage(`${userName} has left`);
});

connectionC.on("RecieveAddRoomMessage", function (maxRoom, roomId, roomName, userId, userName) {
    addMessage(`${userName} has created room ${roomName}`);
    fillRoomDropDown();
});

connectionC.on("RecieveDeleteRoomMessage", function (deleted, selected, roomName, userName) {
    addMessage(`${userName} has deleted room ${roomName}`);
});

function addNewRoom(maxRoom) {

    let createRoomName = document.getElementById('createRoomName');

    var roomName = createRoomName.value;

    if (roomName == null && roomName == '') {
        return;
    }
    /*POST*/
    $.ajax({
        url: '/ChatRooms/PostChatRoom',
        dataType: "json",
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ id: 0, name: roomName }),
        async: true,
        processData: false,
        cache: false,
        success: function (json) {
            /*ADD ROOM COMPLETED SUCCESSFULLY*/
            connection.invoke("SendAddRoomMessage", maxRoom, json.id, json.name);
            createRoomName.value = '';
        },
        error: function (xhr) {
            alert('error');
        }
    })
}

function deleteRoom() {

    let ddlDelRoom = document.getElementById('ddlDelRoom');

    var roomName = ddlDelRoom.options[ddlDelRoom.selectedIndex].text;

    let text = `Do you want to delete Chat Room ${roomName}?`;
    if (confirm(text) == false) {
        return;
    }

    if (roomName == null && roomName == '') {
        return;
    }

    let roomId = ddlDelRoom.value;

    $.ajax({
        url: `/ChatRooms/DeleteChatRoom/${roomId}`,
        dataType: "json",
        type: "DELETE",
        contentType: 'application/json;',
        async: true,
        processData: false,
        cache: false,
        success: function (json) {

            /*ADD ROOM COMPLETED SUCCESSFULLY*/
            connection.send("SendDeleteRoomMessage", json.deleted, json.selected, roomName);
            fillRoomDropDown();
        },
        error: function (xhr) {
            alert('error');
        }
    })
}

document.addEventListener('DOMContentLoaded', (event) => {
    //we're calling them when the DOM is loaded
    fillRoomDropDown();
    fillUserDropDown();
})

function fillUserDropDown() {
    $.getJSON('/ChatRooms/GetChatUser')
        .done(function (json) {

            var ddlSelUser = document.getElementById("ddlSelUser");

            ddlSelUser.innerText = null;

            json.forEach(function (item) {
                var newOption = document.createElement("option");

                newOption.text = item.userName;//item.whateverProperty
                newOption.value = item.id;
                ddlSelUser.add(newOption);
            });
        })
        .fail(function (jqxhr, textStatus, error) {

            var err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });
}

function fillRoomDropDown() {
    $.getJSON('/ChatRooms/GetChatRoom')
        .done(function (json) {
            var ddlDelRoom = document.getElementById("ddlDelRoom");
            var ddlSelRoom = document.getElementById("ddlSelRoom");

            ddlDelRoom.innerText = null;
            ddlSelRoom.innerText = null;

            json.forEach(function (item) {
                var newOption = document.createElement("option");

                newOption.text = item.name;
                newOption.value = item.id;
                ddlDelRoom.add(newOption);


                var newOption1 = document.createElement("option");

                newOption1.text = item.name;
                newOption1.value = item.id;
                ddlSelRoom.add(newOption1);

            });
        })
        .fail(function (jqxhr, textStatus, error) {

            var err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });
}

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