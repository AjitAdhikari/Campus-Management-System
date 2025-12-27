using Microsoft.AspNetCore.Mvc;
using Chms.Application.Common.Interface;
using Chms.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using ChMS.Web.ViewModels;
using Expense = Chms.Domain.Entities.Expense;
using Chms.Domain.ViewModels.IncomeExpense;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ChMS.Web.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class ExpenseController : ControllerBase
    {
        public readonly IExpenseService _service;
        public readonly IFileUploadService _uploadService;
        private readonly ICurrentUserService _currentUserService;
        public ExpenseController(IExpenseService service, IFileUploadService uploadService, ICurrentUserService currentUserService)
        {
            _service = service;
            _uploadService = uploadService;
            _currentUserService = currentUserService;
        }


        [HttpPost]
        public async Task<ActionResult<int>> Create([FromBody] AddExpense request)
        {
            try
            {
                if (request.Expense.Count == 0 || String.IsNullOrEmpty(request.Date.ToString()))
                {
                    return Ok("Nothing found");
                }

                foreach (var income in request.Expense)
                {
                    Expense entity = new()
                    {
                        Category = income.Category,
                        Amount = income.Amount,
                        ExpenseDate = request.Date,
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
        public async Task<ActionResult> Update([FromBody] AddExpense request)
        {
            if (request.Expense.Count == 0 || String.IsNullOrEmpty(request.Date.ToString()))
            {
                return BadRequest("Invalid Input Data");
            }
            try
            {
                foreach (var income in request.Expense)
                {
                    Expense entity = new()
                    {
                        Id = income.Id,
                        Category = income.Category,
                        Amount = income.Amount,
                        ExpenseDate = request.Date,
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

        [HttpDelete("{expenseDate}")]
        public ActionResult Delete(string expenseDate)
        {
            if (String.IsNullOrEmpty(expenseDate.ToString()))
            {
                return BadRequest("Income Date is not selected");
            }
            try
            {
                _service.Delete(expenseDate);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("{expenseDate}")]
        public ActionResult Get(string expenseDate)
        {
            if(String.IsNullOrEmpty(expenseDate.ToString()))
            {
                return BadRequest("Expense Date is not selected");
            }
            try
            {
                return Ok(_service.Get(expenseDate));
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

        [HttpGet("total-data")]
        public ActionResult TotalData([FromQuery] IncomeFilterQueryVm filterQuery)
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
