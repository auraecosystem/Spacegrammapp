#[tauri::command]
pub fn route(url: String) -> String {
    if url.starts_with("tg://") {
        return format!("Telegram route handled: {}", url);
    }

    if url.starts_with("tonsite://") {
        return format!("TON route handled: {}", url);
    }

    format!("Unknown protocol: {}", url)
}
