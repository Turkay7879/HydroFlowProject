using HydroFlowProject.Data;
using HydroFlowProject.Models;
using HydroFlowProject.Utilities;
using HydroFlowProject.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace HydroFlowProject.Controllers;

[ApiController]
[Route("api/[controller]/")]
public class SessionController : Controller
{
    private readonly SqlServerDbContext _context;

    public SessionController(SqlServerDbContext context)
    {
        _context = context;
    }

    private string GenerateSessionKey()
    {
        var sessionKey = new char[64];
        var random = new Random();

        for (var i = 0; i < 64; i++)
        {
            var symbolToBeAdded = random.Next(0, 5);
            sessionKey[i] = symbolToBeAdded switch
            {
                0 => (char)random.Next(65, 91),
                1 => (char)random.Next(97, 123),
                2 => (char)random.Next(48, 58),
                3 => (char)43,
                4 => (char)47,
                _ => sessionKey[i]
            };
        }
        
        return new string(sessionKey);
    }
    
    public async Task<SessionViewModel> CreateSession(int userId)
    {
        var session = new Session
        {
            UserId = userId,
            SessionId = GenerateSessionKey(),
            SessionIsValid = true
        };

        await _context.Sessions.AddAsync(session);
        var added = await _context.SaveChangesAsync();
        if (added == 0)
        {
            return new SessionViewModel
            {
                SessionId = ""
            };
        }

        var userRoleId = _context.UserRoles.ToList().Find(ur => ur.UserId == userId);
        if (userRoleId == null)
        {
            return new SessionViewModel
            {
                SessionId = ""
            };
        }

        var userRole = await _context.Roles.FindAsync(userRoleId.RoleId);
        return new SessionViewModel
        {
            SessionId = session.SessionId,
            SessionIsValid = session.SessionIsValid,
            SessionCreateDate = session.SessionCreateDate,
            SessionExpireDate = session.SessionExpireDate,
            AllowedRole = userRole!.RoleValue
        };
    }

    [HttpPost]
    [Route("validateSession")]
    public async Task<ActionResult<SessionViewModel>> ValidateSession([FromBody] SessionViewModel session)
    {
        var sentSessionId = session.SessionId ?? "";
        var sentExpiryDate = session.SessionExpireDate ?? DateTime.MinValue;
        var currentDate = DateTime.Now;

        if (sentSessionId == "" || sentExpiryDate == DateTime.MinValue || DateTime.Compare(sentExpiryDate, currentDate) < 0)
        {
            return StatusCode(StatusCodes.Status302Found);
        }
        
        var foundSession = _context.Sessions.ToList().Find(s => s.SessionId == sentSessionId);
        if (foundSession == null)
        {
            return StatusCode(StatusCodes.Status302Found);
        }
        
        if (!foundSession.SessionIsValid || (foundSession.SessionIsValid && DateTime.Compare(currentDate, (DateTime)foundSession.SessionExpireDate!) > 0))
        {
            foundSession.SessionIsValid = false;
            _context.Sessions.Update(foundSession);
            await _context.SaveChangesAsync();
            return StatusCode(StatusCodes.Status302Found);
        }

        return Ok(session);
    }

    [HttpPost]
    [Route("loginUser")]
    public async Task<ActionResult<SessionViewModel>> LoginUser([FromBody] UserLoginViewModel user)
    {
        var foundUser = _context.Users.ToList().Find(u => u.Email == user.Email);
        if (foundUser == null)
        {
            return StatusCode(StatusCodes.Status404NotFound, user);
        }

        var passwordChecksOut = PasswordManager.VerifyPassword(user.Password, foundUser.Password, foundUser.PasswordSalt);
        if (!passwordChecksOut)
        {
            return StatusCode(StatusCodes.Status403Forbidden, user);
        }

        var session = await CreateSession(foundUser.Id);
        return session.SessionId == "" ? StatusCode(StatusCodes.Status500InternalServerError, user) : Ok(session);
    }

    [HttpPost]
    [Route("logoutUser")]
    public async Task<ActionResult<SessionViewModel>> LogoutUser([FromBody] SessionViewModel session)
    {
        var foundSession = _context.Sessions.ToList().Find(s => s.SessionId == session.SessionId);
        if (foundSession == null)
        {
            return StatusCode(StatusCodes.Status404NotFound, session);
        }

        foundSession.SessionIsValid = false;
        _context.Sessions.Update(foundSession);
        await _context.SaveChangesAsync();
        return Ok();
    }
}