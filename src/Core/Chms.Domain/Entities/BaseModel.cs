using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chms.Domain.Entities;
    public class BaseModel
    {
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime? UpdatedDate { get; set; } = null;
    public long CreatedBy { get; set; } = 0;
    public long UpdatedBy { get; set; } = 0;

    }
