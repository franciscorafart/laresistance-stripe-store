CREATE TABLE products (
    ID SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(50) NOT NULL,
    description TEXT NULL,
    price DECIMAL NOT NULL,
    currency VARCHAR(3) NOT NULL,
    image_url VARCHAR(255) NULL
  );

  INSERT INTO products (title, slug, price, currency, description, image_url)
  VALUES  ('Product Title', 'pruduct-slug', 50.0, 'usd', 'Product description', 'product-image-sanity-url');