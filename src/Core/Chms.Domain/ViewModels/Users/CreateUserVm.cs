using System.ComponentModel.DataAnnotations;

namespace Chms.Domain.ViewModels.Users
{
    public class CreateUserVm
    {
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public int UserGroup { get; set; }
        public int IsActive { get; set; }
        public string UserImagePath {get; set;} = null;
        public string UserMetaData {get; set;}
    }

    public class BioDataVm
    {
        public string BioData {get; set;}
        public string FacebookId {get; set;}
        public string InstagramId {get; set;}
        public string Twitter {get; set;}
    }
}