-- AlterTable
CREATE SEQUENCE product_orders_id_seq;
ALTER TABLE "product_orders" ALTER COLUMN "id" SET DEFAULT nextval('product_orders_id_seq');
ALTER SEQUENCE product_orders_id_seq OWNED BY "product_orders"."id";
