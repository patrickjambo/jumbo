import type { Server, Socket } from 'socket.io';

export interface MeetingParticipant {
  socketId: string;
  participantId: string;
  participantName: string;
  isHost: boolean;
  isMicOn: boolean;
  isCamOn: boolean;
  isHandRaised: boolean;
  isScreenSharing: boolean;
  joinedAt: number;
  lastSeen: number;
}

// ─── Room state ───────────────────────────────────────────────────────────────
// roomCode → Map<socketId, MeetingParticipant>
const meetingRooms = new Map<string, Map<string, MeetingParticipant>>();
// socketId → roomCode (for quick disconnect lookup)
const socketToRoom = new Map<string, string>();
// participantId → socketId (for deduplication; latest socket wins)
const participantToSocket = new Map<string, string>();
// roomCode → Set<participantId> that is screen sharing (prevents duplicates)
const roomScreenSharers = new Map<string, Set<string>>();
// host tracking: roomCode → participantId of the host
const roomHosts = new Map<string, string>();
// removed/banned participants: roomCode → Set<participantId>
const roomBannedParticipants = new Map<string, Set<string>>();

// ─── Rate limiting helpers ────────────────────────────────────────────────────
const eventCounts = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(key: string, maxPerMinute = 60): boolean {
  const now = Date.now();
  const entry = eventCounts.get(key);
  if (!entry || now > entry.resetAt) {
    eventCounts.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > maxPerMinute;
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function getRoomParticipantsArray(room: Map<string, MeetingParticipant>): MeetingParticipant[] {
  return Array.from(room.values());
}

function cleanupSocket(io: Server, socketId: string, suppressPeerLeft = false) {
  const roomCode = socketToRoom.get(socketId);
  if (!roomCode) return;

  socketToRoom.delete(socketId);

  const room = meetingRooms.get(roomCode);
  if (!room) return;

  const p = room.get(socketId);
  if (!p) return;

  // Remove from participantId → socketId map only if THIS socket is the current one
  const currentSocketId = participantToSocket.get(p.participantId);
  if (currentSocketId === socketId) {
    participantToSocket.delete(p.participantId);
  }

  // Remove from screen-sharers set
  const sharers = roomScreenSharers.get(roomCode);
  if (sharers) {
    sharers.delete(p.participantId);
    if (sharers.size === 0) roomScreenSharers.delete(roomCode);
  }

  room.delete(socketId);

  if (room.size === 0) {
    meetingRooms.delete(roomCode);
    roomScreenSharers.delete(roomCode);
    roomHosts.delete(roomCode);
    roomBannedParticipants.delete(roomCode);
  } else if (!suppressPeerLeft) {
    io.to(`meeting:${roomCode}`).emit('meeting:peer-left', {
      socketId,
      participantId: p.participantId,
    });
  }
}

export function registerMeetingHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {

    // ── JOIN ─────────────────────────────────────────────────────────────────
    socket.on('meeting:join', (payload: {
      roomCode: string;
      participantName: string;
      participantId: string;
      isHost?: boolean;
      isMicOn?: boolean;
      isCamOn?: boolean;
    }) => {
      if (isRateLimited(`join:${socket.id}`, 5)) return; // max 5 joins/min per socket

      const {
        roomCode,
        participantName,
        participantId,
        isHost = false,
        isMicOn = true,
        isCamOn = true,
      } = payload;

      if (!roomCode || !participantName || !participantId) return;
      if (roomCode.length > 32 || participantName.length > 64) return;

      // Check if participant was removed/banned by host
      if (roomBannedParticipants.get(roomCode)?.has(participantId)) {
        socket.emit('meeting:host-action', {
          action: 'host_remove',
          targetSocketId: socket.id,
          targetParticipantId: participantId,
          reason: 'You were removed from this meeting by the host.',
        });
        return;
      }

      const roomKey = `meeting:${roomCode}`;
      void socket.join(roomKey);
      socketToRoom.set(socket.id, roomCode);

      if (!meetingRooms.has(roomCode)) {
        meetingRooms.set(roomCode, new Map());
      }
      const room = meetingRooms.get(roomCode)!;

      // ── Deduplication: evict previous socket for same participantId ─────────
      const prevSocketId = participantToSocket.get(participantId);
      if (prevSocketId && prevSocketId !== socket.id && room.has(prevSocketId)) {
        // Tell the old connection it was replaced (e.g. rejoined from another tab)
        io.to(prevSocketId).emit('meeting:replaced', {
          reason: 'You joined from another session. This tab has been disconnected.',
        });
        // Clean up old socket entry without broadcasting peer-left (we'll send updated state below)
        room.delete(prevSocketId);
        socketToRoom.delete(prevSocketId);
        // Disconnect the old socket gracefully
        const oldSocket = io.sockets.sockets.get(prevSocketId);
        if (oldSocket) {
          oldSocket.leave(roomKey);
          oldSocket.disconnect(true);
        }
        // Notify peers that this participant reconnected (not left + joined)
        io.to(roomKey).emit('meeting:peer-reconnected', { participantId, socketId: socket.id });
      }

      participantToSocket.set(participantId, socket.id);

      // ── Host assignment ────────────────────────────────────────────────────
      // First joiner is always host if no host exists. Subsequent joiners can only
      // claim host if no current host is present in the room.
      const currentHostId = roomHosts.get(roomCode);
      const currentHostPresent = currentHostId
        ? Array.from(room.values()).some((p) => p.participantId === currentHostId)
        : false;
      const resolvedIsHost = isHost && (!currentHostPresent);
      if (resolvedIsHost) {
        roomHosts.set(roomCode, participantId);
      } else if (!currentHostId && room.size === 0) {
        // Very first person always becomes host
        roomHosts.set(roomCode, participantId);
      }

      // Get existing peers BEFORE adding new participant
      const existingPeers = getRoomParticipantsArray(room);

      const newParticipant: MeetingParticipant = {
        socketId: socket.id,
        participantId,
        participantName: participantName.trim(),
        isHost: roomHosts.get(roomCode) === participantId,
        isMicOn,
        isCamOn,
        isHandRaised: false,
        isScreenSharing: false,
        joinedAt: Date.now(),
        lastSeen: Date.now(),
      };

      room.set(socket.id, newParticipant);

      // Send existing peers (+ current room state) to the joiner
      socket.emit('meeting:peers', {
        peers: existingPeers,
        self: newParticipant,
      });

      // Notify existing peers about the newcomer
      socket.to(roomKey).emit('meeting:peer-joined', newParticipant);
    });

    // ── WebRTC SIGNALING RELAY ────────────────────────────────────────────────
    socket.on('meeting:signal', (payload: {
      toSocketId: string;
      signal: unknown;
    }) => {
      if (isRateLimited(`signal:${socket.id}`, 300)) return; // 300 signals/min is plenty
      const { toSocketId, signal } = payload;
      if (!toSocketId || !signal) return;
      // Only relay if both sockets are in the same room
      const myRoom = socketToRoom.get(socket.id);
      const theirRoom = socketToRoom.get(toSocketId);
      if (!myRoom || myRoom !== theirRoom) return;

      io.to(toSocketId).emit('meeting:signal', {
        fromSocketId: socket.id,
        signal,
      });
    });

    // ── MEDIA STATE (mic / cam / screen share) ────────────────────────────────
    socket.on('meeting:media-state', (payload: {
      roomCode: string;
      isMicOn?: boolean;
      isCamOn?: boolean;
      isScreenSharing?: boolean;
    }) => {
      if (isRateLimited(`media:${socket.id}`, 60)) return;
      const { roomCode, isMicOn, isCamOn, isScreenSharing } = payload;
      const room = meetingRooms.get(roomCode);
      if (!room) return;

      const p = room.get(socket.id);
      if (!p) return;

      if (typeof isMicOn === 'boolean') p.isMicOn = isMicOn;
      if (typeof isCamOn === 'boolean') p.isCamOn = isCamOn;

      // Screen-share deduplication: one sharer per participant
      if (typeof isScreenSharing === 'boolean') {
        if (!roomScreenSharers.has(roomCode)) {
          roomScreenSharers.set(roomCode, new Set());
        }
        const sharers = roomScreenSharers.get(roomCode)!;
        if (isScreenSharing) {
          sharers.add(p.participantId);
        } else {
          sharers.delete(p.participantId);
        }
        p.isScreenSharing = isScreenSharing;
      }

      p.lastSeen = Date.now();

      socket.to(`meeting:${roomCode}`).emit('meeting:media-state', {
        socketId: socket.id,
        participantId: p.participantId,
        isMicOn: p.isMicOn,
        isCamOn: p.isCamOn,
        isScreenSharing: p.isScreenSharing,
      });
    });

    // ── RAISE / LOWER HAND ────────────────────────────────────────────────────
    socket.on('meeting:raise-hand', (payload: {
      roomCode: string;
      raised: boolean;
    }) => {
      if (isRateLimited(`hand:${socket.id}`, 20)) return;
      const { roomCode, raised } = payload;
      const room = meetingRooms.get(roomCode);
      const p = room?.get(socket.id);
      if (p) p.isHandRaised = raised;

      io.to(`meeting:${roomCode}`).emit('meeting:raise-hand', {
        socketId: socket.id,
        participantId: p?.participantId ?? socket.id,
        participantName: p?.participantName ?? 'Participant',
        raised,
      });
    });

    // ── IN-CALL CHAT ──────────────────────────────────────────────────────────
    socket.on('meeting:chat', (payload: {
      roomCode: string;
      message: {
        id: string;
        senderName: string;
        senderId: string;
        text: string;
        ts: number;
      };
    }) => {
      if (isRateLimited(`chat:${socket.id}`, 30)) return;
      const { roomCode, message } = payload;
      if (!roomCode || !message?.text) return;
      if (message.text.length > 2000) return;
      // Stamp the server time to prevent clock skew issues
      message.ts = Date.now();
      // Use socket.to() (excludes sender) — the sender already has an optimistic copy.
      // This eliminates the echo-back that caused duplicate messages.
      socket.to(`meeting:${roomCode}`).emit('meeting:chat', message);
    });

    // ── CHAT EDIT (sender only) ───────────────────────────────────────────────
    socket.on('meeting:chat-edit', (payload: {
      roomCode: string;
      messageId: string;
      newText: string;
      senderId: string;
    }) => {
      if (isRateLimited(`chat:${socket.id}`, 30)) return;
      const { roomCode, messageId, newText, senderId } = payload;
      if (!roomCode || !messageId || !newText?.trim()) return;
      if (newText.length > 2000) return;
      // Broadcast the edit to all other participants (sender already updated locally)
      socket.to(`meeting:${roomCode}`).emit('meeting:chat-edit', {
        messageId,
        newText: newText.trim(),
        senderId,
        editedAt: Date.now(),
      });
    });

    // ── CHAT DELETE (sender only) ─────────────────────────────────────────────
    socket.on('meeting:chat-delete', (payload: {
      roomCode: string;
      messageId: string;
      senderId: string;
    }) => {
      if (isRateLimited(`chat:${socket.id}`, 30)) return;
      const { roomCode, messageId, senderId } = payload;
      if (!roomCode || !messageId) return;
      // Broadcast the deletion to all other participants
      socket.to(`meeting:${roomCode}`).emit('meeting:chat-delete', {
        messageId,
        senderId,
        deletedAt: Date.now(),
      });
    });

    // ── CHAT REACTION ─────────────────────────────────────────────────────────
    socket.on('meeting:chat-reaction', (payload: {
      roomCode: string;
      messageId: string;
      emoji: string;
      senderId: string;
      senderName: string;
    }) => {
      if (isRateLimited(`chat-reaction:${socket.id}`, 60)) return;
      const { roomCode, messageId, emoji, senderId, senderName } = payload;
      if (!roomCode || !messageId || !emoji) return;
      if (emoji.length > 32) return;
      socket.to(`meeting:${roomCode}`).emit('meeting:chat-reaction', {
        messageId,
        emoji,
        senderId,
        senderName,
        ts: Date.now(),
      });
    });

    // ── MEETING EMOJI REACTION (floating reactions) ───────────────────────────
    socket.on('meeting:reaction', (payload: {
      roomCode: string;
      reaction: {
        id: string;
        emoji: string;
        senderId: string;
        senderName: string;
        ts: number;
      };
    }) => {
      if (isRateLimited(`reaction:${socket.id}`, 60)) return;
      const { roomCode, reaction } = payload;
      if (!roomCode || !reaction?.emoji) return;
      if (reaction.emoji.length > 32) return;
      reaction.ts = Date.now();
      socket.to(`meeting:${roomCode}`).emit('meeting:reaction', reaction);
    });

    // ── DATA (quiz invites, custom payloads) ──────────────────────────────────
    socket.on('meeting:data', (payload: { roomCode: string; data: number[] }) => {
      if (isRateLimited(`data:${socket.id}`, 10)) return;
      const { roomCode, data } = payload;
      if (!roomCode || !Array.isArray(data) || data.length > 65536) return;
      // Relay to all in room (including sender — quiz host receives own invite to confirm)
      socket.to(`meeting:${roomCode}`).emit('meeting:data', { roomCode, data });
    });

    // ── HOST ACTIONS ──────────────────────────────────────────────────────────
    socket.on('meeting:host-action', (payload: {
      roomCode: string;
      action: 'host_mute' | 'host_unmute' | 'host_ask_unmute' | 'host_mute_all' | 'host_remove' | 'host_remove_all' | 'room_lock_changed' | 'meeting_ended';
      targetSocketId?: string;
      targetParticipantId?: string;
      locked?: boolean;
    }) => {
      if (isRateLimited(`hostaction:${socket.id}`, 30)) return;
      const { roomCode, action, targetSocketId, targetParticipantId, locked } = payload;

      // Verify the sender is actually the host
      const room = meetingRooms.get(roomCode);
      const sender = room?.get(socket.id);
      const hostId = roomHosts.get(roomCode);

      if (!room || !sender || sender.participantId !== hostId) {
        // Not the host — silently ignore
        return;
      }

      if (action === 'host_mute_all') {
        // Update all participants' mic state in the room on server
        for (const p of room.values()) {
          if (p.participantId !== sender.participantId) {
            p.isMicOn = false;
          }
        }
        io.to(`meeting:${roomCode}`).emit('meeting:host-action', {
          action: 'host_mute_all',
          hostName: sender.participantName,
        });
        return;
      }

      if (action === 'host_mute' && targetParticipantId) {
        const targetSid = participantToSocket.get(targetParticipantId) ?? targetSocketId;
        if (targetSid) {
          const targetP = room.get(targetSid);
          if (targetP) targetP.isMicOn = false;
        }
        io.to(`meeting:${roomCode}`).emit('meeting:host-action', {
          action: 'host_mute',
          targetSocketId: targetSid,
          targetParticipantId,
          hostName: sender.participantName,
        });
        return;
      }

      if ((action === 'host_ask_unmute' || action === 'host_unmute') && targetParticipantId) {
        const targetSid = participantToSocket.get(targetParticipantId) ?? targetSocketId;
        io.to(`meeting:${roomCode}`).emit('meeting:host-action', {
          action: 'host_ask_unmute',
          targetSocketId: targetSid,
          targetParticipantId,
          hostName: sender.participantName,
        });
        return;
      }

      if (action === 'host_remove' && targetParticipantId) {
        // Find the target's current socket
        let targetSid = participantToSocket.get(targetParticipantId) ?? targetSocketId;
        if (!targetSid) {
          for (const [sid, p] of room.entries()) {
            if (p.participantId === targetParticipantId) {
              targetSid = sid;
              break;
            }
          }
        }

        // Add to banned participants for this room
        if (!roomBannedParticipants.has(roomCode)) {
          roomBannedParticipants.set(roomCode, new Set());
        }
        roomBannedParticipants.get(roomCode)!.add(targetParticipantId);

        if (targetSid) {
          const targetSocket = io.sockets.sockets.get(targetSid);

          // 1. Notify target directly
          targetSocket?.emit('meeting:host-action', {
            action: 'host_remove',
            targetSocketId: targetSid,
            targetParticipantId,
            hostName: sender.participantName,
          });

          // 2. Broadcast to room so other participants & host receive notification
          io.to(`meeting:${roomCode}`).emit('meeting:host-action', {
            action: 'host_remove',
            targetSocketId: targetSid,
            targetParticipantId,
            hostName: sender.participantName,
          });

          // 3. Target socket leaves room channel
          targetSocket?.leave(`meeting:${roomCode}`);

          // 4. Clean up target from room & broadcast meeting:peer-left to all peers!
          cleanupSocket(io, targetSid, false);

          // 5. Forcibly disconnect the target socket
          targetSocket?.disconnect(true);
        }
        return;
      }

      if (action === 'host_remove_all') {
        const nonHostSockets: Array<{ sid: string; pId: string }> = [];
        for (const [sid, p] of room.entries()) {
          if (p.participantId !== sender.participantId) {
            nonHostSockets.push({ sid, pId: p.participantId });
          }
        }

        if (!roomBannedParticipants.has(roomCode)) {
          roomBannedParticipants.set(roomCode, new Set());
        }
        const bannedSet = roomBannedParticipants.get(roomCode)!;

        for (const { sid, pId } of nonHostSockets) {
          bannedSet.add(pId);
          const targetSocket = io.sockets.sockets.get(sid);

          targetSocket?.emit('meeting:host-action', {
            action: 'host_remove',
            targetSocketId: sid,
            targetParticipantId: pId,
            hostName: sender.participantName,
          });

          targetSocket?.leave(`meeting:${roomCode}`);
          cleanupSocket(io, sid, false);
          targetSocket?.disconnect(true);
        }

        io.to(`meeting:${roomCode}`).emit('meeting:host-action', {
          action: 'host_remove_all',
          hostName: sender.participantName,
        });
        return;
      } else {
        io.to(`meeting:${roomCode}`).emit('meeting:host-action', {
          action,
          targetSocketId,
          targetParticipantId,
          locked,
        });
      }
    });

    // ── HEARTBEAT (keepalive) ─────────────────────────────────────────────────
    socket.on('meeting:ping', (payload: { roomCode: string }) => {
      const room = meetingRooms.get(payload?.roomCode);
      const p = room?.get(socket.id);
      if (p) p.lastSeen = Date.now();
      socket.emit('meeting:pong');
    });

    // ── ICE RESTART REQUEST ───────────────────────────────────────────────────
    socket.on('meeting:ice-restart', (payload: { toSocketId: string }) => {
      if (isRateLimited(`icerestart:${socket.id}`, 10)) return;
      const { toSocketId } = payload;
      const myRoom = socketToRoom.get(socket.id);
      const theirRoom = socketToRoom.get(toSocketId);
      if (!myRoom || myRoom !== theirRoom) return;
      io.to(toSocketId).emit('meeting:ice-restart', { fromSocketId: socket.id });
    });

    // ── DISCONNECT CLEANUP ────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      cleanupSocket(io, socket.id);
    });
  });

  // ── Periodic stale-entry sweep (every 5 minutes) ──────────────────────────
  setInterval(() => {
    const staleThreshold = Date.now() - 10 * 60 * 1000; // 10 minutes
    for (const [roomCode, room] of meetingRooms) {
      for (const [sid, p] of room) {
        if (p.lastSeen < staleThreshold && !io.sockets.sockets.has(sid)) {
          cleanupSocket(io, sid);
        }
      }
      if (room.size === 0) meetingRooms.delete(roomCode);
    }
  }, 5 * 60 * 1000);
}
