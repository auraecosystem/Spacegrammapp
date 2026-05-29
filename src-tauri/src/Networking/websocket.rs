use tokio_tungstenite::connect_async;

pub async fn connect() {

    let url = "wss://echo.websocket.events";

    let _ = connect_async(url).await;

    println!("Connected to websocket");
}
