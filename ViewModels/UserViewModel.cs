using HydroFlowProject.Models;
using System;

namespace HydroFlowProject.ViewModels
{
    public class UserViewModel
    {
        public UserViewModel() { }
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string Surname { get; set; } = null!;

        public string? CorporationName { get; set; }

        public string Email { get; set; } = null!;

        public string Password { get; set; }

        public UserViewModel fromUser(User user)
        {
            UserViewModel userVM = new UserViewModel();
            userVM.Id = user.Id;
            userVM.Name = user.Name;
            userVM.Surname = user.Surname;
            userVM.CorporationName = user.CorporationName;
            userVM.Email = user.Email;
            userVM.Password = "";
            return userVM;
        }

        public User toUser()
        {
            User user = new User();
            if(Id != -1)
            {
                user.Id = Id;
            }
            user.Name = Name;
            user.Surname = Surname;
            user.CorporationName = CorporationName;
            user.Email = Email;
            user.Password = new byte[3];
            user.PasswordSalt = new byte[3];
            return user;
        }
    }

}
