namespace HydroFlowProject.Models;

public class Session
{
    public long Id { get; set; }
    public int UserId { get; set; }
    public string SessionId { get; set; } = null!;
    public DateTime? SessionCreateDate { get; set; }
    public DateTime? SessionExpireDate { get; set; }
    public bool SessionIsValid { get; set; }

    public virtual User User { get; set; } = null!;
}