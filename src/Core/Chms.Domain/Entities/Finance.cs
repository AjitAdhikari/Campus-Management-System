namespace Chms.Domain.Entities;

public class Income : BaseModel
{
    public long Id { get; set; } = 0;
    public string? Category { get; set; }
    public int Amount { get; set; }
    public string? IncomeDate { get; set; }
    public Guid MemberId { get; set; }
    public string? Description { get; set; }
}

public class Expense : BaseModel
{
    public long Id { get; set; } = 0;
    public string? Category { get; set; }
    public int Amount { get; set; }
    public string? ExpenseDate { get; set; }
    public string? Description { get; set; }
}