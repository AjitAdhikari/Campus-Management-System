using Microsoft.AspNetCore.Mvc;
using Chms.Application.Common.Interface;
using Chms.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using ChMS.Web.ViewModels;
using Chms.Domain.ViewModels.Members;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ChMS.Web.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class MemberController : ControllerBase
    {
        public readonly IMemberService _service;
        public readonly IFileUploadService _uploadService;
        private readonly ICurrentUserService _currentUserService;
        public MemberController(IMemberService service, IFileUploadService uploadService, ICurrentUserService currentUserService)
        {
            _service = service;
            _uploadService = uploadService;
            _currentUserService = currentUserService;
        }


        [HttpPost]
        public async Task<ActionResult<int>> Create([FromForm] CreateMemberVm request)
        {
            var entity = new Member
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                MembershipDate = request.MembershipDate,
                BaptizedDate    = request.BaptizedDate,
                PermanentAddress = request.PermanentAddress,
                TemporaryAddress   = request.TemporaryAddress,
                Gender  = request.Gender,
                MiddleName = request.MiddleName,
                PhoneNumber = request.PhoneNumber,
                SecondaryPhoneNumber = request.SecondaryPhoneNumber,
                BirthDate  = request.BirthDate,
                Occupation = request.Occupation,
                CreatedBy = _currentUserService.UserId
            };

            if (request.PhotoFile != null)
            {
                entity.Photo = await _uploadService.UploadFile(request.PhotoFile);
            }

            var response = await _service.Create(entity);
            return Ok(response);
        }


        [HttpPut]
        public async Task<ActionResult> Update([FromForm] EditMemberVm request)
        {
            var entity = new Member
            {
                Id = request.Id,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                MembershipDate = request.MembershipDate,
                BaptizedDate = request.BaptizedDate,
                PermanentAddress = request.PermanentAddress,
                TemporaryAddress = request.TemporaryAddress,
                Gender = request.Gender,
                MiddleName = request.MiddleName,
                PhoneNumber = request.PhoneNumber,
                SecondaryPhoneNumber = request.SecondaryPhoneNumber,
                BirthDate = request.BirthDate,
                Photo = request.Photo,
                Occupation = request.Occupation,
                UpdatedBy = _currentUserService.UserId,
                UpdatedDate = DateTime.Now
            };

            if (request.PhotoFile != null)
            {
                entity.Photo = await _uploadService.UploadFile(request.PhotoFile);
            }
            await _service.Update(entity);
            return Ok();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(Guid id)
        {
            _service.Delete(id);
            return Ok();
        }

        [HttpGet("{id}")]
        public ActionResult Get(Guid id)
        {
            return Ok(_service.Get(id));
        }

        [HttpGet("list")]
        public ActionResult List([FromQuery] MembFilterQueryVm filterQuery)
        {
            FilterVm filterVm = new(){
                Name = filterQuery.Name,
                PhoneNumber = filterQuery.PhoneNumber,
                Gender = filterQuery.Gender,
                Offset = filterQuery.Offset,
                Limit = filterQuery.Limit,
            };

            MemberListResponseVm response = new(){
                Items = _service.List(filterVm),
                TotalDataCount = _service.TotalDataCount(filterVm)
            };
            return Ok(response);
        }

        [HttpGet("active-member")]
        public ActionResult ListKeyPair()
        {
            try
            {
                List<MemberListVM> members = _service.ListActiveMember();
                return Ok(members);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
