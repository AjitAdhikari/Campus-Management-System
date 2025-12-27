using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chms.Application.Common.Interface
{
    public interface ICurrentUserService
    {
        long UserId { get; }
        string UserName { get; }

    }
}
