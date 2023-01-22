using ProjectSignalR.Controllers;
using System.Diagnostics.CodeAnalysis;

namespace ProjectSignalR.Models.ViewModel
{
    public class ChatVM
    {
        public ChatVM()
        {
            Rooms = new List<ChatRoom>();
        }
        public int MaxRoomsAllowed { get; set; }
        public IList<ChatRoom> Rooms { get; set; }
        public string? UserId { get; set; }
        public bool AllowAddRoom => Rooms == null || Rooms.Count < MaxRoomsAllowed;
    }
}
