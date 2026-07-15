-- Run this in the Supabase SQL Editor

CREATE TABLE items (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  craftable BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE recipes (
  id BIGSERIAL PRIMARY KEY,
  output_item_id BIGINT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  output_quantity NUMERIC NOT NULL CHECK (output_quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE recipe_ingredients (
  id BIGSERIAL PRIMARY KEY,
  recipe_id BIGINT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_item_id BIGINT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_recipes_output_item ON recipes(output_item_id);
CREATE INDEX idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ingredients_ingredient ON recipe_ingredients(ingredient_item_id);

-- Seed data
INSERT INTO items (name, craftable) VALUES
  ('Wood', false),
  ('Stone', false),
  ('Palladium Fragment', false),
  ('Wool', false),
  ('Cloth', true);

INSERT INTO recipes (output_item_id, output_quantity)
VALUES ((SELECT id FROM items WHERE name = 'Cloth'), 1);

INSERT INTO recipe_ingredients (recipe_id, ingredient_item_id, quantity)
VALUES (
  (SELECT id FROM recipes WHERE output_item_id = (SELECT id FROM items WHERE name = 'Cloth')),
  (SELECT id FROM items WHERE name = 'Wool'),
  2
);
