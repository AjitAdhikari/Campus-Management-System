namespace Chms.Domain.Models;
public class CacheModel<T>
{
    public T? Result {get; set;}
    public bool HasValue {get; set;}
}