namespace HydroFlowProject.ViewModels
{
	public class UserUserPermissionViewModel
	{
        public UserUserPermissionViewModel() {}

        public int ModelId { get; set; }

        public int UserId { get; set; }

        public string? PermittedUserMail { get; set; }

        public bool PermData { get; set; }

        public bool PermDownload { get; set; }

        public bool PermSimulation { get; set; }
    }
}