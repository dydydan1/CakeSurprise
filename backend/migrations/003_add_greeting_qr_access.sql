ALTER TABLE greetings
  ADD COLUMN public_token CHAR(43) NULL AFTER order_reference,
  ADD COLUMN qr_generated_at DATETIME NULL AFTER public_token,
  ADD UNIQUE KEY greetings_public_token_unique (public_token);
