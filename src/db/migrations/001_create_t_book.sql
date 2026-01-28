-- Up Migration
CREATE TABLE IF NOT EXISTS t_book (
  id          BIGSERIAL     PRIMARY KEY,
  title       VARCHAR(255)  NOT NULL,
  author      VARCHAR(255)  NOT NULL,
  year        SMALLINT      NOT NULL,
  price       NUMERIC(10,2) NOT NULL,
  is_active   BOOLEAN       NOT NULL DEFAULT true,
  description TEXT              NULL,
  CONSTRAINT uk_book_title_author UNIQUE (title, author)
);

-- Indexes for performance
-- CREATE INDEX idx_book_title ON t_book(title);
-- CREATE INDEX idx_book_author ON t_book(author);
-- CREATE INDEX idx_book_year ON t_book(year);
-- CREATE INDEX idx_book_is_active ON t_book(is_active);
