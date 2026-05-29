use rand::Rng;

#[tauri::command]
pub fn get_identity() -> String {
    let id: u64 = rand::thread_rng().gen();
    format!("fdk-identity-{}", id)
}

#[tauri::command]
pub fn sign_payload(payload: String) -> String {
    format!("signed({})::fake_signature", payload)
}
