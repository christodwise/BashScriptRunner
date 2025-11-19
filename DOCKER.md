# 🐳 Docker Deployment Guide

This guide covers everything you need to know about deploying BashRunner using Docker.

## Table of Contents

- [Quick Start](#quick-start)
- [Building the Image](#building-the-image)
- [Running the Container](#running-the-container)
- [Using Docker Compose](#using-docker-compose)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)

---

## Quick Start

### Prerequisites

- Docker (v20.10 or higher)
- Docker Compose (v2.0 or higher) - optional but recommended
- A Gemini API key from https://ai.google.dev/

### Fastest Way to Get Started

```bash
# 1. Create environment file
echo "GEMINI_API_KEY=your_api_key_here" > .env

# 2. Start with Docker Compose
docker-compose up -d

# 3. Access the application
open http://localhost:3000
```

That's it! The application is now running in a container.

---

## Building the Image

### Standard Build

```bash
docker build --build-arg GEMINI_API_KEY=your_api_key_here -t bashrunner:latest .
```

### Build with Custom Tag

```bash
docker build \
  --build-arg GEMINI_API_KEY=your_api_key_here \
  -t yourusername/bashrunner:v1.0.0 \
  .
```

### Multi-Architecture Build

For deployment across different platforms (ARM, x86):

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --build-arg GEMINI_API_KEY=your_api_key_here \
  -t bashrunner:latest \
  --push \
  .
```

### Build Arguments

| Argument | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key for AI simulation | Yes | - |

---

## Running the Container

### Basic Run

```bash
docker run -d \
  -p 3000:80 \
  --name bashrunner \
  bashrunner:latest
```

### Run with Custom Port

```bash
docker run -d \
  -p 8080:80 \
  --name bashrunner \
  bashrunner:latest
```

### Run with Restart Policy

```bash
docker run -d \
  -p 3000:80 \
  --name bashrunner \
  --restart unless-stopped \
  bashrunner:latest
```

### Run with Resource Limits

```bash
docker run -d \
  -p 3000:80 \
  --name bashrunner \
  --memory="512m" \
  --cpus="0.5" \
  bashrunner:latest
```

---

## Using Docker Compose

Docker Compose simplifies container management with a single configuration file.

### Start Services

```bash
# Start in detached mode
docker-compose up -d

# Start with build
docker-compose up -d --build

# Start and view logs
docker-compose up
```

### Stop Services

```bash
# Stop containers
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers, volumes, and images
docker-compose down -v --rmi all
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f bashrunner

# Last 100 lines
docker-compose logs --tail=100 -f
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart bashrunner
```

### Scale Services (if needed)

```bash
docker-compose up -d --scale bashrunner=3
```

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
PORT=3000
NODE_ENV=production
```

### Docker Compose Environment

The `docker-compose.yml` file automatically loads the `.env` file. You can also pass environment variables directly:

```bash
GEMINI_API_KEY=your_key PORT=8080 docker-compose up -d
```

### Nginx Configuration

The Dockerfile includes a custom Nginx configuration with:

- Gzip compression
- Static asset caching
- SPA routing support
- Security headers
- Health check endpoint at `/health`

To customize, modify the inline Nginx config in the Dockerfile.

---

## Troubleshooting

### Container Won't Start

1. **Check logs:**
   ```bash
   docker logs bashrunner
   ```

2. **Verify API key:**
   ```bash
   docker exec bashrunner env | grep GEMINI
   ```

3. **Check port conflicts:**
   ```bash
   lsof -i :3000
   # or
   netstat -tuln | grep 3000
   ```

### Health Check Failing

```bash
# Check health status
docker inspect --format='{{.State.Health.Status}}' bashrunner

# Test health endpoint directly
curl http://localhost:3000/health
```

### Application Not Loading

1. **Verify nginx is running:**
   ```bash
   docker exec bashrunner ps aux | grep nginx
   ```

2. **Check nginx logs:**
   ```bash
   docker exec bashrunner cat /var/log/nginx/error.log
   ```

3. **Test from inside container:**
   ```bash
   docker exec bashrunner wget -O- http://localhost/
   ```

### Build Fails

If you encounter SSL certificate errors during build:

The Dockerfile includes `npm config set strict-ssl false` to handle SSL issues in containerized build environments. This is safe for the build process but should not be used in production npm configurations.

### Permission Errors

The container runs as a non-root user (`appuser`) for security. If you encounter permission issues:

```bash
# Check user
docker exec bashrunner whoami

# Check file permissions
docker exec bashrunner ls -la /usr/share/nginx/html
```

---

## Production Deployment

### Security Checklist

- [ ] Use a secure method to pass the API key (secrets management)
- [ ] Enable HTTPS (use a reverse proxy like Traefik or nginx)
- [ ] Set up proper logging and monitoring
- [ ] Configure resource limits
- [ ] Enable Docker health checks
- [ ] Use specific image tags (not `latest`)
- [ ] Regularly update base images
- [ ] Scan images for vulnerabilities

### Using Docker Secrets (Swarm)

```yaml
version: '3.8'
services:
  bashrunner:
    image: bashrunner:latest
    secrets:
      - gemini_api_key
    environment:
      GEMINI_API_KEY_FILE: /run/secrets/gemini_api_key

secrets:
  gemini_api_key:
    external: true
```

### Behind a Reverse Proxy

#### Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name bashrunner.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Traefik

```yaml
version: '3.8'
services:
  bashrunner:
    image: bashrunner:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.bashrunner.rule=Host(`bashrunner.example.com`)"
      - "traefik.http.routers.bashrunner.entrypoints=websecure"
      - "traefik.http.routers.bashrunner.tls.certresolver=myresolver"
```

### Monitoring

#### Health Checks

The container includes a built-in health check:

```bash
# View health status
docker inspect --format='{{json .State.Health}}' bashrunner | jq
```

#### Prometheus Metrics (Optional)

Add nginx-prometheus-exporter as a sidecar:

```yaml
services:
  bashrunner:
    # ... main config ...
  
  nginx-exporter:
    image: nginx/nginx-prometheus-exporter:latest
    command:
      - -nginx.scrape-uri=http://bashrunner/nginx_status
    ports:
      - "9113:9113"
```

### Backup and Persistence

Since BashRunner stores data in browser local storage, there's no server-side data to backup. However, you may want to:

1. **Backup custom scripts** (stored client-side)
2. **Export execution history** (stored client-side)

Consider implementing server-side storage for enterprise deployments.

---

## Advanced Topics

### Custom Build with Different Base Images

```dockerfile
# Use a different Node version
FROM node:18-alpine AS builder
# ... rest of Dockerfile
```

### Adding Custom Scripts

Mount a volume with custom scripts:

```bash
docker run -d \
  -p 3000:80 \
  -v $(pwd)/custom-scripts:/app/scripts:ro \
  --name bashrunner \
  bashrunner:latest
```

### Development Mode

For development with hot reload:

```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd):/app \
  -w /app \
  --name bashrunner-dev \
  node:20-alpine \
  npm run dev
```

---

## Image Optimization

The Dockerfile uses multi-stage builds to optimize image size:

- **Builder stage**: ~500MB (includes build tools)
- **Production stage**: ~50MB (only nginx + static files)

### Further Optimization

1. **Remove source maps in production:**
   ```typescript
   // vite.config.ts
   build: {
     sourcemap: false
   }
   ```

2. **Use .dockerignore effectively** (already included)

3. **Minimize dependencies:**
   Review and remove unused packages

---

## Support

For issues related to Docker deployment:

1. Check this guide first
2. Review Docker logs: `docker logs bashrunner`
3. Open an issue on GitHub with:
   - Docker version: `docker --version`
   - OS information
   - Complete error messages
   - Steps to reproduce

---

<div align="center">
  
**Happy Dockerizing! 🐳**

[Back to Main README](README.md)

</div>
