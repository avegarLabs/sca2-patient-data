mod schema;

use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use dotenv::dotenv;
use log::{error, info};
use serde::{Deserialize, Serialize};
use tauri::command;

use self::schema::datos_generales;
use self::schema::sca;
use self::schema::sintomas;

#[derive(Queryable, Serialize)]
struct Sca {
    id: Option<i32>,
    nombre: String,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = sca)]
struct NewSca {
    nombre: String,
}

fn establish_connection() -> SqliteConnection {
    dotenv().ok();
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url).expect("Error connecting to database")
}

#[command]
fn list_scas() -> Result<Vec<Sca>, String> {
    use self::schema::sca::dsl::*;
    let mut conn = establish_connection();
    sca.load::<Sca>(&mut conn).map_err(|e| e.to_string())
}

#[command]
fn insert_sca(#[allow(non_snake_case)] new_nombre: String) -> Result<(), String> {
    info!("insert_sca llamado con nombre: {}", new_nombre);
    let mut conn = establish_connection();
    let new_sca = NewSca {
        nombre: new_nombre.clone(),
    };

    match diesel::insert_into(sca::table)
        .values(&new_sca)
        .execute(&mut conn)
    {
        Ok(_) => {
            info!("Insert exitoso");
            Ok(())
        }
        Err(e) => {
            error!("Error al insertar: {}", e);
            Err(e.to_string())
        }
    }
}

#[command]
fn delete_sca(#[allow(non_snake_case)] sca_id: i32) -> Result<(), String> {
    info!("Intentando eliminar SCA con ID: {}", sca_id);
    use self::schema::sca::dsl::*;
    let mut conn = establish_connection();
    match diesel::delete(sca.filter(id.eq(sca_id))).execute(&mut conn) {
        Ok(count) => {
            info!("Eliminados {} registros", count);
            Ok(())
        }
        Err(e) => {
            error!("Error en eliminación: {}", e);
            Err(e.to_string())
        }
    }
}

#[derive(Queryable, Serialize)]
struct Sintomas {
    id: Option<i32>,
    nombre: String,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = sintomas)]
struct NewSintoma {
    nombre: String,
}

#[command]
fn list_sintomas() -> Result<Vec<Sintomas>, String> {
    use crate::schema::sintomas::dsl::*;
    let mut conn = establish_connection();

    sintomas
        .load::<Sintomas>(&mut conn)
        .map_err(|e| e.to_string())
}

#[command]
fn insert_sintoma(#[allow(non_snake_case)] new_nombre: String) -> Result<(), String> {
    use self::schema::sintomas;
    let mut conn = establish_connection();
    let new_sintoma = NewSintoma { nombre: new_nombre };

    diesel::insert_into(sintomas::table)
        .values(&new_sintoma)
        .execute(&mut conn)
        .map(|_| ())
        .map_err(|e| e.to_string())
}

#[command]
fn delete_sintoma(#[allow(non_snake_case)] sintoma_id: i32) -> Result<usize, String> {
    use crate::schema::sintomas::dsl::*;
    let mut conn = establish_connection();

    diesel::delete(sintomas.filter(id.eq(sintoma_id)))
        .execute(&mut conn)
        .map_err(|e| e.to_string())
}

//para los datos generales

#[derive(Queryable, Serialize)]
pub struct DatosGenerales {
    id: Option<i32>,
    codigo: String,
    #[serde(rename = "nombresApellidos")]
    nombres_apellidos: Option<String>,
    #[serde(rename = "historiaClinica")]
    historia_clinica: Option<String>,
    #[serde(rename = "areaSalud")]
    area_salud: Option<String>,
    // Los demás campos los dejamos fuera porque no los usas ahora
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = datos_generales)]
pub struct NewDatosGenerales {
    codigo: String,
    nombres_apellidos: Option<String>,
    historia_clinica: Option<String>,
    area_salud: Option<String>,
}

#[command]
fn add_datos_generales(
    #[allow(non_snake_case)] codigo: String,
    #[allow(non_snake_case)] nombres_apellidos: Option<String>,
    #[allow(non_snake_case)] historia_clinica: Option<String>,
    #[allow(non_snake_case)] area_salud: Option<String>,
) -> Result<(), String> {
    let mut conn = establish_connection();

    let nuevo = NewDatosGenerales {
        codigo,
        nombres_apellidos,
        historia_clinica,
        area_salud,
    };

    diesel::insert_into(datos_generales::table)
        .values(&nuevo)
        .execute(&mut conn)
        .map(|_| {
            println!("Insert exitoso");
        })
        .map_err(|e| {
            println!("Error al insertar: {}", e);
            e.to_string()
        })
}

#[command]
fn list_datos_generales() -> Result<Vec<DatosGenerales>, String> {
    let mut conn = establish_connection();

    datos_generales::table
        .select((
            datos_generales::id,
            datos_generales::codigo,
            datos_generales::nombres_apellidos,
            datos_generales::historia_clinica,
            datos_generales::area_salud,
        ))
        .load::<DatosGenerales>(&mut conn)
        .map_err(|e| {
            println!("Error al listar: {}", e);
            e.to_string()
        })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            list_scas,
            insert_sca,
            delete_sca,
            list_sintomas,
            insert_sintoma,
            delete_sintoma,
            list_datos_generales,
            add_datos_generales
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
