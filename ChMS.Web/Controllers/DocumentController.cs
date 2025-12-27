using Chms.Application.Common.Interface;
using Chms.Domain.Entities;
using ChMS.Web.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Dapper.SqlMapper;
using Chms.Domain.ViewModels.Documents;

namespace ChMS.Web.Controllers;

[ApiController]
[Route("[controller]")]
//[Authorize]
public class DocumentController : ControllerBase
{
    public readonly IDocumentService _service;
    private readonly IFileUploadService _fileUploadService;
    private readonly IWebHostEnvironment _env;
    private readonly ICurrentUserService _currentUserService;


    public DocumentController(IDocumentService service, IFileUploadService fileUploadService, IWebHostEnvironment env, ICurrentUserService currentUserService)
    {
        _service = service;
        _fileUploadService = fileUploadService;
        _env = env;
        _currentUserService = currentUserService;
    }

    [HttpPost]
    public async Task<ActionResult<string>> Create([FromForm] CreateDocumentVm request)
    {      
        var entity = new Document
        {
            Name = request.Name,
            Description = request.Description,
            Type = request.File.ContentType,
            Size = request.File.Length.ToString(),
            CreatedBy = _currentUserService.UserId
            
        };
        if (request.File!= null)
        {
            entity.Path = await _fileUploadService.UploadFile(request.File);
        }
        var response = await _service.Create(entity);
        return Ok(response);
    }


    [HttpPut]
    public async Task<ActionResult> Update([FromForm] EditDocumentVm request)
    {
        var entity = new Document
        {
            Id = request.Id,
            Name = request.Name,
            Description = request.Description,
            Path = request.Path,
            Type = request.Type,
            Size = request.Size,
            UpdatedBy = _currentUserService.UserId,
            UpdatedDate = DateTime.Now
        };
        await _service.Update(entity);
        return Ok();
    }

     [HttpDelete("{id}")]
    public ActionResult Delete(string id)
    {
        _service.Delete(id);
        return Ok();
    }

    [HttpGet("{id}")]
    public ActionResult Get(string id)
    {
        return Ok(_service.Get(id));
    }


    [HttpGet("download/{id}")]
    public IActionResult DownloadFile(string id)
    {
        Document document= _service.Get(id);

        var filePath = document.Path; // Specify the path to your file
        if (!System.IO.File.Exists(_env.WebRootPath + filePath) || String.IsNullOrEmpty(filePath))
        {
            return NotFound(); // Return a 404 if the file doesn't exist
        }

        var extension  = filePath?.Split(".")[1];
        var fileName = string.Concat(document.Name,".", extension); // The name the file will have when downloaded
        var memory = new MemoryStream();
        using (var stream = new FileStream(_env.WebRootPath + filePath, FileMode.Open))
        {
            stream.CopyTo(memory);
        }
        memory.Position = 0;
        if(document.Type != null)
        {
            return File(memory, document.Type, fileName);
        }
         return NotFound(); 
    }

    [HttpGet("list")]
    public ActionResult List([FromQuery] DocFilterQueryVm filterQuery)
    {
        FilterVm filterVm = new()
        {
            Name = filterQuery.Name,
            CreatedDate = filterQuery.CreatedDate,
            Offset = filterQuery.Offset,
            Limit = filterQuery.Limit,
        };


        DocListResponseVm response = new()
        {
            Items = _service.List(filterVm),
            TotalDataCount = _service.TotalDataCount(filterVm)
        };
        return Ok(response);
    }
}