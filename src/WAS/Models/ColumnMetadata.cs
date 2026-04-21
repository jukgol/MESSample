namespace WAS.Models
{
    public class ColumnMetadata
    {
        public string Name { get; set; } = string.Empty;
        public string DataType { get; set; } = string.Empty;
        public bool IsNullable { get; set; }
        public bool IsIdentity { get; set; }
        public bool HasDefault { get; set; }
    }
}

