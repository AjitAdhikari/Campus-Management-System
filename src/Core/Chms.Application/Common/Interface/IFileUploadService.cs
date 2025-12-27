namespace Chms.Application.Common.Interface;
using Microsoft.AspNetCore.Http;

 public interface IFileUploadService
    {
        Task<string> UploadFile(IFormFile entity);
        string ReadFileFromServer(string fileName);
        string UpdateFileInServer(string fileName, string fileContent);
        bool DeleteFile(string fileName);
    }