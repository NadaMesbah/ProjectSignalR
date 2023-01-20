using Microsoft.AspNetCore.SignalR;

namespace ProjectSignalR.Hubs
{
    //the hub runs in the server side
    //it does some processing and it's responsible to tell the clients about them so that they can use them or display them on the website
    public class UserHub : Hub
    {
        public static int TotalViews { get; set; } = 0;
        public static int TotalUsers { get; set; } = 0;
        public override Task OnConnectedAsync()
        {
            TotalUsers++;
            Clients.All.SendAsync("updateTotalUsers", TotalUsers).GetAwaiter().GetResult();
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            TotalUsers--;
            Clients.All.SendAsync("updateTotalUsers", TotalUsers).GetAwaiter().GetResult();
            return base.OnDisconnectedAsync(exception);
        }
        public async Task NewWindowLoaded()
        {
            TotalViews++;
            //send to all the clients that total views has been updated
            //updateTotalViews will be located inside the client side of the app
            await Clients.All.SendAsync("updateTotalViews", TotalViews);
        }
    }
}
