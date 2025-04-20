import dotenv from 'dotenv';
import db from './config/db.js';
import { Viaje } from './models/Viaje.js';
import { Oferta } from './models/Oferta.js';
import { Testimonial } from './models/Testimoniales.js';
import { Hotel } from './models/Hotel.js';
import { GuiaTuristico } from './models/GuiaTuristico.js';

// Cargar variables de entorno
dotenv.config();

// Función principal de depuración
async function debug() {
    console.log('=== INICIANDO DEPURACIÓN ===');

    try {
        // 1. Verificar conexión a la base de datos
        console.log('>> Probando conexión a la base de datos...');
        await db.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente');

        // 2. Verificar si existen las tablas necesarias
        console.log('>> Verificando tablas...');
        try {
            const [tables] = await db.query('SHOW TABLES');
            console.log('Tablas existentes:', tables.map(t => Object.values(t)[0]));
        } catch (error) {
            console.error('❌ Error al verificar tablas:', error.message);
        }

        // 3. Sincronizar modelos con la base de datos (crear tablas si no existen)
        console.log('>> Sincronizando modelos con la base de datos...');
        await db.sync({ alter: true }); // usar alter:true para actualizar estructura
        console.log('✅ Modelos sincronizados con la base de datos');

        // 4. Verificar contenido de las tablas principales
        console.log('>> Verificando contenido de la tabla viajes...');
        const viajes = await Viaje.findAll();
        console.log(`✅ La tabla viajes tiene ${viajes.length} registros`);

        console.log('>> Verificando contenido de la tabla ofertas...');
        const ofertas = await Oferta.findAll();
        console.log(`✅ La tabla ofertas tiene ${ofertas.length} registros`);

        console.log('>> Verificando contenido de la tabla testimoniales...');
        const testimoniales = await Testimonial.findAll();
        console.log(`✅ La tabla testimoniales tiene ${testimoniales.length} registros`);

        // 5. Intentar crear datos de prueba si las tablas están vacías
        if (viajes.length === 0) {
            console.log('>> Creando viaje de prueba...');
            const viajeTest = await Viaje.create({
                titulo: 'Viaje de Prueba a Madrid',
                precio: 350.99,
                fecha_ida: new Date('2025-05-15'),
                fecha_vuelta: new Date('2025-05-25'),
                imagenes: JSON.stringify(['/img/destinos/madrid1.jpg']),
                descripcion: 'Viaje de prueba a Madrid para depuración',
                disponibles: 20,
                slug: 'viaje-prueba-madrid'
            });
            console.log('✅ Viaje de prueba creado con ID:', viajeTest.id);
        }

        if (ofertas.length === 0) {
            console.log('>> Creando oferta de prueba...');
            const ofertaTest = await Oferta.create({
                imagen: '/img/ofertas/oferta-prueba.jpg',
                anuncio: '¡50% de descuento en viajes a Madrid! Oferta de prueba para depuración'
            });
            console.log('✅ Oferta de prueba creada con ID:', ofertaTest.id);
        }

        if (testimoniales.length === 0) {
            console.log('>> Creando testimonial de prueba...');
            const testimonialTest = await Testimonial.create({
                nombre: 'Usuario de Prueba',
                correo: 'prueba@ejemplo.com',
                mensaje: 'Este es un mensaje de prueba para depuración'
            });
            console.log('✅ Testimonial de prueba creado con ID:', testimonialTest.id);
        }

    } catch (error) {
        console.error('❌ ERROR GENERAL:', error);
    } finally {
        console.log('=== FIN DE DEPURACIÓN ===');
        process.exit();
    }
}

// Ejecutar la función de depuración
debug();
