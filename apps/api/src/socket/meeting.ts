import type { Server, Socket } from 'socket.io';

export interface MeetingParticipant {
  socketId: string;
  participantId: string;
  participantName: string;
  isHost: boolean;
  isMicOn: boolean;
  isCamOn: boolean;
  isHandRaised: boolean;
  joinedAt: number;
}

// In-memory room state: roomCode -> Map<socketId, MeetingParticipant>
const meetingRooms = new Map<string, Map<string, MeetingParticipant>>();
const socketToRoom = new Map<string, string>();

export function registerMeetingHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on('meeting:join', (payload: {
      roomCode: string;
      participantName: string;
      participantId: string;
      isHost?: boolean;
      isMicOn?: boolean;
      isCamOn?: boolean;
    }) => {
      const {
        roomCode,
        participantName,
        participantId,
        isHost = false,
        isMicOn = true,
        isCamOn = true,
      } = payload;

      if (!roomCode || !participantName) return;

      const roomKey = `meeting:${roomCode}`;
      void socket.join(roomKey);
      socketToRoom.set(socket.id, roomCode);

      if (!meetingRooms.has(roomCode)) {
        meetingRooms.set(roomCode, new Map());
      }
      const room = meetingRooms.get(roomCode)!;

      const newParticipant: MeetingParticipant = {
        socketId: socket.id,
        participantId: participantId || socket.id,
        participantName: participantName.trim(),
        isHost,
        isMicOn,
        isCamOn,
        isHandRaised: false,
        joinedAt: Date.now(),
      };

      // Get existing peers (excluding the current user)
      const existingPeers = Array.from(room.values());

      room.set(socket.id, newParticipant);

      // Send list of existing peers to the new participant
      socket.emit('meeting:peers', {
        peers: existingPeers,
        self: newParticipant,
      });

      // Notify others in room
      socket.to(roomKey).emit('meeting:peer-joined', newParticipant);
    });

    // WebRTC Signaling relay (offers, answers, ICE candidates)
    socket.on('meeting:signal', (payload: {
      toSocketId: string;
      signal: any;
    }) => {
      const { toSocketId, signal } = payload;
      if (!toSocketId || !signal) return;

      io.to(toSocketId).emit('meeting:signal', {
        fromSocketId: socket.id,
        signal,
      });
    });

    // Mic & Camera state changes
    socket.on('meeting:media-state', (payload: {
      roomCode: string;
      isMicOn?: boolean;
      isCamOn?: boolean;
    }) => {
      const { roomCode, isMicOn, isCamOn } = payload;
      const room = meetingRooms.get(roomCode);
      if (!room) return;

      const p = room.get(socket.id);
      if (p) {
        if (typeof isMicOn === 'boolean') p.isMicOn = isMicOn;
        if (typeof isCamOn === 'boolean') p.isCamOn = isCamOn;
      }

      socket.to(`meeting:${roomCode}`).emit('meeting:media-state', {
        socketId: socket.id,
        participantId: p?.participantId || socket.id,
        isMicOn: p?.isMicOn ?? isMicOn,
        isCamOn: p?.isCamOn ?? isCamOn,
      });
    });

    // Raise / Lower hand
    socket.on('meeting:raise-hand', (payload: {
      roomCode: string;
      raised: boolean;
    }) => {
      const { roomCode, raised } = payload;
      const room = meetingRooms.get(roomCode);
      const p = room?.get(socket.id);
      if (p) {
        p.isHandRaised = raised;
      }
      io.to(`meeting:${roomCode}`).emit('meeting:raise-hand', {
        socketId: socket.id,
        participantId: p?.participantId || socket.id,
        participantName: p?.participantName || 'Participant',
        raised,
      });
    });

    // In-call chat message
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
      const { roomCode, message } = payload;
      if (!roomCode || !message) return;
      io.to(`meeting:${roomCode}`).emit('meeting:chat', message);
    });

    // Host controls: mute participant, remove participant, lock room, end meeting
    socket.on('meeting:host-action', (payload: {
      roomCode: string;
      action: 'host_mute' | 'host_remove' | 'room_lock_changed' | 'meeting_ended';
      targetSocketId?: string;
      targetParticipantId?: string;
      locked?: boolean;
    }) => {
      const { roomCode, action, targetSocketId, targetParticipantId, locked } = payload;
      io.to(`meeting:${roomCode}`).emit('meeting:host-action', {
        action,
        targetSocketId,
        targetParticipantId,
        locked,
      });
    });

    // Disconnect cleanup
    socket.on('disconnect', () => {
      const roomCode = socketToRoom.get(socket.id);
      if (!roomCode) return;
      socketToRoom.delete(socket.id);

      const room = meetingRooms.get(roomCode);
      if (room) {
        const p = room.get(socket.id);
        room.delete(socket.id);
        if (room.size === 0) {
          meetingRooms.delete(roomCode);
        } else {
          io.to(`meeting:${roomCode}`).emit('meeting:peer-left', {
            socketId: socket.id,
            participantId: p?.participantId || socket.id,
          });
        }
      }
    });
  });
}
