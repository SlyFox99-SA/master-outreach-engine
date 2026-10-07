CREATE TABLE IF NOT EXISTS orders (
  brand TEXT NOT NULL,
  ref TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  PRIMARY KEY (brand, ref)
);
CREATE INDEX IF NOT EXISTS idx_orders_brand_created ON orders(brand, created_at DESC);