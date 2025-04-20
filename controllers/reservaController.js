import { Reserva } from '../models/Reserva.js';
import { Viaje } from '../models/Viaje.js';

// Controlador para mostrar la página de reserva con el formulario
const paginaReservar = async (req, res) => {
    const { slug } = req.params;
    
    try {
        // Buscar el viaje por su slug
        const viaje = await Viaje.findOne({ where: { slug } });
        
        if (!viaje) {
            return res.redirect('/viajes');
        }
        
        // Verificar si hay plazas disponibles
        if (viaje.disponibles <= 0) {
            req.session.flash = {
                tipo: 'error',
                mensaje: 'Lo sentimos, no hay plazas disponibles para este viaje.'
            };
            return res.redirect(`/viajes/${slug}`);
        }
        
        res.render('reservar', {
            viaje,
            pagina: `Reservar ${viaje.titulo}`,
            errores: []
        });
    } catch (error) {
        console.error('Error al obtener el viaje para reservar:', error);
        res.render('error', { 
            pagina: 'Error',
            mensaje: 'Error al cargar la página de reserva' 
        });
    }
};

// Controlador para procesar el formulario de reserva
const procesarReserva = async (req, res) => {
    const { viaje_id, nombre, email, telefono, numero_personas } = req.body;
    const errores = [];
    
    // Validación básica
    if (nombre.trim() === '') {
        errores.push({ mensaje: 'El nombre es obligatorio' });
    }
    
    if (email.trim() === '') {
        errores.push({ mensaje: 'El email es obligatorio' });
    }
    
    if (telefono.trim() === '') {
        errores.push({ mensaje: 'El teléfono es obligatorio' });
    }
    
    if (numero_personas <= 0) {
        errores.push({ mensaje: 'Debe seleccionar al menos 1 persona' });
    }
    
    // Si hay errores, volver a mostrar el formulario
    if (errores.length > 0) {
        try {
            const viaje = await Viaje.findByPk(viaje_id);
            
            return res.render('reservar', {
                viaje,
                pagina: `Reservar ${viaje.titulo}`,
                errores,
                nombre,
                email,
                telefono,
                numero_personas
            });
        } catch (error) {
            console.error('Error al recargar formulario de reserva:', error);
            return res.render('error', { 
                pagina: 'Error',
                mensaje: 'Error al procesar la reserva' 
            });
        }
    }
    
    try {
        // Buscar el viaje para verificar disponibilidad
        const viaje = await Viaje.findByPk(viaje_id);
        
        if (!viaje) {
            return res.redirect('/viajes');
        }
        
        // Verificar si hay suficientes plazas disponibles
        if (viaje.disponibles < numero_personas) {
            errores.push({ mensaje: `Solo quedan ${viaje.disponibles} plazas disponibles` });
            
            return res.render('reservar', {
                viaje,
                pagina: `Reservar ${viaje.titulo}`,
                errores,
                nombre,
                email,
                telefono,
                numero_personas
            });
        }
        
        // Crear la reserva
        await Reserva.create({
            nombre,
            email,
            telefono,
            numero_personas,
            viaje_id,
            fecha_reserva: new Date()
        });
        
        // Actualizar plazas disponibles
        viaje.disponibles -= Number(numero_personas);
        await viaje.save();
        
        // Redirigir a la página de confirmación
        req.session.flash = {
            tipo: 'exito',
            mensaje: '¡Reserva realizada exitosamente!'
        };
        
        res.redirect('/reserva-confirmada');
    } catch (error) {
        console.error('Error al crear la reserva:', error);
        res.render('error', { 
            pagina: 'Error',
            mensaje: 'Error al procesar la reserva' 
        });
    }
};

// Página de confirmación de reserva
const paginaConfirmacion = (req, res) => {
    // Obtener mensaje flash si existe
    const flash = req.session.flash;
    req.session.flash = null;
    
    res.render('reserva-confirmada', {
        pagina: 'Reserva Confirmada',
        flash
    });
};

// Listar todas las reservas (para admin)
const obtenerReservasAdmin = async (req, res) => {
    try {
        const reservas = await Reserva.findAll({
            include: {
                model: Viaje,
                as: 'viaje'
            },
            order: [['fecha_reserva', 'DESC']]
        });

        res.render('admin/reservas', {
            reservas,
            pagina: 'Administración de Reservas'
        });
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        res.render('error', { 
            pagina: 'Error',
            mensaje: 'Error al obtener las reservas' 
        });
    }
};

export {
    paginaReservar,
    procesarReserva,
    paginaConfirmacion,
    obtenerReservasAdmin
}