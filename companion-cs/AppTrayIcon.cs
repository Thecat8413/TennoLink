using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace TennoRelicSync
{
    public class AppTrayIcon : IDisposable
    {
        private NotifyIcon _notifyIcon;
        private ContextMenuStrip _contextMenu;
        private AppConfig _config;
        private List<FileSystemWatcher> _watchers = new List<FileSystemWatcher>();
        private System.Threading.Timer _debounceTimer;
        private static readonly HttpClient _httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(15) };
        private bool _isSyncing = false;

        public event EventHandler OnExit;

        public AppTrayIcon()
        {
            _config = ConfigManager.Load();
            
            _contextMenu = new ContextMenuStrip();
            _contextMenu.Items.Add(new ToolStripMenuItem("Settings", null, (s, e) => OpenSettings()));
            _contextMenu.Items.Add(new ToolStripMenuItem("Force Sync Now", null, (s, e) => TriggerSync()));
            _contextMenu.Items.Add(new ToolStripSeparator());
            _contextMenu.Items.Add(new ToolStripMenuItem("Exit", null, (s, e) => OnExit?.Invoke(this, EventArgs.Empty)));

            _notifyIcon = new NotifyIcon
            {
                Icon = CreateColoredIcon(Color.Gold),
                ContextMenuStrip = _contextMenu,
                Text = "TennoRelicSync - Idle",
                Visible = true
            };

            // Double click opens settings
            _notifyIcon.DoubleClick += (s, e) => OpenSettings();

            InitializeWatchers();
            TriggerSync(); // Initial sync
        }

        private void SetStatus(string status, Color iconColor)
        {
            if (_notifyIcon == null) return;
            
            try
            {
                var oldIcon = _notifyIcon.Icon;
                _notifyIcon.Icon = CreateColoredIcon(iconColor);
                _notifyIcon.Text = $"TennoRelicSync - {status}".Substring(0, Math.Min(63, status.Length + 17));
                if (oldIcon != null) DestroyIcon(oldIcon.Handle);
            }
            catch { }
        }

        private Icon CreateColoredIcon(Color color)
        {
            int size = 16;
            using (Bitmap bmp = new Bitmap(size, size))
            {
                using (Graphics g = Graphics.FromImage(bmp))
                {
                    g.Clear(Color.Transparent);
                    g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
                    
                    Point[] diamond = {
                        new Point(size/2, 1),
                        new Point(size - 2, size/2),
                        new Point(size/2, size - 2),
                        new Point(1, size/2)
                    };
                    
                    using (Brush brush = new SolidBrush(color))
                    {
                        g.FillPolygon(brush, diamond);
                    }
                    using (Pen pen = new Pen(Color.FromArgb(150, 255, 255, 255), 1))
                    {
                        g.DrawPolygon(pen, diamond);
                    }
                }
                return Icon.FromHandle(bmp.GetHicon());
            }
        }

        [System.Runtime.InteropServices.DllImport("user32.dll", CharSet = System.Runtime.InteropServices.CharSet.Auto)]
        private extern static bool DestroyIcon(IntPtr handle);

        private void OpenSettings()
        {
            using (var form = new SettingsForm(_config, () => {
                _config = ConfigManager.Load();
                InitializeWatchers();
                TriggerSync();
            }))
            {
                form.ShowDialog();
            }
        }

        private IEnumerable<string> GetCandidateDirectories()
        {
            var localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            var appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            var profile = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);

            return new[]
            {
                Path.Combine(localAppData, "AlecaFrame"),
                Path.Combine(localAppData, "WFHelper", "api-helper"),
                Path.Combine(localAppData, "WFHelper"),
                Path.Combine(localAppData, "Warframe"),
                Path.Combine(appData, "WFHelper", "api-helper"),
                Path.Combine(appData, "WFHelper"),
                Path.Combine(appData, "wfhelper"),
                Path.Combine(profile, ".config", "WFHelper", "api-helper"),
                Path.Combine(profile, ".config", "wfhelper")
            };
        }

        private void InitializeWatchers()
        {
            foreach (var w in _watchers)
            {
                w.EnableRaisingEvents = false;
                w.Dispose();
            }
            _watchers.Clear();

            foreach (var dir in GetCandidateDirectories())
            {
                if (Directory.Exists(dir))
                {
                    var watcher = new FileSystemWatcher(dir);
                    watcher.NotifyFilter = NotifyFilters.LastWrite | NotifyFilters.FileName;
                    watcher.Filter = "*.*";
                    watcher.Changed += OnFileChanged;
                    watcher.Created += OnFileChanged;
                    watcher.EnableRaisingEvents = true;
                    _watchers.Add(watcher);
                }
            }
        }

        private void OnFileChanged(object sender, FileSystemEventArgs e)
        {
            var name = Path.GetFileName(e.FullPath).ToLowerInvariant();
            if (name == "lastdata.dat" || name == "inventory.json")
            {
                _debounceTimer?.Dispose();
                _debounceTimer = new System.Threading.Timer(_ => TriggerSync(), null, 600, Timeout.Infinite);
            }
        }

        private string GetLatestInventoryFile()
        {
            var candidates = new List<FileInfo>();
            foreach (var dir in GetCandidateDirectories())
            {
                var datPath = Path.Combine(dir, "lastData.dat");
                var jsonPath = Path.Combine(dir, "inventory.json");
                if (File.Exists(datPath)) candidates.Add(new FileInfo(datPath));
                if (File.Exists(jsonPath)) candidates.Add(new FileInfo(jsonPath));
            }
            
            if (File.Exists("inventory.json")) candidates.Add(new FileInfo("inventory.json"));

            return candidates.OrderByDescending(f => f.LastWriteTimeUtc).FirstOrDefault()?.FullName;
        }

        private void TriggerSync()
        {
            if (_isSyncing) return;
            _isSyncing = true;
            
            Task.Run(async () =>
            {
                try
                {
                    var file = GetLatestInventoryFile();
                    if (string.IsNullOrEmpty(file))
                    {
                        SetStatus("Waiting for data", Color.Gold);
                        return;
                    }

                    SetStatus("Syncing...", Color.LimeGreen);

                    byte[] data = File.ReadAllBytes(file);
                    
                    var endpoint = $"{_config.ServerUrl.TrimEnd('/')}/api/upload/dat?player={Uri.EscapeDataString(_config.PlayerName)}";
                    if (!string.IsNullOrEmpty(_config.RoomCode))
                        endpoint += $"&room={Uri.EscapeDataString(_config.RoomCode)}";

                    var content = new ByteArrayContent(data);
                    content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");

                    var response = await _httpClient.PostAsync(endpoint, content);
                    
                    if (response.IsSuccessStatusCode)
                    {
                        SetStatus("Active & Synced", Color.Gold);
                    }
                    else
                    {
                        SetStatus("Server Error", Color.Red);
                    }
                }
                catch
                {
                    SetStatus("Network Error", Color.Red);
                }
                finally
                {
                    _isSyncing = false;
                }
            });
        }

        public void Dispose()
        {
            _notifyIcon?.Dispose();
            foreach (var w in _watchers) w.Dispose();
            _debounceTimer?.Dispose();
        }
    }
}
