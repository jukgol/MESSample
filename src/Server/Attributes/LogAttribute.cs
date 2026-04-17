using System;

namespace Server.Attributes
{
    [AttributeUsage(AttributeTargets.Method)]
    public class LogAttribute : Attribute
    {
        public string Message { get; }

        public LogAttribute(string message)
        {
            Message = message;
        }
    }
}
