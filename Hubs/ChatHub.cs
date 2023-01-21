using Microsoft.AspNetCore.SignalR;

namespace ProjectSignalR.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessageToAll(string user, string message) 
        { 
            await Clients.All.SendAsync("MessageRecieved", user, message);
        }
    }
}
