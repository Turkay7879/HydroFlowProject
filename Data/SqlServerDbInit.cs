using HydroFlowProject.Models;

namespace HydroFlowProject.Data
{
    public static class SqlServerDbInit
    {
        public static void Initialize(SqlServerDbContext context) 
        {
            context.Database.EnsureCreated();

            // Initialize Roles
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
        }
    }
}
