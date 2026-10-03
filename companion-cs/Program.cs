using System;
using System.Windows.Forms;

namespace TennoRelicSync
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
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
            trayIcon.OnExit += (s, e) => ExitThread();
        }
    }
}
