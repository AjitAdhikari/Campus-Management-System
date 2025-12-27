// using ChMS.Core.Application.Groups;
// using ChMS.Web.ViewModels;
// using Microsoft.AspNetCore.Mvc;

// namespace ChMS.Web.Controllers;


// [ApiController]
// [Route("[controller]")]
// public class GroupController : ControllerBase
// {
//     private readonly IGroupRepository _repository;

//     public GroupController(IGroupRepository repository)
//     {
//         _repository = repository;
//     }

//     [HttpPost]
//     public async Task<ActionResult<int>> Create([FromBody] CreateGroupVM request)
//     {
//         var response = await _repository.Create(new Group{
//             Name = request.Name,
//             Description = request.Description,
//             FellowshipRoutine = request.FellowshipRoutine
//         });
//         return Ok(response);
//     }


//     [HttpPut]
//     public ActionResult Update([FromBody] UpdateGroupVm request)
//     {
//         return Ok(_repository.Update(new Group{
//             Id = request.Id,
//             Name = request.Name,
//             Description = request.Description,
//             FellowshipRoutine = request.FellowshipRoutine
//         }));
//     }

//      [HttpDelete("{id}")]
//     public ActionResult Delete(int id)
//     {
//         _repository.Delete(id);
//         return Ok();
//     }

//     [HttpGet("{id}")]
//     public ActionResult Get(int id)
//     {
//         return Ok(_repository.Get(id));
//     }

//     [HttpGet("list")]
//     public ActionResult List()
//     {
//         return Ok(_repository.List());
//     }

// }
