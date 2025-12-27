namespace Chms.Infrastructure.Identity
{
    public class JwtConfig
    {
        public JwtConfig(string key, string issuer)
        {
            Key = key;
            Issuer = issuer;
        }
        public string Key { get; init; }
        public string Issuer { get; init; }

    }
}