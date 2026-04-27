import { createHash, randomBytes, timingSafeEqual } from 'crypto';

export function hashPin(pin: string): string {
	const salt = randomBytes(16).toString('hex');
	const hash = createHash('sha256')
		.update(salt + pin)
		.digest('hex');
	return `${salt}:${hash}`;
}

export function verifyPin(pin: string, stored: string): boolean {
	const [salt, hash] = stored.split(':');
	if (!salt || !hash) return false;
	const candidate = createHash('sha256')
		.update(salt + pin)
		.digest('hex');
	try {
		return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(candidate, 'hex'));
	} catch {
		return false;
	}
}

export function createSessionToken(): string {
	return randomBytes(32).toString('hex');
}

const sessions = new Map<string, { memberId: number; expiresAt: number }>();
const adminSessions = new Set<string>();

export function createMemberSession(memberId: number): string {
	const token = createSessionToken();
	const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
	sessions.set(token, { memberId, expiresAt });
	return token;
}

export function getMemberSession(token: string): number | null {
	const session = sessions.get(token);
	if (!session) return null;
	if (Date.now() > session.expiresAt) {
		sessions.delete(token);
		return null;
	}
	return session.memberId;
}

export function deleteMemberSession(token: string): void {
	sessions.delete(token);
}

export function createAdminSession(): string {
	const token = createSessionToken();
	adminSessions.add(token);
	return token;
}

export function isAdminSession(token: string): boolean {
	return adminSessions.has(token);
}

export function deleteAdminSession(token: string): void {
	adminSessions.delete(token);
}
