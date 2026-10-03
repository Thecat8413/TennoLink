// Package main provides a lightweight, native Windows system tray companion
// for automatically synchronizing AlecaFrame's lastData.dat with your self-hosted server.
package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"github.com/fsnotify/fsnotify"
	"github.com/getlantern/systray"
)

type Config struct {
	ServerURL  string `json:"serverUrl"`
	PlayerName string `json:"playerName"`
	RoomCode   string `json:"roomCode,omitempty"`
}

var (
	appConfig   Config
	configPath  string
	mStatus     *systray.MenuItem
	mSyncNow    *systray.MenuItem
	mOpenWeb    *systray.MenuItem
	mOpenConfig *systray.MenuItem
	mExit       *systray.MenuItem
	lastSyncStr = "Never"
)

func main() {
	serverFlag := flag.String("server", "", "Server URL (e.g. https://warframe.lan)")
	playerFlag := flag.String("player", "", "Player Gamertag / Name")
	roomFlag := flag.String("room", "", "Squad Room Code")
	flag.Parse()

	initPaths()
	loadOrCreateConfig()

	if *serverFlag != "" {
		appConfig.ServerURL = *serverFlag
	}
	if *playerFlag != "" {
		appConfig.PlayerName = *playerFlag
	}
	if *roomFlag != "" {
		appConfig.RoomCode = *roomFlag
	}
	if *serverFlag != "" || *playerFlag != "" || *roomFlag != "" {
		saveConfig()
	}

	systray.Run(onReady, onExit)
}

func initPaths() {
	// Check if config.json exists adjacent to executable
	exePath, err := os.Executable()
	if err == nil {
		localCfg := filepath.Join(filepath.Dir(exePath), "config.json")
		if _, err := os.Stat(localCfg); err == nil {
			configPath = localCfg
			return
		}
	}

	appData := os.Getenv("APPDATA")
	if appData == "" {
		appData = "."
	}
	dir := filepath.Join(appData, "TennoRelicSync")
	os.MkdirAll(dir, 0755)
	configPath = filepath.Join(dir, "config.json")
}

func loadOrCreateConfig() {
	data, err := os.ReadFile(configPath)
	if err == nil {
		json.Unmarshal(data, &appConfig)
	}

	// Set defaults if empty
	if appConfig.ServerURL == "" {
		appConfig.ServerURL = "http://localhost:3000"
	}
	if appConfig.PlayerName == "" {
		user := os.Getenv("USERNAME")
		if user == "" {
			user = "Tenno"
		}
		appConfig.PlayerName = user
	}

	saveConfig()
}

func saveConfig() {
	data, _ := json.MarshalIndent(appConfig, "", "  ")
	os.WriteFile(configPath, data, 0644)
}

func getInventoryFilePath() (string, string) {
	localAppData := os.Getenv("LOCALAPPDATA")
	appData := os.Getenv("APPDATA")
	homeDir, _ := os.UserHomeDir()

	var candidates []struct {
		path string
		src  string
	}

	if localAppData != "" {
		candidates = append(candidates, struct{ path, src string }{filepath.Join(localAppData, "AlecaFrame", "lastData.dat"), "alecaframe"})
		candidates = append(candidates, struct{ path, src string }{filepath.Join(localAppData, "WFHelper", "api-helper", "inventory.json"), "json"})
		candidates = append(candidates, struct{ path, src string }{filepath.Join(localAppData, "WFHelper", "inventory.json"), "json"})
		candidates = append(candidates, struct{ path, src string }{filepath.Join(localAppData, "Warframe", "inventory.json"), "json"})
	}

	if appData != "" {
		candidates = append(candidates, struct{ path, src string }{filepath.Join(appData, "WFHelper", "api-helper", "inventory.json"), "json"})
		candidates = append(candidates, struct{ path, src string }{filepath.Join(appData, "WFHelper", "inventory.json"), "json"})
		candidates = append(candidates, struct{ path, src string }{filepath.Join(appData, "wfhelper", "inventory.json"), "json"})
	}

	if homeDir != "" {
		candidates = append(candidates, struct{ path, src string }{filepath.Join(homeDir, ".config", "WFHelper", "api-helper", "inventory.json"), "json"})
		candidates = append(candidates, struct{ path, src string }{filepath.Join(homeDir, ".config", "wfhelper", "inventory.json"), "json"})
	}

	candidates = append(candidates, struct{ path, src string }{"inventory.json", "json"})

	var bestPath string
	var bestSrc string
	var bestTime time.Time

	for _, c := range candidates {
		if stat, err := os.Stat(c.path); err == nil {
			if bestPath == "" || stat.ModTime().After(bestTime) {
				bestPath = c.path
				bestSrc = c.src
				bestTime = stat.ModTime()
			}
		}
	}

	return bestPath, bestSrc
}

func getAllCandidateDirectories() []string {
	localAppData := os.Getenv("LOCALAPPDATA")
	appData := os.Getenv("APPDATA")
	homeDir, _ := os.UserHomeDir()

	var dirs []string
	if localAppData != "" {
		dirs = append(dirs,
			filepath.Join(localAppData, "AlecaFrame"),
			filepath.Join(localAppData, "WFHelper", "api-helper"),
			filepath.Join(localAppData, "WFHelper"),
			filepath.Join(localAppData, "Warframe"),
		)
	}
	if appData != "" {
		dirs = append(dirs,
			filepath.Join(appData, "WFHelper", "api-helper"),
			filepath.Join(appData, "WFHelper"),
			filepath.Join(appData, "wfhelper"),
		)
	}
	if homeDir != "" {
		dirs = append(dirs,
			filepath.Join(homeDir, ".config", "WFHelper", "api-helper"),
			filepath.Join(homeDir, ".config", "wfhelper"),
		)
	}
	dirs = append(dirs, ".")
	return dirs
}

func onReady() {
	systray.SetTitle("TennoRelicSync")
	systray.SetTooltip("Warframe Helper - Auto-Sync Active")

	mStatus = systray.AddMenuItem("Status: Waiting for Warframe...", "Current connection and sync status")
	mStatus.Disable()

	systray.AddSeparator()

	mSyncNow = systray.AddMenuItem("Sync Now", "Force an immediate inventory sync")
	mOpenWeb = systray.AddMenuItem("Open Web Dashboard", "Open your self-hosted Warframe Helper in browser")
	mOpenConfig = systray.AddMenuItem("Edit Config (Notepad)", "Open config.json to change name, room, or server")

	systray.AddSeparator()
	mExit = systray.AddMenuItem("Exit", "Quit TennoRelicSync")

	// Initial Sync
	go syncInventory()

	// Start File Watcher
	go watchFile()

	// Handle Menu Clicks
	go func() {
		for {
			select {
			case <-mSyncNow.ClickedCh:
				go syncInventory()
			case <-mOpenWeb.ClickedCh:
				openBrowser(appConfig.ServerURL)
			case <-mOpenConfig.ClickedCh:
				openEditor(configPath)
			case <-mExit.ClickedCh:
				systray.Quit()
				return
			}
		}
	}()
}

func onExit() {
	// Clean shutdown
}

func watchFile() {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Printf("Watcher error: %v", err)
		return
	}
	defer watcher.Close()

	// Watch all existing candidate directories
	dirs := getAllCandidateDirectories()
	watchedCount := 0
	for _, d := range dirs {
		if stat, err := os.Stat(d); err == nil && stat.IsDir() {
			watcher.Add(d)
			watchedCount++
		}
	}

	if watchedCount == 0 {
		log.Printf("No valid inventory directories exist yet.")
	} else {
		log.Printf("Watching %d potential inventory directories...", watchedCount)
	}

	var debounceTimer *time.Timer

	for {
		select {
		case event, ok := <-watcher.Events:
			if !ok {
				return
			}
			name := strings.ToLower(filepath.Base(event.Name))
			if name == "lastdata.dat" || name == "inventory.json" {
				if event.Has(fsnotify.Write) || event.Has(fsnotify.Create) {
					if debounceTimer != nil {
						debounceTimer.Stop()
					}
					// Debounce 600ms to allow writer to release file handle
					debounceTimer = time.AfterFunc(600*time.Millisecond, func() {
						syncInventory()
					})
				}
			}
		case err, ok := <-watcher.Errors:
			if !ok {
				return
			}
			log.Printf("Watcher error: %v", err)
		}
	}
}

func syncInventory() {
	// Live reload config if edited
	if data, err := os.ReadFile(configPath); err == nil {
		json.Unmarshal(data, &appConfig)
	}

	invPath, srcType := getInventoryFilePath()
	if invPath == "" {
		updateStatus("Error: LOCALAPPDATA not found")
		return
	}
	log.Printf("Syncing inventory from %s (source: %s)...", invPath, srcType)

	data, err := os.ReadFile(invPath)
	if err != nil {
		updateStatus("Waiting: No active inventory found (AlecaFrame or WFHelper)")
		return
	}

	endpoint := fmt.Sprintf("%s/api/upload/dat?player=%s",
		strings.TrimRight(appConfig.ServerURL, "/"),
		url.QueryEscape(appConfig.PlayerName),
	)
	if appConfig.RoomCode != "" {
		endpoint += fmt.Sprintf("&room=%s", url.QueryEscape(appConfig.RoomCode))
	}

	client := &http.Client{Timeout: 15 * time.Second}
	req, err := http.NewRequest("POST", endpoint, bytes.NewReader(data))
	if err != nil {
		updateStatus("Error: Failed to create request")
		return
	}
	req.Header.Set("Content-Type", "application/octet-stream")

	resp, err := client.Do(req)
	if err != nil {
		updateStatus(fmt.Sprintf("Offline: %v", err))
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		var result struct {
			Ok           bool `json:"ok"`
			RelicCount   int  `json:"relicCount"`
			MasteryCount int  `json:"masteryCount"`
		}
		respBytes, _ := io.ReadAll(resp.Body)
		json.Unmarshal(respBytes, &result)

		now := time.Now().Format("15:04:05")
		lastSyncStr = now
		updateStatus(fmt.Sprintf("Synced at %s (%d relics)", now, result.RelicCount))
	} else {
		updateStatus(fmt.Sprintf("Server Error (%d)", resp.StatusCode))
	}
}

func updateStatus(msg string) {
	if mStatus != nil {
		mStatus.SetTitle(fmt.Sprintf("● %s", msg))
	}
	systray.SetTooltip(fmt.Sprintf("TennoRelicSync - %s", msg))
}

func openBrowser(targetUrl string) {
	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("rundll32", "url.dll,FileProtocolHandler", targetUrl)
	case "darwin":
		cmd = exec.Command("open", targetUrl)
	default:
		cmd = exec.Command("xdg-open", targetUrl)
	}
	cmd.Start()
}

func openEditor(filePath string) {
	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("notepad.exe", filePath)
	case "darwin":
		cmd = exec.Command("open", "-t", filePath)
	default:
		cmd = exec.Command("xdg-open", filePath)
	}
	cmd.Start()
}
