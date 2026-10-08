# Reverse Proxy Configuration Guide

The self-hosted Warframe Helper is designed to sit cleanly behind any reverse proxy, local LAN, or WireGuard VPN subnet.

The container listens internally on port `3000`.

---

## 1. Caddyfile (Recommended for Simplicity)
```caddy
warframe.myhome.net {
    reverse_proxy TennoLink:3000 {
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
    }
}
```

---

## 2. Nginx / Nginx Proxy Manager
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name warframe.myhome.net;

    # SSL configuration handled by Certbot or NPM
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Allow up to 10MB for lastData.dat uploads
        client_max_body_size 10M;
    }
}
```

---

## 3. Traefik (Docker Compose Labels)
Uncomment the labels in `docker-compose.yml`:
```yaml
services:
  TennoLink:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.warframe.rule=Host(`warframe.myhome.net`)"
      - "traefik.http.routers.warframe.entrypoints=websecure"
      - "traefik.http.routers.warframe.tls.certresolver=myresolver"
      - "traefik.http.services.warframe.loadbalancer.server.port=3000"
```

---

## 4. Local LAN / WireGuard Subnet Only (No Public Domain)
If you only want this accessible on your home network or WireGuard VPN:
1. In `.env`:
   ```bash
   HOST_BIND_IP=0.0.0.0
   PORT=3000
   ```
2. Run `docker compose up -d`.
3. You and your friends on WireGuard can access it directly at:
   `http://10.x.x.x:3000` or `http://192.168.1.50:3000`.
