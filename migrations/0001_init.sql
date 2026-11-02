-- One flexible table for all synced personal state (cards, quiz log, snapshot, goals, notes, gaps, edits, settings).
-- Never store account numbers, PAN, Aadhaar or passwords here.
CREATE TABLE items (
  collection TEXT NOT NULL,
  id TEXT NOT NULL,
  data TEXT NOT NULL,
  updated INTEGER NOT NULL,
  deleted INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (collection, id)
);
CREATE INDEX idx_items_updated ON items(updated);

CREATE TABLE link_health (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  status INTEGER,
  ok INTEGER NOT NULL,
  note TEXT,
  checked_at INTEGER NOT NULL
);
