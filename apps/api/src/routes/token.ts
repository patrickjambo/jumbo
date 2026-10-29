import type { FastifyPluginAsync } from 'fastify';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import { z } from 'zod';
import { env } from '../env.js';

const TokenRequestSchema = z.object({
  roomName: z.string().min(1).max(64),
  participantName: z.string().min(1).max(50),
  participantIdentity: z.string().min(1).max(64).optional(),
  canPublish: z.boolean().default(true),
  canSubscribe: z.boolean().default(true),
  canPublishData: z.boolean().default(true),
});

export const tokenRoutes: FastifyPluginAsync = async (fastify) => {
  /**
   * POST /api/token/room
   * Issues a short-lived LiveKit room token.
   * The API secret NEVER leaves the server.
   */
  fastify.post('/room', async (request, reply) => {
    const body = TokenRequestSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid request', details: body.error.format() });
    }

    const { roomName, participantName, participantIdentity, canPublish, canSubscribe, canPublishData } = body.data;

    const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
      identity: participantIdentity ?? participantName,
      name: participantName,
      ttl: '1h',
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish,
      canSubscribe,
      canPublishData,
    });

    const token = await at.toJwt();
    return reply.send({ token, livekitUrl: env.LIVEKIT_URL });
  });
};
