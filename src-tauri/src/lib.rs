use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use dotenv::dotenv;
use log::{error, info};
use serde::{Deserialize, Serialize};
use tauri::command;

mod schema {
    diesel::table! {
        sca (id) {
            id -> Nullable<Integer>,
            nombre -> Text,
        }
    }
    diesel::table! {
        sintomas (id) {
            id -> Nullable<Integer>,
            nombre -> Text,
        }
    }
}

use self::schema::sca;

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

// para la tabla sintomas
use self::schema::sintomas;

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
fn insert_sintoma(
    #[allow(non_snake_case)] new_nombre: String,
) -> Result<(), String> {
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
fn delete_sintoma(
    #[allow(non_snake_case)] sintoma_id: i32, 
) -> Result<usize, String> {
    use crate::schema::sintomas::dsl::*;
    let mut conn = establish_connection();

    diesel::delete(sintomas.filter(id.eq(sintoma_id)))
        .execute(&mut conn)
        .map_err(|e| e.to_string())
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
        .invoke_handler(tauri::generate_handler![list_scas, insert_sca, delete_sca, list_sintomas, insert_sintoma, delete_sintoma])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
