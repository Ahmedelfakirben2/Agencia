// routes/index.js
import express from 'express';
import * as paginaController from '../controllers/paginaController.js';
import * as testimonialesController from '../controllers/testimonialesController.js';
import * as reservaController from '../controllers/reservaController.js';
// Eliminamos esta importación para evitar referencias circulares
// import adminRoutes from './adminRoutes.js';

const router = express.Router();

router.get('/', paginaController.paginaInicio );
router.get('/nosotros', paginaController.paginaNosotros );
router.get('/ofertas', paginaController.paginaOfertas); // Nueva ruta para ofertas
// Rutas de reserva
router.get('/reservar/:slug', reservaController.paginaReservar);
router.post('/reservar', reservaController.procesarReserva);
router.get('/reserva-confirmada', reservaController.paginaConfirmacion);

// Ruta de prueba para verificar relación hotel
router.get('/prueba-hotel/:viaje', paginaController.pruebaHotel);

// Rutas de Viajes
 router.get('/viajes', paginaController.paginaViajes);
 router.get('/viajes/:viaje', paginaController.paginaDetalleViaje);

// Rutas de Testimoniales
 router.get('/testimoniales', testimonialesController.paginaTestimoniales);
 router.post('/testimoniales', testimonialesController.crearTestimonial);

// --- RUTAS DE LOGIN ---

// Ruta para mostrar el formulario de login
 router.get('/login', (req, res) => {
  res.render('login', { error: null }); // Pasamos null como valor inicial de error
 });

// Ruta para procesar el formulario de login
 router.post('/login', (req, res) => {
  // Credenciales fijas (¡NO USAR EN PRODUCCIÓN!)
  const ADMIN_EMAIL = 'admin@viajes.com';
  const ADMIN_PASSWORD = 'password';

  // Obtener datos del formulario
  const { email, password } = req.body;

  // Comparar credenciales
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Credenciales correctas: Autenticar y redirigir
    req.session.authUser = true; // Set authUser to true
    console.log('>>>> Usuario AUTENTICADO con credenciales fijas. Redirigiendo a /admin...');
    res.redirect('/admin');
  } else {
    // Credenciales incorrectas: Mostrar error y volver al login
    console.log('!!!! Credenciales INCORRECTAS !!!!. Redirigiendo de nuevo a /login...');
    res.render('login', { error: 'Credenciales incorrectas. Intenta de nuevo.' });
  }
 });

// Ya no necesitamos esta línea ya que adminRoutes se maneja directamente en index.js
// router.use('/admin', adminRoutes);

 export default router;