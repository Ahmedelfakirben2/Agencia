# Agencia de Viajes

Aplicación web para una agencia de viajes desarrollada con Node.js, Express, Sequelize y MySQL.

## Características

- Gestión de viajes, hoteles, guías turísticos y ofertas
- Panel de administración protegido por autenticación
- Visualización de testimonios de clientes
- Sistema de reservas
- Diseño responsive con PUG como motor de plantillas

## Requisitos previos

- Node.js (v14+)
- MySQL
- npm

## Instalación

1. Clona el repositorio o descomprime el archivo ZIP
2. Configura la base de datos MySQL
3. Configura las variables de entorno en el archivo `.env`
4. Ejecuta los siguientes comandos:

```bash
# Instalar dependencias
npm install

# Ejecutar migraciones
npm run migrate

# Iniciar el servidor
npm start
```

O simplemente ejecuta el archivo `restart.bat` que realizará todos estos pasos automáticamente.

## Acceso a la aplicación

- **Frontend**: http://localhost:4000
- **Panel de administración**: http://localhost:4000/admin
  - Usuario: admin@viajes.com
  - Contraseña: password

## Estructura del proyecto

```
/
├── config/           # Configuración de la base de datos
├── controllers/      # Controladores de la aplicación
├── middlewares/      # Middlewares personalizados
├── migrations/       # Migraciones de la base de datos
├── models/           # Modelos de Sequelize
├── public/           # Archivos estáticos
│   ├── css/
│   ├── js/
│   └── uploads/      # Imágenes subidas
├── routes/           # Rutas de la aplicación
├── views/            # Plantillas PUG
├── .env              # Variables de entorno
├── index.js          # Punto de entrada
├── restart.bat       # Script de reinicio
└── package.json
```

## Solución de problemas

Si encuentras errores al iniciar la aplicación, asegúrate de:

1. Tener MySQL instalado y en ejecución
2. Haber configurado correctamente las credenciales en el archivo `.env`
3. Haber creado la base de datos `agencia_viajes` en MySQL
4. Ejecutar las migraciones con `npm run migrate`
5. Reiniciar por completo usando el archivo `restart.bat`

## Desarrollo

Para el modo de desarrollo con recarga automática, ejecuta:

```bash
npm run dev
```

## Licencia

ISC
#   h t t p s - - - g i t h u b . c o m - A h m e d e l f a k i r b e n 2 - A g e n c i a d e v i a j e s  
 