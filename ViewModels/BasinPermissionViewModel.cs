namespace HydroFlowProject.ViewModels
{
	public class BasinPermissionViewModel
	{
        public int BasinId { get; set; }

        public bool? BasinPermissionType { get; set; }

        public bool? BasinSpecPerm { get; set; }

        public bool? UserSpecPerm { get; set; }
    }
}
