using System;
using HydroFlowProject.Models;

namespace HydroFlowProject.ViewModels
{
	public class BasinViewModel
	{
        public BasinViewModel() { }

        public int Id { get; set; }

        public string BasinName { get; set; } = null!;

        public string FlowStationNo { get; set; } = null!;

        public double FlowObservationStationLat { get; set; }

        public double FlowObservationStationLong { get; set; }

        public int Field { get; set; }

        public string? Description { get; set; }

        public bool BasinPerm { get; set; }

        public bool BasinSpecPerm { get; set; }

        public bool UserSpecPerm { get; set; }

        public BasinViewModel fromBasin(Basin basin)
        {
            BasinViewModel basinVM = new BasinViewModel();
            basinVM.Id = basin.Id;
            basinVM.BasinName = basin.BasinName;
            basinVM.FlowStationNo = basin.FlowStationNo;
            basinVM.FlowObservationStationLat = basin.FlowObservationStationLat;
            basinVM.FlowObservationStationLong = basin.FlowObservationStationLong;
            basinVM.Field = basin.Field;
            basinVM.Description = basin.Description;
            return basinVM;
        }

        public Basin toBasin()
        {
            Basin basin = new Basin();
            basin.Id = Id;
            basin.BasinName = BasinName;
            basin.FlowStationNo = FlowStationNo;
            basin.FlowObservationStationLat = FlowObservationStationLat;
            basin.FlowObservationStationLong = FlowObservationStationLong;
            basin.Field = Field;
            basin.Description = Description;
            return basin;
        }
    }
}

