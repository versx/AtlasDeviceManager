/// <summary>
/// Started: Oct 14, 2022
/// Author: versx
/// </summary>

namespace AtlasDeviceManager;

using System.Reflection;

public static partial class Strings
{
    #region File Assembly Details

    private static readonly AssemblyName StrongAssemblyName = Assembly.GetExecutingAssembly().GetName();

    public static readonly string AssemblyName = StrongAssemblyName?.Name ?? "AtlasDeviceManager";
    public static readonly string AssemblyVersion = StrongAssemblyName?.Version?.ToString() ?? "v0.1.0";

    #endregion

    #region Uptime Property

    private static DateTime? _uptime = null;
    public static DateTime Uptime => _uptime ??= DateTime.UtcNow;

    #endregion

    #region Folder & File Path Properties

    public const string BasePath = "./bin/debug/";
    public const string WebRootFolder = "wwwroot";
    public const string WebRoot = BasePath + "wwwroot";
    public static readonly string DataFolder = Path.Combine(WebRoot, "data");
    public static readonly string LocaleFolder = Path.Combine(WebRootFolder, "locales");
    public static readonly string AuthProviderFileName = "auth_providers.json";

    #endregion

    #region Default User Properties

    public const string DefaultUserName = "root";
    public const string DefaultUserPassword = "123Pa$$word.";
    public const string DefaultUserEmail = "admin@gmail.com";
    public const string DefaultSuccessLoginPath = "/Identity/Account/Manage";

    #endregion
}