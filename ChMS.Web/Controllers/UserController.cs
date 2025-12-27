using Chms.Application.Common.Exceptions;
using Chms.Application.Common.Interface;
using Chms.Domain.ViewModels.Users;
using ChMS.Web.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace ChMS.Web.Controllers;
[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _service;
    private readonly ICurrentUserService _currentUserService;
    public UserController(IUserService service, ICurrentUserService currentUserService)
    {
        _service = service;
        _currentUserService = currentUserService;
    }

    [HttpPut("update-password")]
    public async Task<ActionResult<bool>> UpdatePassword([FromBody] UpdatePassword request)
    {
        try
        {
            if(request.Id == 0)
            {
                request.Id = _currentUserService.UserId;
            }

            if(request.Password != request.ConfirmPassword)
            {
                return BadRequest("Password and Confirm Password doesn't match");
            }

            if(!request.Password.IsNullOrEmpty())
            {
                return await _service.UpdatePassword(request.Id, request.Password);
            }
            return BadRequest("Something went wrong");
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost]
    public async Task<ActionResult<long>> CreateUser([FromBody] CreateUserVm request)
    {
        try
        {
            request.UserName = request.UserName.Trim().ToLower();
            request.Password = request.Password.Trim();
            var id = await _service.Create(request);
            return id;
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<EditUserVm>> GetUserById(int id)
    {
        try
        {
            return Ok(await _service.Get(id));
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }

    }
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateUser([FromBody] EditUserVm request)
    {
        try
        {
            //EditUserValidator validator = new();
            //ValidationService.Validate(await validator.ValidateAsync(request));
            await _service.Update(request);
            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<bool>> DeleteUser(long id)
    {
        try
        {
            return await _service.Delete(id);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }



}