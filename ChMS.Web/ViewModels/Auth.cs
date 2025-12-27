namespace ChMS.Web.ViewModels
{
    public class LoginRequest
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
    public class LoginResponse
    {
        public string Token { get; set; }
        public string[] Claims {get; set;}
    }
}