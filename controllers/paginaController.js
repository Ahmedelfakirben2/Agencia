import { Viaje } from "../models/Viaje.js";
import { Testimonial } from '../models/Testimoniales.js';
import { GuiaTuristico } from '../models/GuiaTuristico.js';
import { Hotel } from '../models/Hotel.js';
import { Oferta } from '../models/Oferta.js';

const paginaInicio = async (req, res) => {
    const consultasDB = [];
    
    consultasDB.push(Viaje.findAll({limit: 3}))
    consultasDB.push(Testimonial.findAll({limit: 3}));
    consultasDB.push(Oferta.findAll({limit: 3})); // Añadimos consulta de ofertas

    try {
        const resultado = await Promise.all(consultasDB);

        // Procesamiento de imágenes para asegurar formato correcto
        const viajesConImagenes = resultado[0].map(viaje => {
            // Si las imágenes no son un array, convertirlas
            if (viaje.imagenes && !Array.isArray(viaje.imagenes)) {
                try {
                    // Intentar parsear si es un string JSON
                    viaje.imagenes = JSON.parse(viaje.imagenes);
                } catch (e) {
                    // Si hay error, crear un array con la primera imagen
                    viaje.imagenes = viaje.imagenes ? [viaje.imagenes] : [];
                }
            }
            return viaje;
        });

        res.render('inicio', {
            pagina: "Inicio",
            clase: 'home',
            viajes: viajesConImagenes,
            testimoniales: resultado[1],
            ofertas: resultado[2] // Pasamos las ofertas a la vista
        });
    } catch (error) {
        console.error('Error en página de inicio:', error);
        res.status(500).render('error', {
            pagina: 'Error',
            mensaje: 'Hubo un problema al cargar la página de inicio'
        });
    }
}

const paginaNosotros = async (req, res) => {
    try {
        // Consultar todos los hoteles y guías
        const [hoteles, guias] = await Promise.all([
            Hotel.findAll(),
            GuiaTuristico.findAll()
        ]);

        res.render('nosotros', {
            pagina: 'Nosotros',
            hoteles,
            guias
        });
    } catch (error) {
        console.error('Error en página nosotros:', error);
        res.status(500).render('error', {
            pagina: 'Error',
            mensaje: 'Error al cargar la página de nosotros'
        });
    }
}

const paginaViajes = async (req, res) => {
    try {
        const [viajesData, ofertas] = await Promise.all([
            Viaje.findAll({
                include: [
                    { model: GuiaTuristico },
                    { model: Hotel }
                ]
            }),
            Oferta.findAll({limit: 2}) // Obtenemos 2 ofertas para mostrar en el lateral
        ]);
        
        // Procesamiento de imágenes para asegurar formato correcto
        const viajes = viajesData.map(viaje => {
            // Si las imágenes no son un array, convertirlas
            if (viaje.imagenes && !Array.isArray(viaje.imagenes)) {
                try {
                    // Intentar parsear si es un string JSON
                    viaje.imagenes = JSON.parse(viaje.imagenes);
                } catch (e) {
                    // Si hay error, crear un array con la primera imagen
                    viaje.imagenes = viaje.imagenes ? [viaje.imagenes] : [];
                }
            }
            return viaje;
        });
        
        res.render('viajes', {
            pagina: 'Proximos Viajes', 
            viajes,
            ofertas
        });
    } catch (error) {
        console.error('Error en página de viajes:', error);
        res.status(500).render('error', {
            pagina: 'Error',
            mensaje: 'Error al cargar la página de viajes'
        });
    }
}

const paginaTestimoniales = async (req, res) => {
    try {
        const testimoniales = await Testimonial.findAll();
        res.render('testimoniales', {pagina: 'Testimoniales', testimoniales});
    } catch(error) {
        console.log(error);
    }
}

// Muestra un viaje por su slug
const paginaDetalleViaje = async (req, res) => {
    const { viaje } = req.params;
    
    try {
        const resultado = await Viaje.findOne({
            where: { slug: viaje },
            include: [
                { model: GuiaTuristico },
                { model: Hotel }
            ]
        });

        if (!resultado) {
            return res.redirect('/viajes');
        }

        // Procesamiento de imágenes para asegurar formato correcto
        if (resultado.imagenes && !Array.isArray(resultado.imagenes)) {
            try {
                // Intentar parsear si es un string JSON
                resultado.imagenes = JSON.parse(resultado.imagenes);
            } catch (e) {
                // Si hay error, crear un array con la primera imagen
                resultado.imagenes = resultado.imagenes ? [resultado.imagenes] : [];
            }
        }

        // Procesamiento de puntos_itinerario para asegurar formato correcto
        if (resultado.puntos_itinerario && !Array.isArray(resultado.puntos_itinerario)) {
            try {
                // Intentar parsear si es un string JSON
                if (typeof resultado.puntos_itinerario === 'string') {
                    resultado.puntos_itinerario = JSON.parse(resultado.puntos_itinerario);
                }
            } catch (e) {
                console.error('Error al parsear puntos_itinerario:', e);
                resultado.puntos_itinerario = [];
            }
        }

        // Agregamos debug para verificar la relación
        console.log('======= DEBUG VIAJE DETALLE =========');
        console.log('Viaje ID:', resultado.id);
        console.log('Hotel asociado:', resultado.hotele ? 'SÍ' : 'NO');
        if (resultado.hotele) {
            console.log('Hotel ID:', resultado.hotele.id);
            console.log('Hotel nombre:', resultado.hotele.nombre);
        }
        console.log('Guia asociado:', resultado.guias_turistico ? 'SÍ' : 'NO'); 
        if (resultado.guias_turistico) {
            console.log('Guia ID:', resultado.guias_turistico.id);
            console.log('Guia nombre:', resultado.guias_turistico.nombre);
        }
        console.log('Propiedades en resultado:', Object.keys(resultado.dataValues));
        console.log('=================================');

        res.render('viaje', {
            pagina: 'Informacion Viaje',
            resultado
        });
    } catch(error) {
        console.error('Error en la página de detalle viaje:', error);
        res.status(500).render('error', {
            pagina: 'Error',
            mensaje: 'No se pudo cargar el detalle del viaje'
        });
    }
}

const guardarTestimonial = async (req, res) => {
    const { nombre, correo, mensaje } = req.body;
    const errores = [];

    if(nombre.trim() === '') {
        errores.push({mensaje: 'El nombre está vacío'});
    }
    if(correo.trim() === '') {
        errores.push({mensaje: 'El correo está vacío'});
    }
    if(mensaje.trim() === '') {
        errores.push({mensaje: 'El mensaje está vacío'});
    }

    if(errores.length > 0) {
        const testimoniales = await Testimonial.findAll();
        res.render('testimoniales', {
            pagina: 'Testimoniales',
            errores,
            nombre,
            correo,
            mensaje,
            testimoniales
        });
    } else {
        try {
            await Testimonial.create({
                nombre,
                correo,
                mensaje
            });
            res.redirect('/testimoniales');
        } catch(error) {
            console.log(error);
        }
    }
}

// Nueva función para mostrar la página de ofertas
const paginaOfertas = async (req, res) => {
    try {
        const ofertas = await Oferta.findAll();
        res.render('ofertas', {
            pagina: 'Ofertas Especiales',
            ofertas
        });
    } catch(error) {
        console.log(error);
        res.status(500).render('error', {
            pagina: 'Error',
            mensaje: 'Error al cargar las ofertas'
        });
    }
}

// Función de prueba para verificar la relación con el hotel
const pruebaHotel = async (req, res) => {
    const { viaje } = req.params;
    
    try {
        // Realizamos la misma consulta que en paginaDetalleViaje pero con más detalles para debug
        const resultado = await Viaje.findOne({
            where: { slug: viaje },
            include: [
                { model: GuiaTuristico },
                { model: Hotel }
            ]
        });

        if (!resultado) {
            return res.status(404).render('error', {
                pagina: 'Viaje no encontrado',
                mensaje: 'El viaje solicitado no existe'
            });
        }

        // Registramos información en la consola para debugging
        console.log('======= INFORMACIÓN DE DEBUG HOTEL =========');
        console.log('ID del viaje:', resultado.id);
        console.log('Título del viaje:', resultado.titulo);
        console.log('Hotel asociado:', resultado.hotel ? 'SÍ' : 'NO');
        if (resultado.hotel) {
            console.log('Nombre del hotel:', resultado.hotel.nombre);
            console.log('ID del hotel:', resultado.hotel.id);
            console.log('Tiene imágenes (array):', resultado.hotel.imagenes ? 'SÍ' : 'NO');
            console.log('Tiene imagen (singular):', resultado.hotel.imagen ? 'SÍ' : 'NO');
        }
        console.log('==============================================');

        // Renderizamos la vista de prueba con toda la información
        res.render('prueba-hotel', {
            pagina: 'Prueba de Relación Hotel',
            resultado
        });
    } catch(error) {
        console.error('Error en pruebaHotel:', error);
        res.status(500).render('error', {
            pagina: 'Error',
            mensaje: 'Error al cargar los datos del viaje y hotel'
        });
    }
};

export {
    paginaInicio,
    paginaNosotros,
    paginaViajes,
    paginaTestimoniales,
    paginaDetalleViaje,
    // guardarTestimonial, // Esta función parece ser reemplazada por crearTestimonial en testimonialesController
    paginaOfertas,
    pruebaHotel
};