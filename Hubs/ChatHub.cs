using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using ProjectSignalR.Data;
using System.Security.Claims;

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

        public override Task OnConnectedAsync()
        {
            var UserId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!String.IsNullOrEmpty(UserId))
            {
                //we want to retrieve the email of the logged in user
                var userName = _db.Users.FirstOrDefault(u => u.Id == UserId).UserName;
                Clients.Users(HubConnections.OnlineUsers()).SendAsync("RecieveConnectedUser",UserId, userName, HubConnections.HasUser(UserId));
                HubConnections.AddUserConnection(UserId,Context.ConnectionId);
            }
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var UserId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (HubConnections.HasUserConnection(UserId, Context.ConnectionId))
            {
                //we want to retrieve all the user connections
                var userConnections = HubConnections.Users[UserId];
                //we only want to remove one connection that has been disconnected 
                userConnections.Remove(Context.ConnectionId);
                //we want to start clean so we're gonna remove UserId and connections
                HubConnections.Users.Remove(UserId);

                if(userConnections.Any())
                {
                    HubConnections.Users.Add(UserId, userConnections);
                }
            }
            if (!String.IsNullOrEmpty(UserId))
            {
                //we want to retrieve the email of the logged in user
                var userName = _db.Users.FirstOrDefault(u => u.Id == UserId).UserName;
                Clients.Users(HubConnections.OnlineUsers()).SendAsync("RecieveDisconnectedUser", UserId, userName, HubConnections.HasUser(UserId));
                HubConnections.AddUserConnection(UserId, Context.ConnectionId);
            }
            return base.OnDisconnectedAsync(exception);
        }
        //public async Task SendMessageToAll(string user, string message) 
        //{ 
        //    await Clients.All.SendAsync("MessageRecieved", user, message);
        //}
        //[Authorize]
        //public async Task SendMessageToReciever(string sender, string reciever, string message) 
        //{
        //    var userId = _db.Users.FirstOrDefault(u => u.Email.ToLower() == reciever.ToLower()).Id;

        //    if(!string.IsNullOrEmpty(userId))
        //    {
        //        await Clients.User(userId).SendAsync("MessageRecieved", sender, message);
        //    }
        //}
    }
}
