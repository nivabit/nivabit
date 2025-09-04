# GitHub Secrets Configuration for Nivabit CI/CD

This document outlines the required GitHub secrets that need to be configured in your repository settings for the CI/CD workflow to function properly.

## Required Secrets

### Database Configuration
- `DATABASE_URL` - PostgreSQL connection string (e.g., `postgresql://username:password@host:port/database`)

### Authentication
- `JWT_SECRET` - Secret key for JWT token generation

### Email Configuration (SMTP)
- `SMTP_HOST` - SMTP server hostname (e.g., `smtp.gmail.com`)
- `SMTP_PORT` - SMTP server port (e.g., `587`)
- `SMTP_USERNAME` - SMTP username/email
- `SMTP_PASSWORD` - SMTP password or app-specific password
- `CONTACT_EMAIL` - Contact email address for the application

### Deployment Server Configuration
- `SERVER_HOST` - Your server's IP address or hostname
- `SERVER_USERNAME` - SSH username for server access
- `SERVER_PASSWORD` - SSH password for server access

### Application Configuration
- `PUBLIC_SITE_URL` - Public URL of your application (e.g., `https://nivabit.com`)

## How to Add Secrets to GitHub

1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret with its corresponding value

## Environment Variables in Production

The workflow will create a `.env` file on your server with these variables:

```env
NODE_ENV=production
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
CONTACT_EMAIL=your_contact_email
PUBLIC_SITE_URL=your_public_site_url
PORT=3000
```

## Workflow Features

### Integration Job
- Sets up PostgreSQL service for testing
- Runs database migrations
- Executes linting, type checking, unit tests, and E2E tests
- Uses Node.js 20 with npm caching

### Deployment Job
- Only runs after successful integration tests
- Builds the SvelteKit application
- Creates a deployment package with:
  - Built application files
  - Static assets
  - Production dependencies only
  - Environment configuration
  - Database schema and migrations
- Deploys to server using SCP
- Manages application lifecycle with PM2

### Server Setup Requirements

Your server should have:
- Node.js 20+ installed
- PM2 process manager installed (`npm install -g pm2`)
- PostgreSQL database accessible
- Proper directory structure: `~/domains/nivabit.com/public_html`

## Triggering Deployments

The workflow triggers on:
- Push to `main` or `version2` branches
- Pull requests to `main` or `version2` branches

## Monitoring

After deployment, you can monitor your application using PM2:
```bash
pm2 list
pm2 logs nivabit-app
pm2 restart nivabit-app
```
