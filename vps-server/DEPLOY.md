# FBTI 服务端部署指南

## 1. 在 VPS 上安装 Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证
node -v  # 应显示 v18.x
npm -v
```

## 2. 上传代码并安装依赖

```bash
# 把 vps-server 目录上传到 VPS
scp -r vps-server root@你的VPS:~/fbti-server

# 安装依赖
cd ~/fbti-server
npm install

# 配置环境变量
cp .env.example .env
nano .env    # 填写 AppID 和 AppSecret
```

## 3. 配置 HTTPS（必做）

微信要求 API 必须是 HTTPS。

### 用 nginx + Let's Encrypt（推荐）

```bash
# 安装 nginx
sudo apt-get install -y nginx

# 安装 certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 配置 nginx
sudo nano /etc/nginx/sites-available/fbti
```

把以下内容贴进去（替换你的域名）：

```nginx
server {
    listen 80;
    server_name 你的域名.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 443 ssl;
    server_name 你的域名.com;

    ssl_certificate /etc/letsencrypt/live/你的域名.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/你的域名.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/fbti /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 申请证书
sudo certbot --nginx -d 你的域名.com
```

## 4. 用 PM2 保持服务运行

```bash
npm install -g pm2
cd ~/fbti-server
pm2 start index.js --name fbti-server
pm2 save
pm2 startup   # 开机自启
```

## 5. 小程序端配置

登录 mp.weixin.qq.com → 「开发」→「开发管理」

→ 「服务器域名」→「request 合法域名」添加：
```
https://你的域名.com
```

## 6. 测试

```bash
# 测试服务是否正常
curl http://localhost:3000/api/getQRCode

# 测试 HTTPS
curl https://你的域名.com/api/getQRCode
```
