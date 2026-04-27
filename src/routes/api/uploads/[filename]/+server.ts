import type { RequestHandler } from './$types.js';
import { getUploadPath } from '$lib/server/files.js';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { extname } from 'path';

const mimeTypes: Record<string, string> = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.gif': 'image/gif',
	'.webp': 'image/webp',
	'.pdf': 'application/pdf'
};

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.member && !locals.isAdmin) {
		return new Response('No autorizado', { status: 401 });
	}

	const filePath = getUploadPath(params.filename);

	if (!existsSync(filePath)) {
		return new Response('Archivo no encontrado', { status: 404 });
	}

	const ext = extname(params.filename).toLowerCase();
	const contentType = mimeTypes[ext] || 'application/octet-stream';
	const buffer = await readFile(filePath);

	return new Response(buffer, {
		headers: {
			'Content-Type': contentType,
			'Cache-Control': 'private, max-age=3600'
		}
	});
};
