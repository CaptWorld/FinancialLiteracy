-- Wrong-password counter for the sign-in page (per IP, or per /64 for IPv6). Holds no passwords.
CREATE TABLE login_attempts (
  ip TEXT PRIMARY KEY,
  fails INTEGER NOT NULL,
  window_start INTEGER NOT NULL,
  locked_until INTEGER NOT NULL DEFAULT 0
);
