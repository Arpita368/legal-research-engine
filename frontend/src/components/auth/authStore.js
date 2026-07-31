// This helper keeps the authentication flow browser-based while using JWT tokens for the active session.
const USERS_KEY = "legal-research-users";
const SESSION_KEY = "legal-research-session";
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "legal-research-engine-secret";

function readStorage(key, fallback = null) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function encodeBase64Url(value) {
  const binary = typeof value === "string" ? new TextEncoder().encode(value) : value;
  let output = "";

  binary.forEach((byte) => {
    output += String.fromCharCode(byte);
  });

  return btoa(output).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const decoded = atob(padded);

  return Uint8Array.from(decoded, (char) => char.charCodeAt(0));
}

function buildJwtPayload(user) {
  return {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  };
}

async function createSignedJwt(payload) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = encodeBase64Url(JSON.stringify(header));
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signingInput));
  return `${signingInput}.${encodeBase64Url(new Uint8Array(signature))}`;
}

export function getStoredUsers() {
  return readStorage(USERS_KEY, []);
}

export function setStoredUsers(users) {
  writeStorage(USERS_KEY, users);
}

export function getStoredSession() {
  return readStorage(SESSION_KEY, null);
}

export function saveStoredSession(session) {
  writeStorage(SESSION_KEY, session);
}

export function clearStoredSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}

export async function signUpUser({ name, email, password, role }) {
  const users = getStoredUsers();
  const existing = users.find((user) => user.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const user = {
    id: `${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    role,
  };

  const token = await createSignedJwt(buildJwtPayload(user));
  const session = {
    token,
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  users.push(user);
  setStoredUsers(users);
  saveStoredSession(session);

  return { ok: true, user, token };
}

export async function loginUser({ email, password }) {
  const users = getStoredUsers();
  const user = users.find(
    (candidate) =>
      candidate.email.toLowerCase() === email.trim().toLowerCase() && candidate.password === password,
  );

  if (!user) {
    return { ok: false, error: "Email or password is incorrect." };
  }

  const token = await createSignedJwt(buildJwtPayload(user));
  const session = {
    token,
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  saveStoredSession(session);
  return { ok: true, user, token };
}

export async function createDemoSession(user) {
  const token = await createSignedJwt(buildJwtPayload(user));
  const session = {
    token,
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  saveStoredSession(session);
  return { ok: true, user, token };
}

export function logoutUser() {
  clearStoredSession();
  return { ok: true };
}
