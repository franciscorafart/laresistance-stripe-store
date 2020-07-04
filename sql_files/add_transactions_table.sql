CREATE TABLE transactions (
    ID SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    product_id INTEGER REFERENCES products(id),
    token VARCHAR(255) NOT NULL,
    complete BOOLEAN DEFAULT FALSE 
  );