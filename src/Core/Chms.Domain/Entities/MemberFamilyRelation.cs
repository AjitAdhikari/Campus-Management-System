using Chms.Domain.Common.Enums;
namespace Chms.Domain.Entities;

 public class MemberFamilyRelation
    {
        public int Id { get; set; }
        public Member? Member { get; set; } 
        public Guid MemberId { get; set; }
        public Family? Family { get; set; }
        public int FamilyId { get; set; }
        public Relation Relation { get; set; }
    }