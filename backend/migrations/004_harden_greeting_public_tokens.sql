ALTER TABLE greetings
  MODIFY COLUMN public_token CHAR(43)
    CHARACTER SET ascii
    COLLATE ascii_bin
    NULL;
