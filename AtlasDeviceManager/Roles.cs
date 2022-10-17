namespace AtlasDeviceManager;

public enum Roles
{
    /// <summary>
    /// Default root account, full access.
    /// </summary>
    SuperAdmin, // root - full access

    /// <summary>
    /// 
    /// </summary>
    Admin, // Users & roles maybe?

    /// <summary>
    /// No access other than to login, front dashboard,
    /// and manage account pages.
    /// </summary>
    Registered,

    Devices,
}

public static class RoleConsts
{
    public const string SuperAdmin = $"{nameof(Roles.SuperAdmin)},{nameof(Roles.Admin)},{nameof(Roles.Registered)}";

    public const string Devices = $"{SuperAdmin},{nameof(Roles.Devices)}";

    public const string Registered = $"{SuperAdmin},{nameof(Roles.Registered)}";
}