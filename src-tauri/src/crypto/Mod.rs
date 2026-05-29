use ed25519_dalek::{SigningKey, VerifyingKey};
use rand::rngs::OsRng;

pub fn generate_identity() {
    let mut csprng = OsRng {};
    let signing_key: SigningKey = SigningKey::generate(&mut csprng);

    let verifying_key: VerifyingKey = signing_key.verifying_key();

    println!("Public Key: {:?}", verifying_key);
}
