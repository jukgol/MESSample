using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace WAS.Hubs
{
    [Authorize]
    public class ProcessMonitoringHub : Hub
    {
    }
}
