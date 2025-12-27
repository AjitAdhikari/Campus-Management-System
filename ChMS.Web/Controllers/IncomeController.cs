using Microsoft.AspNetCore.Mvc;
using Chms.Application.Common.Interface;
using Chms.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using ChMS.Web.ViewModels;
using Income = Chms.Domain.Entities.Income;
using Chms.Domain.ViewModels.IncomeExpense;
using Microsoft.AspNetCore.Identity;
using Microsoft.VisualBasic;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ChMS.Web.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class IncomeController : ControllerBase
    {
        public readonly IIncomeService _service;
        public readonly IFileUploadService _uploadService;
        private readonly ICurrentUserService _currentUserService;
        public IncomeController(IIncomeService service, IFileUploadService uploadService, ICurrentUserService currentUserService)
        {
            _service = service;
            _uploadService = uploadService;
            _currentUserService = currentUserService;
        }


        [HttpPost]
        public async Task<ActionResult<int>> Create([FromBody] AddIncome request)
        {
            try
            {
                if (request.Income.Count == 0 || String.IsNullOrEmpty(request.Date.ToString()))
                {
                    return Ok("Nothing found");
                }

                foreach (var income in request.Income)
                {
                    Income entity = new()
                    {
                        Category = income.Category,
                        Amount = income.Amount,
                        IncomeDate = request.Date,
                        MemberId = income.MemberId,
                        Description = income.Description,
                        CreatedBy = _currentUserService.UserId
                    };
                    await _service.Create(entity);
                }

                return Ok();

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
           
        }


        [HttpPut]
        public async Task<ActionResult> Update([FromBody] EditIncome request)
        {
            if (request.Income.Count == 0 || String.IsNullOrEmpty(request.Date.ToString()))
            {
                return BadRequest("Invalid Input Data");
            }
            try
            {
                foreach (var income in request.Income)
                {
                    Income entity = new()
                    {
                        Id = income.Id,
                        Category = income.Category,
                        Amount = income.Amount,
                        IncomeDate = request.Date,
                        MemberId = income.MemberId,
                        Description = income.Description,
                        UpdatedDate = DateTime.Now,
                        UpdatedBy = _currentUserService.UserId
                    };
                    await _service.Update(entity);
                }

                return Ok();

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{incomeDate}")]
        public ActionResult Delete(string incomeDate)
        {
            if (String.IsNullOrEmpty(incomeDate.ToString()))
            {
                return BadRequest("Income Date is not selected");
            }
            try
            {
                _service.Delete(incomeDate);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("{incomeDate}")]
        public ActionResult Get(string incomeDate)
        {
            if(String.IsNullOrEmpty(incomeDate.ToString()))
            {
                return BadRequest("Income Date is not selected");
            }
            try
            {
                return Ok(_service.Get(incomeDate));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("list")]
        public ActionResult List([FromQuery] IncomeFilterQueryVm filterQuery)
        {
            var date = DateTime.Now;
            var firstDayOfMonth = new DateTime(date.Year, date.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
            filterQuery.StartDate ??= firstDayOfMonth.ToString("yyyy-MM-dd");
            filterQuery.EndDate ??= lastDayOfMonth.ToString("yyyy-MM-dd");

            FilterVm filterVm = new(){
                StartDate = filterQuery.StartDate,
                EndDate = filterQuery.EndDate,
            };
            return Ok(_service.List(filterVm));
        }


        [HttpGet("total-income")]
        public ActionResult TotalCount([FromQuery] IncomeFilterQueryVm filterQuery)
        {
            var date = DateTime.Now;
            var firstDayOfMonth = new DateTime(date.Year, date.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);
            filterQuery.StartDate ??= firstDayOfMonth.ToString("yyyy-MM-dd");
            filterQuery.EndDate ??= lastDayOfMonth.ToString("yyyy-MM-dd");

            FilterVm filterVm = new(){
                StartDate = filterQuery.StartDate,
                EndDate = filterQuery.EndDate,
            };
            return Ok(_service.TotalDataCount(filterVm));
        }
    }
}
