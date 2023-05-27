using HydroFlowProject.Models;

namespace HydroFlowProject.ViewModels
{
    public class ModelViewModel
    {
        public ModelViewModel() { }

        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string Title { get; set; } = null!;

        public string ModelFile { get; set; } = null!;

        public int ModelPermissionId { get; set; }

        public string? SessionId { get; set; }
        
        public int BasinId { get; set; }

        public Model ToModel()
        {
            Model model = new()
            {
                Id = Id,
                Name = Name,
                Title = Title,
                CreateDate = null,
                ModelFile = Convert.FromBase64String(ModelFile.Substring(55)),
                ModelPermissionId = ModelPermissionId
            };
            return model;
        }
    }
}
