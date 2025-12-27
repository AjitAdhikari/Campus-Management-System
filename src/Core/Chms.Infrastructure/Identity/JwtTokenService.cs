using Chms.Domain.Entities;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Chms.Infrastructure.Identity
{
    public class JwtTokenService
    {
        private readonly JwtConfig _jwtConfig;
        public JwtTokenService(JwtConfig config)
        {
            _jwtConfig = config;

        }

        public string GenerateJSONWebToken(User user)
        {
            var securityKey = GetSymmetricSecurityKey();

            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("UserId", user.Id.ToString()),
                new Claim("UserGroupId", ((int) user.UserGroup).ToString()),
                new Claim("UserGroup", user.UserGroup.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(_jwtConfig.Issuer,
              _jwtConfig.Issuer,
              claims,
              expires: DateTime.UtcNow.AddDays(30),
              signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        public SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfig.Key));
        }
    }
}