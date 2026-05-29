use std::sync::Mutex;
use once_cell::sync::Lazy;

static MESSAGES: Lazy<Mutex<Vec<String>>> =
    Lazy::new(|| Mutex::new(vec![]));

#[tauri::command]
pub fn send_message(msg: String) -> String {
    let mut store = MESSAGES.lock().unwrap();
    store.push(msg.clone());
    format!("stored: {}", msg)
}

#[tauri::command]
pub fn get_messages() -> Vec<String> {
    MESSAGES.lock().unwrap().clone()
}
