import { createHash } from "crypto";
import bcrypt from "bcryptjs";

// SHA-256 hex digest → depois bcrypt por cima (dupla camada)
export function hashPassword(password: string): string {
    const hex = createHash("sha256").update(password).digest("hex");
    return bcrypt.hashSync(hex, 12);
}

export function verifyPassword(password: string, hash: string): boolean {
    const hex = createHash("sha256").update(password).digest("hex");
    return bcrypt.compareSync(hex, hash);
}