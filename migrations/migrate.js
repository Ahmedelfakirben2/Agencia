// migrations/migrate.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Configurar variables de entorno
dotenv.config();

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para ejecutar migraciones de forma secuencial
async function runMigrations() {
  console.log('🚀 Iniciando migraciones...');
  
  try {
    // Leer los directorios de migraciones (ordenados por fecha)
    const dirs = fs.readdirSync(__dirname)
      .filter(dir => /^\d{8}$/.test(dir)) // formato YYYYMMDD
      .sort();
    
    if (dirs.length === 0) {
      console.log('ℹ️ No se encontraron directorios de migración.');
      return;
    }
    
    // Para cada directorio, ejecutar las migraciones en orden
    for (const dir of dirs) {
      const migrationDir = path.join(__dirname, dir);
      
      // Leer los archivos de migración (ordenados por nombre)
      const files = fs.readdirSync(migrationDir)
        .filter(file => file.endsWith('.js'))
        .sort();
      
      if (files.length === 0) {
        console.log(`ℹ️ No se encontraron archivos de migración en ${dir}.`);
        continue;
      }
      
      console.log(`📂 Ejecutando migraciones en ${dir}...`);
      
      // Ejecutar cada migración
      for (const file of files) {
        const migrationFile = path.join(migrationDir, file);
        console.log(`   🔄 Ejecutando ${file}...`);
        
        try {
          // Importar dinámicamente la migración
          const migration = await import(migrationFile);
          
          // Ejecutar la migración
          if (typeof migration.up === 'function') {
            const result = await migration.up();
            if (result) {
              console.log(`   ✅ Migración ${file} completada con éxito.`);
            } else {
              console.log(`   ❌ Migración ${file} falló.`);
            }
          } else {
            console.log(`   ⚠️ ${file} no contiene una función 'up'.`);
          }
        } catch (error) {
          console.error(`   ❌ Error al ejecutar ${file}:`, error);
        }
      }
    }
    
    console.log('🎉 Proceso de migración completado.');
  } catch (error) {
    console.error('❌ Error en el proceso de migración:', error);
  }
}

// Ejecutar las migraciones
runMigrations();
