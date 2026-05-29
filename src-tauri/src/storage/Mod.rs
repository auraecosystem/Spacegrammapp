use rusqlite::{Connection, Result};

pub fn init() {
    let conn = Connection::open("spacegramm.db").unwrap();

    conn.execute(
        "
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY,
            content TEXT NOT NULL
        )
        ",
        [],
    )
    .unwrap();

    println!("Database initialized");
}
