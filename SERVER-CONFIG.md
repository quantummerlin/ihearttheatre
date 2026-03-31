# ============================================
# iHeartTheatre - Server Configuration
# For Actor Subdomain System
# ============================================

# This file contains server configuration examples for setting up
# wildcard subdomains for actor portfolio sites.

# ============================================
# APACHE CONFIGURATION (.htaccess or vhost)
# ============================================

# Option 1: Using .htaccess in root directory
# Place this in your .htaccess file:

<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Handle actor subdomains
    # Matches: actorname.ihearttheatre.com
    RewriteCond %{HTTP_HOST} ^([a-z0-9-]+)\.ihearttheatre\.com$ [NC]
    RewriteCond %{REQUEST_URI} !^/actors/
    RewriteRule ^(.*)$ /actors/%1/$1 [L]
    
    # If no specific file requested, serve index.html
    RewriteCond %{HTTP_HOST} ^([a-z0-9-]+)\.ihearttheatre\.com$ [NC]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^$ /actors/%1/index.html [L]
</IfModule>

# Option 2: Using Apache VirtualHost
# Place this in your Apache configuration (httpd.conf or sites-available):

<VirtualHost *:80>
    ServerName ihearttheatre.com
    ServerAlias *.ihearttheatre.com
    DocumentRoot /var/www/ihearttheatre
    
    # Enable mod_rewrite
    <Directory /var/www/ihearttheatre>
        AllowOverride All
        Require all granted
    </Directory>
    
    # Log files
    ErrorLog ${APACHE_LOG_DIR}/ihearttheatre_error.log
    CustomLog ${APACHE_LOG_DIR}/ihearttheatre_access.log combined
</VirtualHost>

# ============================================
# NGINX CONFIGURATION
# ============================================

# Place this in your nginx.conf or sites-available:

server {
    listen 80;
    server_name ihearttheatre.com *.ihearttheatre.com;
    root /var/www/ihearttheatre;
    index index.html;
    
    # Extract subdomain name
    set $subdomain "";
    if ($host ~ ^([a-z0-9-]+)\.ihearttheatre\.com$) {
        set $subdomain $1;
    }
    
    # Serve actor subdomain content
    location / {
        # If subdomain is set and not www
        if ($subdomain != "") {
            if ($subdomain != "www") {
                # Try to serve from actors directory
                try_files /actors/$subdomain$uri /actors/$subdomain$uri/ /actors/$subdomain/index.html =404;
            }
        }
        
        # Default behavior for main site
        try_files $uri $uri/ /index.html;
    }
    
    # Static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# ============================================
# DNS CONFIGURATION
# ============================================

# Add this A record to your DNS settings:
# Type: A
# Name: *.ihearttheatre.com (wildcard)
# Value: YOUR_SERVER_IP_ADDRESS
# TTL: 3600

# Example DNS records:
# @     A     YOUR_SERVER_IP    (root domain)
# www   A     YOUR_SERVER_IP    (www subdomain)
# *     A     YOUR_SERVER_IP    (wildcard for all subdomains)

# ============================================
# NODE.JS/EXPRESS CONFIGURATION (Alternative)
# ============================================

# If using Node.js with Express:

const express = require('express');
const path = require('path');
const app = express();

// Middleware to handle subdomains
app.use((req, res, next) => {
    const host = req.headers.host;
    const subdomain = host.split('.')[0];
    
    // Check if it's a subdomain (not www or main domain)
    if (subdomain && subdomain !== 'www' && subdomain !== 'ihearttheatre') {
        // Serve from actors directory
        const actorPath = path.join(__dirname, 'actors', subdomain);
        express.static(actorPath)(req, res, next);
    } else {
        next();
    }
});

// Serve main site
app.use(express.static(path.join(__dirname)));

// Handle 404s
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

# ============================================
# SUBDOMAIN AVAILABILITY CHECK (PHP)
# ============================================

<?php
// check-subdomain.php
// API endpoint to check if a subdomain is available

header('Content-Type: application/json');

$subdomain = strtolower(preg_replace('/[^a-z0-9-]/', '', $_GET['name'] ?? ''));

if (strlen($subdomain) < 3) {
    echo json_encode(['available' => false, 'error' => 'Too short']);
    exit;
}

$reserved = ['www', 'mail', 'ftp', 'admin', 'api', 'blog', 'shop', 'test'];

if (in_array($subdomain, $reserved)) {
    echo json_encode(['available' => false, 'error' => 'Reserved']);
    exit;
}

$actorDir = __DIR__ . '/actors/' . $subdomain;
$available = !is_dir($actorDir);

echo json_encode(['available' => $available]);
?>

# ============================================
# AUTOMATED PROVISIONING SCRIPT (Bash)
# ============================================

#!/bin/bash
# create-actor.sh
# Usage: ./create-actor.sh actorname

ACTOR_NAME=$1

if [ -z "$ACTOR_NAME" ]; then
    echo "Usage: ./create-actor.sh <actorname>"
    exit 1
fi

# Validate name (alphanumeric and hyphens only)
if [[ ! $ACTOR_NAME =~ ^[a-z0-9-]+$ ]]; then
    echo "Error: Actor name must be lowercase alphanumeric with hyphens only"
    exit 1
fi

# Check if already exists
if [ -d "actors/$ACTOR_NAME" ]; then
    echo "Error: Actor '$ACTOR_NAME' already exists"
    exit 1
fi

# Create directory
mkdir -p "actors/$ACTOR_NAME"

# Copy template
cp -r actors/template/* "actors/$ACTOR_NAME/"

# Replace placeholder text
find "actors/$ACTOR_NAME" -type f -name "*.html" -exec sed -i "s/Your Name/$ACTOR_NAME/g" {} \;
find "actors/$ACTOR_NAME" -type f -name "*.html" -exec sed -i "s/yourname/$ACTOR_NAME/g" {} \;

echo "✅ Actor subdomain created: $ACTOR_NAME.ihearttheatre.com"
echo "📁 Directory: actors/$ACTOR_NAME/"
echo ""
echo "Next steps:"
echo "1. Edit actors/$ACTOR_NAME/index.html to customize content"
echo "2. Add photos to actors/$ACTOR_NAME/images/"
echo "3. DNS should already be configured with wildcard"

# ============================================
# DEPLOYMENT CHECKLIST
# ============================================

# Before going live:

# [ ] 1. Configure DNS wildcard record (*.ihearttheatre.com)
# [ ] 2. Set up server (Apache/Nginx/Node) with subdomain handling
# [ ] 3. Test subdomain routing works
# [ ] 4. Create first actor site (penelopequinn)
# [ ] 5. Set up SSL certificate (Let's Encrypt with wildcard)
# [ ] 6. Test HTTPS on subdomains
# [ ] 7. Set up Telegram bot for inquiries
# [ ] 8. Create payment processing (Stripe/PayPal)
# [ ] 9. Set up automated provisioning
# [ ] 10. Test complete flow end-to-end

# ============================================
# SSL CERTIFICATE (Let's Encrypt)
# ============================================

# For wildcard SSL certificate:
# certbot certonly --manual -d *.ihearttheatre.com -d ihearttheatre.com --preferred-challenges dns

# Auto-renewal:
# Add to crontab:
# 0 0 * * * certbot renew --quiet

# ============================================
# MONITORING
# ============================================

# Check subdomain health:
# for subdomain in $(ls actors/); do
#     curl -s -o /dev/null -w "%{http_code}" "https://$subdomain.ihearttheatre.com"
# done
