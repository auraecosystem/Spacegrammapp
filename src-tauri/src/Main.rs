mod networking;
mod crypto;
mod ai;
mod storage;
mod messaging;
mod ai;
mod wallet;
mod p2p;
mod protocol;

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            messaging::send_message,
            messaging::get_messages,
            wallet::get_identity,
            wallet::sign_payload,
            ai::chat,
            protocol::route
        ])
        .setup(|app| {
            let _handle = app.handle();

            // Start background systems
            std::thread::spawn(|| {
                p2p::start_mesh();
            });

            std::thread::spawn(|| {
                ai::start_local_runtime();
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Web4 runtime failed");
}
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
