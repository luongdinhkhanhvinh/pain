-- Add content field for rich product content
ALTER TABLE "products" ADD COLUMN "content" text;

-- Add variations field with pricing support
ALTER TABLE "products" ADD COLUMN "variations" jsonb NOT NULL DEFAULT '{"colors": [], "sizes": [], "thickness": []}';

-- Update existing products to have proper variations structure
UPDATE "products" SET "variations" = jsonb_build_object(
  'colors', (
    SELECT jsonb_agg(jsonb_build_object('name', color_name, 'price', 0, 'isDefault', false))
    FROM jsonb_array_elements_text("colors") AS color_name
  ),
  'sizes', (
    SELECT jsonb_agg(jsonb_build_object('name', size_name, 'price', 0, 'isDefault', false))
    FROM jsonb_array_elements_text("sizes") AS size_name
  ),
  'thickness', (
    SELECT jsonb_agg(jsonb_build_object('name', thickness_name, 'price', 0, 'isDefault', false))
    FROM jsonb_array_elements_text("thickness") AS thickness_name
  )
) WHERE "variations" = '{"colors": [], "sizes": [], "thickness": []}';

-- Set first variation as default for existing products
UPDATE "products" SET "variations" = jsonb_set(
  jsonb_set(
    jsonb_set(
      "variations",
      '{colors,0,isDefault}',
      'true'
    ),
    '{sizes,0,isDefault}',
    'true'
  ),
  '{thickness,0,isDefault}',
  'true'
) WHERE jsonb_array_length("variations"->'colors') > 0 
   AND jsonb_array_length("variations"->'sizes') > 0 
   AND jsonb_array_length("variations"->'thickness') > 0;
