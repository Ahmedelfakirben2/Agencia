import { Sequelize } from 'sequelize';
import db from '../config/db.js';
import { Viaje } from './Viaje.js';

const Reserva = db.define('reservas', {
    nombre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    telefono: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fecha_reserva: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    numero_personas: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    viaje_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Viaje,
            key: 'id'
        }
    }
});

// Establecer la relación entre Reserva y Viaje
Reserva.belongsTo(Viaje, { foreignKey: 'viaje_id', as: 'viaje' });

export { Reserva };
