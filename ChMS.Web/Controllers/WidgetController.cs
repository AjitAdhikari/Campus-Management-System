using Chms.Application.Common.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChMS.Web.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class WidgetController : ControllerBase
    {
        public readonly IWidgetService _service;
        public WidgetController(IWidgetService service)
        {
            _service = service;
        }

        [HttpGet("summary")]
        public async Task<ActionResult> GetSummary()
        {
            try
            {
                var result = await _service.GetSummaryData();

                if (result == null)
                {
                    return NotFound(new { Message = "Summary data not found." });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = ex.Message });
            }
        }


        [HttpGet("gender-chart")]
        public async Task<ActionResult> GetGenderChartData()
        {
            try
            {
                var result = await _service.GetGenderChartData();

                if (result == null)
                {
                    return NotFound(new { Message = "Summary data not found." });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = ex.Message });
            }
        }


        [HttpGet("finance-chart")]
        public async Task<ActionResult> GetFinanceChartData()
        {
            try
            {
                var result = await _service.GetFinanceChartData();

                if (result == null)
                {
                    return NotFound(new { Message = "Summary data not found." });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = ex.Message });
            }
        }


    }
}
