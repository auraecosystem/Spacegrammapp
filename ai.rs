use std::sync::Mutex;
use once_cell::sync::Lazy;

static MEMORY: Lazy<Mutex<Vec<String>>> =
    Lazy::new(|| Mutex::new(vec![]));

pub fn start_local_runtime() {
    println!("AI runtime started (mock engine)");
}

#[tauri::command]
pub fn chat(input: String) -> String {
    let mut mem = MEMORY.lock().unwrap();
    mem.push(input.clone());

    format!("Web4 AI response: {}", input)
}
