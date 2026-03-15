import * as nacl from 'tweetnacl';

export interface KeyPair {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}

export async function generateKeyPair(): Promise<KeyPair> {
  const keyPair = nacl.sign.keyPair();
  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.secretKey,
  };
}

export function signMessage(message: Uint8Array, privateKey: Uint8Array): Uint8Array {
  return nacl.sign.detached(message, privateKey);
}

export function verifySignature(
  message: Uint8Array,
  signature: Uint8Array,
  publicKey: Uint8Array
): boolean {
  return nacl.sign.detached.verify(message, signature, publicKey);
}

export function encryptMessage(message: Uint8Array, recipientPublicKey: Uint8Array, senderPrivateKey: Uint8Array): Uint8Array {
  const nonce = nacl.randomBytes(24);
  const sharedKey = nacl.box.before(recipientPublicKey, senderPrivateKey);
  const encrypted = nacl.box.after(message, nonce, sharedKey);
  
  // Combine nonce + encrypted
  const result = new Uint8Array(nonce.length + encrypted.length);
  result.set(nonce);
  result.set(encrypted, nonce.length);
  
  return result;
}

export function decryptMessage(encryptedData: Uint8Array, senderPublicKey: Uint8Array, recipientPrivateKey: Uint8Array): Uint8Array | null {
  const nonce = encryptedData.slice(0, 24);
  const encrypted = encryptedData.slice(24);
  
  const sharedKey = nacl.box.before(senderPublicKey, recipientPrivateKey);
  return nacl.box.open.after(encrypted, nonce, sharedKey);
}
