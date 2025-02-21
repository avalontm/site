# Mochi Mochi Ensenada - Aplicacion Web (FrontEnd)

## Descripción
Este es un proyecto desarrollado con React y Vite, utilizando Tailwind CSS para el diseño de estilos. La aplicación está diseñada para la gestión del sitio web de Mochi Mochi Ensenada, haciendo consultas a una API para obtener información relevante.

## Características
- **Interfaz Moderna**: Uso de Tailwind CSS para un diseño responsivo y atractivo.
- **Gestión de Contenido**: Consulta y visualización de datos desde una API.
- **Carrusel de Imágenes 3D**: Animaciones atractivas para mostrar productos o contenido destacado.
- **Carga Diferida (Lazy Loading)**: Optimización del rendimiento cargando secciones de la app solo cuando se necesitan.

## Requisitos del Sistema
### Frontend
- Node.js >= 18.x
- npm o yarn para gestionar paquetes
- Vite para ejecutar la aplicación

## Instalación y Uso
### Clonar el repositorio
```sh
git clone https://github.com/avalontm/site.git
cd site
```

### Instalación de dependencias
```sh
npm install
```

### Ejecutar el entorno de desarrollo
```sh
npm run dev
```

### Construcción para producción
```sh
npm run build
```

## Despliegue en Servidor VPS
1. Configurar Nginx o Apache para servir la aplicación.
2. Usar PM2 para manejar la ejecución del servidor de Node.js.
3. Configurar el dominio `avalontm.info` para acceder a la aplicación.

## Licencia
Este proyecto está bajo la Licencia MIT. Puedes ver más detalles en el archivo `LICENSE`.

## Contribuciones
Si deseas contribuir, por favor crea un fork del repositorio y envía un pull request con tus cambios.

## Contacto
Para más información, visita [avalontm.info](http://avalontm.info) o contacta al equipo de desarrollo.


## Script para Linux
```
sudo nano /etc/systemd/system/site.service
```

```
[Unit]
Description=Servicio de React App
After=network.target

[Service]
Type=simple
WorkingDirectory=/home/avalontm/ftp/site
ExecStart=/usr/local/bin/serve -s . -p 8080
Restart=always
Environment=PATH=/usr/bin:/usr/local/bin:/bin:/usr/sbin:/sbin
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=react-site

[Install]
WantedBy=multi-user.target
```

### Recarga los servicios de systemd para que el nuevo servicio se registre:
```
sudo systemctl daemon-reload
```

```
sudo systemctl enable site.service
```

### NGINX (archivo de configuracion)
```
# Detectar bots antes de definir la configuración del servidor
map $http_user_agent $is_bot {
    default 0;
    "~*(Twitterbot|facebookexternalhit|WhatsApp|Slackbot|Googlebot|Bingbot|LinkedInBot|Discordbot)" 1;
}

server {
    listen 80;
    listen [::]:80;
    server_name avalontm.info www.avalontm.info 192.206.141.160;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name avalontm.info www.avalontm.info 192.206.141.160;

    ssl_certificate /etc/letsencrypt/live/avalontm.info/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/avalontm.info/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Redirigir bots a Flask para pre-renderizar el HTML
    location ~ ^/producto/([a-zA-Z0-9\-]+)$ {
        set $uuid $1;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        #  Si es un bot, lo redirige al backend Flask para pre-renderizar
        if ($is_bot = 1) {
            rewrite ^/producto/([a-zA-Z0-9\-]+)$ /api/producto/render/$1 break;
	    proxy_pass http://127.0.0.1:8081;
        }

        # Si no es un bot, React maneja la ruta
        try_files $uri /index.html;
    }

    # Proxy a Flask para la API (sin /api en la URL)
    location /producto/render/ {
        proxy_pass http://127.0.0.1:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

```

### NGINX (soluciones)
```
sudo chown -R www-data:www-data /home/avalontm/ftp/site
```

### FTP (soluciones)

```
chown -R avalontm:www-data /home/avalontm/ftp/site
chmod -R 775 /home/avalontm/ftp/site
```
