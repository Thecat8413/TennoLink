using System;
using System.IO;
using System.Text.Json;

namespace TennoRelicSync
{
    public class AppConfig
    {
        public string ServerUrl { get; set; } = "http://localhost:3000";
        public string PlayerName { get; set; } = "Tenno";
        public string Password { get; set; } = "";
    }

    public static class ConfigManager
    {
        private static readonly string AppDataFolder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "TennoRelicSync");
        private static readonly string ConfigPath = Path.Combine(AppDataFolder, "config.json");

        public static AppConfig Load()
        {
            if (!Directory.Exists(AppDataFolder))
                Directory.CreateDirectory(AppDataFolder);

            if (File.Exists(ConfigPath))
            {
                try
                {
                    string json = File.ReadAllText(ConfigPath);
                    var config = JsonSerializer.Deserialize<AppConfig>(json);
                    if (config != null) return config;
                }
                catch { }
            }

            var defaultConfig = new AppConfig
            {
                PlayerName = Environment.UserName
            };
            Save(defaultConfig);
            return defaultConfig;
        }

        public static void Save(AppConfig config)
        {
            if (!Directory.Exists(AppDataFolder))
                Directory.CreateDirectory(AppDataFolder);

            var options = new JsonSerializerOptions { WriteIndented = true };
            File.WriteAllText(ConfigPath, JsonSerializer.Serialize(config, options));
        }
    }
}
