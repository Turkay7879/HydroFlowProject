namespace HydroFlowProject.Models
{
    public class BasinUserPermission
    {
        public int Id { get; set; }

        public int BasinId { get; set; }

        public int UserId { get; set; }

        public int? PermUserId { get; set; }

        public bool? PermLat { get; set; }

        public bool? PermLong { get; set; }

        public bool? PermStationNo { get; set; }

        public virtual Basin Basin { get; set; } = null!;

        public virtual User User { get; set; } = null!;
    }
}
