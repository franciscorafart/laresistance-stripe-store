ALTER TABLE products
ADD COLUMN s3_file_name VARCHAR(255) NOT NULL DEFAULT 'test_file.png';

-- Change value of 1ist product
UPDATE products SET s3_file_name='My Product Name.pdf.zip' where id=1;