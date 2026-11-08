import { io } from "socket.io-client";

// Normalize URL (strip trailing slash)
function sanitizeUrl(url) {
  if (!url) return "";
  return url.replace(/\/+$/, "");
}

export function getBackendUrl() {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
  if (envUrl) {
    return sanitizeUrl(envUrl);
  }

  // When accessed via phone/LAN on local network, use the same hostname on port 5000
  if (
    typeof window !== "undefined" &&
    window.location.hostname &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }

  return "http://localhost:5000";
}

export function getSocketUrl() {
  const socketEnvUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (socketEnvUrl) {
    return sanitizeUrl(socketEnvUrl);
  }
  return getBackendUrl();
}

let socket = null;

// Get or initialize singleton Socket.IO connection
export function getSocket() {
  const socketUrl = getSocketUrl();
  if (!socket) {
    socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to Pune Travel Hunt socket:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔴 Disconnected from socket:", reason);
    });
  }
  return socket;
}

// Helper to make API requests with optional token and timeout
async function apiRequest(endpoint, method = "GET", data = null, token = null) {
  const headers = {
    "Content-Type": "application/json"
  };

  const authToken =
    token ||
    (typeof window !== "undefined"
      ? localStorage.getItem("pune_hunt_token")
      : null);

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const options = {
    method,
    headers
  };

  if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
    options.body = JSON.stringify(data);
  }

  const backendUrl = getBackendUrl();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    options.signal = controller.signal;

    const res = await fetch(`${backendUrl}${endpoint}`, options);
    clearTimeout(timeoutId);
    const result = await res.json();
    return result;
  } catch (error) {
    console.warn(`API request error on ${endpoint}:`, error.message);
    return { success: false, message: error.message };
  }
}

// Authentication API
export const authAPI = {
  register: (payload) => apiRequest("/api/auth/register", "POST", payload),
  login: (payload) => apiRequest("/api/auth/login", "POST", payload),
  getMe: (token) => apiRequest("/api/auth/me", "GET", null, token)
};

// Rooms / Challenge API
export const roomsAPI = {
  create: (payload) => apiRequest("/api/rooms/create", "POST", payload),
  join: (payload) => apiRequest("/api/rooms/join", "POST", payload),
  get: (roomCode) => apiRequest(`/api/rooms/${roomCode}`, "GET"),
  abandon: (roomCode) => apiRequest(`/api/rooms/${roomCode}/abandon`, "POST")
};

// Games / Stats API
export const gamesAPI = {
  getHistory: () => apiRequest("/api/games/history", "GET"),
  getLeaderboard: () => apiRequest("/api/games/leaderboard", "GET")
};
