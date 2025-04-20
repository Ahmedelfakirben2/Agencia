import { Sequelize } from 'sequelize';
import db from '../config/db.js';

const Oferta = db.define('ofertas', {
    imagen: {
        type: Sequelize.STRING,
        allowNull: true, // Permitimos que sea nulo para mayor flexibilidad
        defaultValue: '' // Valor por defecto vacío
    },
    anuncio: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

export { Oferta };