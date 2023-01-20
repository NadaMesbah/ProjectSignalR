//create connection for our SignalR Hub
var connectionUserCount = new signalR.HubConnectionBuilder().withUrl("/hubs/userCount").build();

//connect to methods that hub invokes aka recieve notifications from hub
connectionUserCount.on("updateTotalViews", (value) => {
    var newCountSpan = document.getElementById("totalViewsCounter");
    newCountSpan.innerText = value.toString();
})

//invoke hub methods aka send notification to hub
function newWindowLoadedOnClient()
{
    connectionUserCount.send("NewWindowLoaded");
}

//start connection
function fulfilled() {
    //do something on start
    console.log("Connection to User Hub Successful");
    //Total views in action, its going to increment whenever a new user loads the window or whenever a user refreches the page
    newWindowLoadedOnClient();
}

function rejected() {
    //rejected logs
}

connectionUserCount.start().then(fulfilled, rejected);

