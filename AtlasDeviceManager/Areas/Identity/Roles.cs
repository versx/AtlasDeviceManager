namespace AtlasDeviceManager.Areas.Identity;

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
}