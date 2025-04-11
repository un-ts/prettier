CREATE DOMAIN "public"."address_postal_code" AS text NOT NULL CONSTRAINT "br_postal_code_check" CHECK ((VALUE ~ '^\d{5}$'::text) OR (VALUE ~ '^\d{8}$'::text));
