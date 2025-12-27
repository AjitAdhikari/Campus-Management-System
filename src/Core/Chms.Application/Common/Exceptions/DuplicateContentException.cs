using System;

namespace Chms.Application.Common.Exceptions
{
    public class DuplicateContentException : Exception
    {
          public DuplicateContentException()
           : base()
        {
        }

        public DuplicateContentException(string message)
            : base(message)
        {
        }

        public DuplicateContentException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
 
    }
}