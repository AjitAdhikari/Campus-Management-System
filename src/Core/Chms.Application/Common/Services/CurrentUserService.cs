using Chms.Application.Common.Interface;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Chms.Application.Common.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _contextAccessor;
        public CurrentUserService(IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
        }
        public long UserId => Convert.ToInt64(_contextAccessor.HttpContext?.User?.FindFirstValue("UserId"));
        public string UserName => _contextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

    }
}
