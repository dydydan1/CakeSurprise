CREATE TABLE IF NOT EXISTS greetings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  recipient_name VARCHAR(100) NOT NULL,
  sender_name VARCHAR(100) NULL,
  message TEXT NOT NULL,
  occasion VARCHAR(50) NOT NULL,
  theme VARCHAR(50) NOT NULL,
  status ENUM('draft', 'active', 'disabled', 'archived') NOT NULL DEFAULT 'draft',
  order_reference VARCHAR(80) NULL,
  created_by_admin_id BIGINT UNSIGNED NOT NULL,
  activated_at DATETIME NULL,
  archived_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY greetings_status_created_at_index (status, created_at),
  KEY greetings_recipient_name_index (recipient_name),
  KEY greetings_order_reference_index (order_reference),
  KEY greetings_created_by_admin_index (created_by_admin_id),
  CONSTRAINT greetings_created_by_admin_foreign
    FOREIGN KEY (created_by_admin_id) REFERENCES admins (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
