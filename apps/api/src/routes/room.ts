import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { RoomSettingsSchema } from '@jumbo/shared';
import { generateRoomCode } from '../lib/room-code.js';

const CreateRoomSchema = z.object({
  settings: RoomSettingsSchema.optional(),
});

export const roomRoutes: FastifyPluginAsync = async (fastify) => {
  /**
   * POST /api/rooms
   * Creates a new meeting room and returns the join code.
   */
  fastify.post('/', async (request, reply) => {
    const body = CreateRoomSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid request', details: body.error.format() });
    }

    const code = generateRoomCode();
    // In Phase 1, we'll persist this to Supabase.
    // For now, return the code so the frontend can build a join link.
    return reply.status(201).send({
      code,
      joinUrl: `${process.env['VITE_API_URL'] ?? ''}/join/${code}`,
      settings: body.data.settings,
    });
  });

  /**
   * GET /api/rooms/:code
   * Returns basic room info (exists check).
   */
  fastify.get('/:code', async (request, reply) => {
    const { code } = request.params as { code: string };
    if (!code || code.length !== 6) {
      return reply.status(400).send({ error: 'Invalid room code' });
    }
    // Phase 1: look up in Supabase
    return reply.send({ code, exists: true });
  });
};
