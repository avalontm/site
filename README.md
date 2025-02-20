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
User=root
WorkingDirectory=/home/avalontm/ftp/site
ExecStart=/usr/bin/npm start
Restart=always
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
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

