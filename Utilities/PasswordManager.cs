using System.Security.Cryptography;

namespace HydroFlowProject.Utilities;

public static class PasswordManager
{
    private static readonly int ITERATION_COUNT = 200000;
    
    // Create hash and salt for given password string
    public static Dictionary<string, byte[]> HashPassword(string password)
    {
        var data = new Dictionary<string, byte[]>();

        using var generator = RandomNumberGenerator.Create();
        var salt = new byte[256];
        generator.GetBytes(salt);

        var pbkdf2 = new Rfc2898DeriveBytes(password, salt, ITERATION_COUNT, HashAlgorithmName.SHA256);
        var hash = pbkdf2.GetBytes(256);

        var hashBytes = new byte[256];
        Array.Copy(salt, 0, hashBytes, 0, 128);
        Array.Copy(hash, 0, hashBytes, 128, 128);
            
        data.Add("password", hashBytes);
        data.Add("salt", salt);

        return data;
    }

    // Compare the passwords from UI and database by hashing the entered password
    // and comparing the hashes
    public static bool VerifyPassword(string password, byte[] passwordHash, byte[] salt)
    {
        var pbkdf2 = new Rfc2898DeriveBytes(password, salt, ITERATION_COUNT, HashAlgorithmName.SHA256);
        var hash = pbkdf2.GetBytes(256);

        for (var i = 0; i < 128; i++)
        {
            if (passwordHash[i + 128] != hash[i])
            {
                return false;
            }
        }

        return true;
    }
}