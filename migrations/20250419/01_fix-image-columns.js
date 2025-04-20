// migrations/20250419/01_fix-image-columns.js
import { Sequelize } from 'sequelize';
import db from '../../config/db.js';

async function up() {
  const queryInterface = db.getQueryInterface();
  
  try {
    // Verificar si la columna imagenes ya existe en la tabla viajes
    const viajesColumnas = await queryInterface.describeTable('viajes');
    
    // Si la columna existe y no es TEXT, la modificamos
    if (viajesColumnas.imagenes && viajesColumnas.imagenes.type !== 'TEXT') {
      await queryInterface.changeColumn('viajes', 'imagenes', {
        type: Sequelize.TEXT,
        allowNull: true
      });
      console.log('✅ Migración: Columna imagenes en viajes convertida a TEXT');
    } else {
      console.log('ℹ️ Migración: La columna imagenes ya es TEXT o no existe en viajes');
    }

    // Asegurar que las otras tablas también usen el formato correcto
    const tablas = ['hoteles', 'guias', 'ofertas'];
    
    for (const tabla of tablas) {
      try {
        const columnas = await queryInterface.describeTable(tabla);
        
        if (columnas.imagenes && columnas.imagenes.type !== 'TEXT') {
          await queryInterface.changeColumn(tabla, 'imagenes', {
            type: Sequelize.TEXT,
            allowNull: true
          });
          console.log(`✅ Migración: Columna imagenes en ${tabla} convertida a TEXT`);
        } else {
          console.log(`ℹ️ Migración: La columna imagenes ya es TEXT o no existe en ${tabla}`);
        }
      } catch (error) {
        // Ignorar tabla si no existe
        console.log(`ℹ️ Migración: La tabla ${tabla} no existe o no se puede acceder`);
      }
    }
    
    console.log('🎉 Migración completada con éxito');
    return true;
  } catch (error) {
    console.error('❌ Error en la migración:', error);
    return false;
  }
}

async function down() {
  console.log('⚠️ No se ha implementado la reversión de esta migración');
  return true;
}

export { up, down };
