using HydroFlowProject.Models;
using Microsoft.EntityFrameworkCore;

namespace HydroFlowProject.Data
{
    public partial class SqlServerDbContext : DbContext
    {
        public SqlServerDbContext(DbContextOptions<SqlServerDbContext> options)
        : base(options)
        {
        }

        public virtual DbSet<BalanceModelType> BalanceModelTypes { get; set; }
        public virtual DbSet<Basin> Basins { get; set; }
        public virtual DbSet<BasinModel> BasinModels { get; set; }
        public virtual DbSet<BasinPermission> BasinPermissions { get; set; }
        public virtual DbSet<BasinUserPermission> BasinUserPermissions { get; set; }
        public virtual DbSet<Model> Models { get; set; }
        public virtual DbSet<ModelModelType> ModelModelTypes { get; set; }
        public virtual DbSet<ModelParameter> ModelParameters { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<Session> Sessions { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserModel> UserModels { get; set; }
        public virtual DbSet<UserRole> UserRoles { get; set; }
        public virtual DbSet<UserUserPermission> UserUserPermissions { get; set; }
        public virtual DbSet<UserConsent> UserConsents { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BalanceModelType>(entity =>
            {
                entity.HasKey(e => e.ModelType_Id).HasName("PK__BalanceModelTypes");

                entity.Property(e => e.ModelType_Definition).HasMaxLength(25).IsRequired();
            });
            
            modelBuilder.Entity<Basin>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Basins__3214EC071999E5DA");

                entity.Property(e => e.BasinName).HasMaxLength(50);
                entity.Property(e => e.Description).HasMaxLength(100);
                entity.Property(e => e.FlowStationNo).HasMaxLength(15);
            });

            modelBuilder.Entity<BasinModel>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Basin_Mo__3214EC076C7802A9");

                entity.ToTable("Basin_Models");

                entity.HasOne(d => d.Basin).WithMany(p => p.BasinModels)
                    .HasForeignKey(d => d.BasinId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Basin_Models_BasinId");

                entity.HasOne(d => d.Model).WithMany(p => p.BasinModels)
                    .HasForeignKey(d => d.ModelId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Basin_Models_ModelId");
            });

            modelBuilder.Entity<BasinPermission>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Basin_Pe__3214EC07AFBC4161");

                entity.ToTable("Basin_Permissions");

                entity.Property(e => e.BasinPermissionType).HasDefaultValueSql("((0))");
                entity.Property(e => e.BasinSpecPerm).HasDefaultValueSql("((0))");
                entity.Property(e => e.UserSpecPerm).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Basin).WithMany(p => p.BasinPermissions)
                    .HasForeignKey(d => d.BasinId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Basin_Permissions_BasinId");
            });

            modelBuilder.Entity<BasinUserPermission>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Basin_Us__3214EC079001A356");

                entity.ToTable("Basin_User_Permissions");

                entity.Property(e => e.PermLat).HasDefaultValueSql("((0))");
                entity.Property(e => e.PermLong).HasDefaultValueSql("((0))");
                entity.Property(e => e.PermStationNo).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Basin).WithMany(p => p.BasinUserPermissions)
                    .HasForeignKey(d => d.BasinId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Basin_User_Permissions_BasinId");

                entity.HasOne(d => d.User).WithMany(p => p.BasinUserPermissions)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Basin_User_Permissions_UserId");
            });

            modelBuilder.Entity<Model>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Models__3214EC077CF5FEB4");

                entity.Property(e => e.CreateDate)
                    .IsRowVersion()
                    .IsConcurrencyToken();
                entity.Property(e => e.Name).HasMaxLength(50);
                entity.Property(e => e.Title).HasMaxLength(50);
            });

            modelBuilder.Entity<ModelModelType>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Model__ModelTypes");

                entity.HasOne(e => e.Model).WithMany(m => m.ModelModelTypes)
                    .HasForeignKey(e => e.Model_Id)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_ModelModelType_Model");
                entity.HasOne(e => e.BalanceModelType).WithMany(bmt => bmt.ModelModelTypes)
                    .HasForeignKey(e => e.Model_Type_Id)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_ModelModelType_BalanceModelType");
            });

            modelBuilder.Entity<ModelParameter>(entity =>
            {
                entity.HasKey(e => e.Parameter_Id).HasName("PK__Model_Parameter");
                
                entity.HasOne(e => e.Model).WithMany(m => m.ModelParameters)
                    .HasForeignKey(e => e.Model_Id)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_ModelParameters_Model");
                entity.Property(e => e.Model_Param).IsRequired();
                entity.Property(e => e.Model_Param_Name).HasMaxLength(25).IsRequired();
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Roles__3214EC0700EF73EB");

                entity.Property(e => e.RoleDescription).HasMaxLength(50);
            });

            modelBuilder.Entity<Session>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Sessions__PrimaryKey");
                entity.HasOne(e => e.User).WithMany(p => p.UserSessions)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.ClientCascade)
                    .HasConstraintName("FK_User_Session");
                entity.Property(e => e.SessionId).HasMaxLength(64).IsRequired();
                entity.Property(e => e.SessionCreateDate)
                    .IsRowVersion()
                    .IsConcurrencyToken()
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.SessionExpireDate)
                    .IsRowVersion()
                    .IsConcurrencyToken()
                    .HasDefaultValueSql("CURRENT_TIMESTAMP + 3");
                entity.Property(e => e.SessionIsValid).IsRequired();
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Users__3214EC0751F45BF6");

                entity.Property(e => e.CorporationName).HasMaxLength(100);
                entity.Property(e => e.Email)
                    .HasMaxLength(75)
                    .IsUnicode(false);
                entity.Property(e => e.Name).HasMaxLength(50);
                entity.Property(e => e.Password).HasMaxLength(256);
                entity.Property(e => e.Surname).HasMaxLength(50);
            });

            modelBuilder.Entity<UserModel>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__User_Mod__3214EC07E1F8B074");

                entity.ToTable("User_Models");

                entity.HasOne(d => d.Model).WithMany(p => p.UserModels)
                    .HasForeignKey(d => d.ModelId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Models_ModelId");

                entity.HasOne(d => d.User).WithMany(p => p.UserModels)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Models_UserId");
            });

            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__User_Rol__3214EC0729397F40");

                entity.ToTable("User_Roles");

                entity.Property(e => e.UserRoleDate)
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.Role).WithMany(p => p.UserRoles)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Roles_RoleId");

                entity.HasOne(d => d.User).WithMany(p => p.UserRoles)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Roles_UserId");
            });

            modelBuilder.Entity<UserUserPermission>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__User_Use__3214EC07FB231915");

                entity.ToTable("User_UserPermission");

                entity.Property(e => e.PermData).HasDefaultValueSql("((0))");
                entity.Property(e => e.PermDownload).HasDefaultValueSql("((0))");
                entity.Property(e => e.PermSimulation).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Model).WithMany(p => p.UserUserPermissions)
                    .HasForeignKey(d => d.ModelId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_UserPermission_ModelId");

                entity.HasOne(d => d.PermittedUser).WithMany(p => p.UserUserPermissionPermittedUsers)
                    .HasForeignKey(d => d.PermittedUserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_UserPermission_PermittedUserId");

                entity.HasOne(d => d.User).WithMany(p => p.UserUserPermissionUsers)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_UserPermission_UserId");
            });

            modelBuilder.Entity<UserConsent>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__User__Consent");

                entity.ToTable("User_Consents");

                entity.Property(e => e.Consent).IsRequired();

                entity.HasOne(e => e.User).WithMany(u => u.UserConsents)
                    .HasForeignKey(e => e.User_Id)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_UserConsent_User");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
