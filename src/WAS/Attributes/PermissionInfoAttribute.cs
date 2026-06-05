using System;

namespace WAS.Attributes
{
    [AttributeUsage(AttributeTargets.Field)]
    public class PermissionInfoAttribute : Attribute
    {
        public string Description { get; }

        public PermissionInfoAttribute(string description)
        {
            Description = description;
        }
    }
}
