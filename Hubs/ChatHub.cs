using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using ProjectSignalR.Data;

namespace ProjectSignalR.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _db;
        public ChatHub(ApplicationDbContext db)
        {
            //dependency injection : Constructor Injection
            _db = db;
        }
        public async Task SendMessageToAll(string user, string message) 
        { 
            await Clients.All.SendAsync("MessageRecieved", user, message);
        }
        [Authorize]
        public async Task SendMessageToReciever(string sender, string reciever, string message) 
        {
            var userId = _db.Users.FirstOrDefault(u => u.Email.ToLower() == reciever.ToLower()).Id;

            if(!string.IsNullOrEmpty(userId))
            {
                await Clients.User(userId).SendAsync("MessageRecieved", sender, message);
            }
        }
    }
}
