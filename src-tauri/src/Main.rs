mod networking;
mod crypto;
mod ai;
mod storage;

use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello {}", name)
}

fn main() {
    storage::init();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {

            println!("Spacegramm initialized");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
