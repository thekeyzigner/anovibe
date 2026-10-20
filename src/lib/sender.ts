import { createHash } from "crypto";
export const senderHash = (ip: string, device: string) =>
  createHash("sha256").update(`${process.env.SENDER_HASH_SALT}|${ip}|${device}`).digest("hex");
