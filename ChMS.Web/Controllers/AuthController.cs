using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Chms.Application.Common.Interface;
using Chms.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ChMS.Web.ViewModels;
using Chms.Infrastructure.Identity;
using Chms.Application.Common.Interface.Repositories;

namespace Kpo.WebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IUserQueryRepository _userQueryRepository;
        private readonly JwtTokenService _tokenService;
        public AuthController(SignInManager<ApplicationUser> signInManager, JwtTokenService tokenService,
            IUserQueryRepository identityService)
        {
            _signInManager = signInManager;
            _tokenService = tokenService;
            _userQueryRepository = identityService;
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequest entity)
        {
            var result = await _signInManager.PasswordSignInAsync(entity.UserName, entity.Password, true, false);
            System.Console.WriteLine(result);
            if (result.Succeeded)
            {
                User user = await _userQueryRepository.GetByUserName(entity.UserName);
                //IList<Claim> claimList= await _userService.GetUserClaims(user.Id);
                // return Ok(new { 
                //     token = _tokenService.GenerateJSONWebToken(user , await _userService.GetUserClaims(user.Id)),
                //     claims = claimList.Select(x => x.Type).ToList()
                //      });
                return Ok(new { 
                    token = _tokenService.GenerateJSONWebToken(user)
                     });
                
            }
            return BadRequest(entity);
        }
    }
}