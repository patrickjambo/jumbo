# Jumbo App — Recording Architecture & Server-Side Egress Evaluation (Spec §6.4)

> Prepared for Jumbo App Owner · October 29, 2026

---

## 1. Executive Summary

Jumbo App implements a **two-tier recording architecture**:
1. **Tier 1 (Client-Side, Implemented & Ready)**: The meeting host can trigger recording with one click from the meeting control bar. A `MediaRecorder` stream mixes canvas composite video and audio, downloading an instant `.webm` file locally upon completion without server cost.
2. **Tier 2 (Server-Side Egress, Cloud Evaluation)**: Headless recording of the entire meeting room directly into an `.mp4` file and automatic upload to Cloudflare R2 / Supabase Storage with expiring signed download URLs.

Per **Rule 1 (No Docker anywhere)**, this document provides the required evaluation of the two non-Docker hosting options for server-side egress.

---

## 2. Server-Side Egress Evaluation

| Feature / Metric | Option A: LiveKit Cloud Egress (Managed) | Option B: Native Server Egress (Bare-Metal/VPS) |
|---|---|---|
| **Docker Requirement** | ❌ None (100% managed service) | ❌ None (Native Linux binary + native Chromium + native FFmpeg) |
| **Complexity** | 🟢 Minimal (API call via `livekit-server-sdk`) | 🟡 Moderate (Requires native Chromium, FFmpeg, Pulseaudio/ALSA, systemd) |
| **Free Tier / Cost** | Free tier includes egress minutes; beyond free tier, pay-as-you-go per minute (~$0.015/min) | Server CPU/RAM cost only (requires at least 4 vCPUs + 8GB RAM for 1080p composite) |
| **Mobile Reliability** | 🟢 100% server-side, runs even if mobile host disconnects | 🟢 100% server-side |
| **Output Format** | High-compatibility `.mp4` (H.264 + AAC) | High-compatibility `.mp4` |
| **Cloud Storage** | Direct upload to Cloudflare R2 / AWS S3 / Supabase | Direct upload or local storage |
| **Recommendation** | ⭐️ **RECOMMENDED for Launch** | **RECOMMENDED when scaling > 500 hrs/mo** |

---

## 3. Recommended Approach: LiveKit Cloud Egress

### Why Option A is Best at Launch:
1. **Zero Docker**: Zero infrastructure overhead. Runs completely through the LiveKit API SDK already installed (`livekit-server-sdk`).
2. **Resource Independence**: Video composition requires substantial CPU/GPU rendering (running a headless browser and encoding H.264 in real time). Running this on cheap application servers causes video lag and degrades call quality.
3. **Storage Pipeline**: LiveKit Cloud natively streams encoded MP4 segments directly into Cloudflare R2 (10 GB free forever, zero egress bandwidth fees).

### Implementation Architecture:
```
Host clicks "Record" in Meeting
      │
      ▼
POST /api/recording/start
      │
      ▼
Jumbo API initiates RoomCompositeEgress via livekit-server-sdk
      │
      ▼
Egress engine renders layout and streams MP4 directly to Cloudflare R2
      │
      ▼
When stopped: POST /api/recording/stop
Expiring signed URL generated for host download
```

---

## 4. Native Linux Server Alternative (Option B Guide)

If self-hosting egress without Docker on an Ubuntu/Debian server:
1. **Native Dependencies**:
   ```bash
   sudo apt-get install -y ffmpeg chromium-browser xvfb pulseaudio
   ```
2. **LiveKit Egress Binary**:
   Download the native Linux AMD64/ARM64 binary from [LiveKit Egress Releases](https://github.com/livekit/egress/releases).
3. **systemd Service**:
   Create `/etc/systemd/system/livekit-egress.service` running the native binary with an `egress.yaml` configuration file pointing to your LiveKit URL and Cloudflare R2 credentials.

---

## 5. Storage & Privacy Compliance (§6.4, §10)

- **Consent Notice**: In-call banner "🔴 Recording in progress" is displayed to all participants upon activation.
- **Audible Notification**: LiveKit audio chime plays when recording begins.
- **Expiring Links**: Recorded files in Cloudflare R2 / Supabase Storage use pre-signed URLs expiring after 24 hours.
- **Host Deletion**: Host can delete recording anytime via the dashboard.
