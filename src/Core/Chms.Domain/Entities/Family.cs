namespace Chms.Domain.Entities;
public class Family
    {
        public int Id { get; set; }
        public string? SurName { get; set; }
        public Member? FamilyHead { get; set; } 
        public string? PermanentAddress { get; set; }
        public string? TemporaryAddress { get; set; }
    }