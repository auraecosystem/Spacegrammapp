use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Message {
    pub from: String,
    pub content: String,
}

#[tauri::command]
pub fn send_message(msg: Message) -> String {
    println!("Message received: {}: {}", msg.from, msg.content);

    format!("Echo from Rust: {}", msg.content)
}

#[tauri::command]
pub fn handle_protocol(url: String) -> String {
    println!("Deep link triggered: {}", url);
    url
}
