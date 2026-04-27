import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, extname } from 'path';
import { randomBytes } from 'crypto';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

export async function saveUpload(file: File): Promise<string> {
	if (!existsSync(UPLOAD_DIR)) {
		await mkdir(UPLOAD_DIR, { recursive: true });
	}

	const ext = extname(file.name) || '.bin';
	const name = `${Date.now()}-${randomBytes(8).toString('hex')}${ext}`;
	const path = join(UPLOAD_DIR, name);
	const buffer = Buffer.from(await file.arrayBuffer());
	await writeFile(path, buffer);
	return name;
}

export function getUploadPath(filename: string): string {
	return join(UPLOAD_DIR, filename);
}
