using HydroFlowProject.Models;

namespace HydroFlowProject.Data
{
    public static class SqlServerDbInit
    {
        public static void Initialize(SqlServerDbContext context) 
        {
            context.Database.EnsureCreated();
            
            if (!context.Roles.Any())
            {
                Role roleSystemAdmin = new Role();
                roleSystemAdmin.RoleDescription = "System Admin";
                roleSystemAdmin.RoleValue = "sysadmin";
                context.Roles.Add(roleSystemAdmin);

                Role roleVisitor = new Role();
                roleVisitor.RoleDescription = "Visitor";
                roleVisitor.RoleValue = "visitor";
                context.Roles.Add(roleVisitor);

                Role roleRegisteredUser = new Role();
                roleRegisteredUser.RoleDescription = "User";
                roleRegisteredUser.RoleValue = "user";
                context.Roles.Add(roleRegisteredUser);

                Role rolePaidUserLv1 = new Role();
                rolePaidUserLv1.RoleDescription = "Paid User Lv1";
                rolePaidUserLv1.RoleValue = "userpaid1";
                context.Roles.Add(rolePaidUserLv1);

                context.SaveChanges();
            }

            if (!context.BalanceModelTypes.Any())
            {
                var abcdBalanceModel = new BalanceModelType();
                abcdBalanceModel.ModelType_Definition = "ABCD";
                context.BalanceModelTypes.Add(abcdBalanceModel);

                context.SaveChanges();
            }

            if (!context.Basins.Any())
            {
                var seferihisarBasin = new Basin();
                seferihisarBasin.BasinName = "Seferihisar-D06A024";
                seferihisarBasin.Description = "Seferihisar Barajı";
                seferihisarBasin.Field = 90;
                seferihisarBasin.FlowStationNo = "D06A024";
                seferihisarBasin.FlowObservationStationLat = 38.217250;
                seferihisarBasin.FlowObservationStationLong = 26.883868;

                var seferihisarBasinPermissions = new BasinPermission();
                seferihisarBasinPermissions.BasinId = 1;
                seferihisarBasinPermissions.BasinPermissionType = false;
                seferihisarBasinPermissions.BasinSpecPerm = false;
                seferihisarBasinPermissions.UserSpecPerm = false;

                context.Basins.Add(seferihisarBasin);
                context.BasinPermissions.Add(seferihisarBasinPermissions);
                context.SaveChanges();
            }
        }
    }
}
