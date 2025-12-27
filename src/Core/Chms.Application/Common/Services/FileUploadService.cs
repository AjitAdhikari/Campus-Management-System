using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Chms.Application.Common.Interface;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;


namespace Chms.Application.Common.Services
{
    public class FileUploadService : IFileUploadService
    {
        private readonly IWebHostEnvironment _env;

        public FileUploadService(IWebHostEnvironment env)
        {
            _env = env;
        }
        public async Task<string> UploadFile(IFormFile image)
        {
            try
            {
                var file = image;
                var path = CreateUploadMediaPath();
                var fileName = CreateUniqueFileName(file.FileName);
                var filePath = Path.Combine(path, fileName).Replace("\\","/");
                using (var fileSteam = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(fileSteam);
                }
                return GetAUploadFileName(filePath);
            }
            catch (Exception e)
            {
                return e.ToString();
            }
        }



        public string ReadFileFromServer(string filePath)
        {

            CreateFileIfNotExists(filePath);
            var fileContent = File.ReadAllText(filePath);
            return fileContent;
        }

        private void CreateFileIfNotExists(string fileName)
        {
            if (!File.Exists(fileName))
            {
                var createdFile = File.CreateText(fileName);
                createdFile.Close();
            }
        }

        public string UpdateFileInServer(string filePath, string fileContent)
        {
            try
            {
                if (File.Exists(filePath))
                {
                    File.WriteAllText(filePath, fileContent);
                    return $"{filePath} updated";
                }
                return $"{filePath} not found";
            }
            catch (Exception e)
            {
                return e.ToString();
            }
        }

        private string GetAUploadFileName(string filePath)
        {
            string uploadPath = _env.WebRootPath;
            return filePath.Replace(uploadPath.Replace("\\","/"), "");
            // int pos = filePath.IndexOf(uploadPath);
            // if (pos >= 0)
            // {
            //     filePath = filePath.Remove(0, pos);
            //     return filePath.Replace(uploadPath, "");
            // }
            // return filePath;
        }

        private string CreateUploadMediaPath()
        {
            //TODO: replace with appsetting value
            var fullPath = _env.WebRootPath +"/uploads";
            // var path = _staticFilesPath.GetPath(await _configService.GetByKey(ConfigKeys.UploadMediaPath));
            DateTime dateTime = DateTime.Now;
            // var fullPath = Path.Combine(path, dateTime.Year.ToString(), dateTime.Month.ToString());
            try
            {
                if (!Directory.Exists(fullPath))
                {
                    Directory.CreateDirectory(fullPath);
                }
                return fullPath;
            }
            catch (Exception e)
            {
                return e.ToString();
            }


        }


        private string CreateUniqueFileName(string name)
        {
            var fileName = Path.GetFileNameWithoutExtension(name);
            string extension = Path.GetExtension(name);
            return Guid.NewGuid().ToString() + extension;
        }

        // public bool DeleteFile(string fileName)
        // {
        //     throw new NotImplementedException();
        // }

        public bool DeleteFile(string fileName)
        {
            var path = _env.WebRootPath +"/uploads" + fileName;
            if (!File.Exists(path))
            {
                return false;
            }
            File.Delete(path);
            return true;

        }
    }
}