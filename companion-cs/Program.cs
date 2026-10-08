using System;
using System.Windows.Forms;

using System.IO;
using System.Threading;

namespace TennoLink
{
    public static class Logger
    {
        private static readonly string logFile = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "TennoLink", "companion.log");
        
        public static void Log(string message)
        {
            try
            {
                Directory.CreateDirectory(Path.GetDirectoryName(logFile));
                File.AppendAllText(logFile, $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] {message}{Environment.NewLine}");
            }
            catch { }
        }
    }
    static class Program
    {
        private static Mutex mutex = null;

        [STAThread]
        static void Main()
        {
            const string appName = "TennoLinkBackgroundSyncApp";
            bool createdNew;
            mutex = new Mutex(true, appName, out createdNew);

            if (!createdNew) return;

            Logger.Log("Starting TennoLink Companion...");
            ApplicationConfiguration.Initialize();
            Application.Run(new AppContext());
        }
    }

    public class AppContext : ApplicationContext
    {
        private AppTrayIcon trayIcon;

        public AppContext()
        {
            trayIcon = new AppTrayIcon();
            trayIcon.OnExit += (s, e) => { Logger.Log("Exiting TennoLink..."); ExitThread(); };
        }
    }
}
