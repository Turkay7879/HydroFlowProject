namespace HydroFlowProject.Models;

public class Session
{
    // Unique identifier of the session.
    public long Id { get; set; }

    // Identifier of the user associated with the session.
    public int UserId { get; set; }

    // Unique identifier of the session.
    public string SessionId { get; set; } = null!;

    // Date and time when the session was created.
    public DateTime? SessionCreateDate { get; set; }

    // Date and time when the session will expire.
    public DateTime? SessionExpireDate { get; set; }

    // Indicates whether the session is currently valid or not.
    public bool SessionIsValid { get; set; }

    // User associated with the session.
    public virtual User User { get; set; } = null!;
}