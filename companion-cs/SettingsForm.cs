using System;
using System.Drawing;
using System.Windows.Forms;

namespace TennoLink
{
    public class SettingsForm : Form
    {
        private TextBox txtServerUrl;
        private TextBox txtPlayerName;
        private TextBox txtPassword;
        private Button btnSave;
        private Button btnCancel;
        private AppConfig _config;
        private Action _onSave;

        public SettingsForm(AppConfig config, Action onSave)
        {
            _config = config;
            _onSave = onSave;

            this.Text = "TennoLink Settings";
            this.Size = new Size(350, 270);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;

            var lblServer = new Label { Text = "Server URL:", Location = new Point(15, 20), AutoSize = true };
            txtServerUrl = new TextBox { Location = new Point(120, 18), Width = 190, Text = _config.ServerUrl };

            var lblPlayer = new Label { Text = "Player Name:", Location = new Point(15, 60), AutoSize = true };
            txtPlayerName = new TextBox { Location = new Point(120, 58), Width = 190, Text = _config.PlayerName };

            var lblPassword = new Label { Text = "Password:", Location = new Point(15, 100), AutoSize = true };
            txtPassword = new TextBox { Location = new Point(120, 98), Width = 190, Text = _config.Password, PasswordChar = '*' };

                        var chkStartOnLogin = new CheckBox { Text = "Start on Login", Location = new Point(120, 130), AutoSize = true };
            chkStartOnLogin.Checked = IsStartOnLoginEnabled();
            chkStartOnLogin.CheckedChanged += (s, e) => SetStartOnLogin(chkStartOnLogin.Checked);

            btnSave = new Button { Text = "Save", Location = new Point(150, 170), Width = 75 };
            btnSave.Click += BtnSave_Click;

            btnCancel = new Button { Text = "Cancel", Location = new Point(235, 170), Width = 75 };
            btnCancel.Click += (s, e) => this.Close();

            this.Controls.Add(lblServer);
            this.Controls.Add(txtServerUrl);
            this.Controls.Add(lblPlayer);
            this.Controls.Add(txtPlayerName);
            this.Controls.Add(lblPassword);
            this.Controls.Add(txtPassword);
            this.Controls.Add(chkStartOnLogin);
            this.Controls.Add(btnSave);
            this.Controls.Add(btnCancel);
            
            this.AcceptButton = btnSave;
            this.CancelButton = btnCancel;
        }

        
        private bool IsStartOnLoginEnabled()
        {
            try
            {
                using var key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Run", false);
                return key?.GetValue("TennoLink") != null;
            }
            catch { return false; }
        }

        private void SetStartOnLogin(bool enable)
        {
            try
            {
                using var key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Run", true);
                if (enable)
                {
                    key?.SetValue("TennoLink", $"\"{Application.ExecutablePath}\"");
                }
                else
                {
                    key?.DeleteValue("TennoLink", false);
                }
            }
            catch (Exception ex) {
                Logger.Log("Failed to set start on login: " + ex.Message);
            }
        }

        private void BtnSave_Click(object? sender, EventArgs e)
        {
            _config.ServerUrl = txtServerUrl.Text.Trim();
            _config.PlayerName = txtPlayerName.Text.Trim();
            _config.Password = txtPassword.Text;

            ConfigManager.Save(_config);
            _onSave?.Invoke();
            this.Close();
        }
    }
}
