namespace Chms.Infrastructure.DataAccess
{
    public interface IConnectionString
    {
        string GetConnectionString();
        void SetConnectionString(string connectionString);
    }
}