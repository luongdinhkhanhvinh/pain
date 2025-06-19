-- Create tables if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert sample categories
INSERT INTO categories (id, name, slug, description, is_active) VALUES
  (uuid_generate_v4(), 'Vân Sồi', 'van-soi', 'Gỗ ép tường vân sồi tự nhiên', true),
  (uuid_generate_v4(), 'Vân Óc Chó', 'van-oc-cho', 'Gỗ ép tường vân óc chó cao cấp', true),
  (uuid_generate_v4(), 'Vân Teak', 'van-teak', 'Gỗ ép tường vân teak sang trọng', true),
  (uuid_generate_v4(), 'Vân Cherry', 'van-cherry', 'Gỗ ép tường vân cherry thanh lịch', true),
  (uuid_generate_v4(), 'Vân Ash', 'van-ash', 'Gỗ ép tường vân ash hiện đại', true);

-- Insert sample products
INSERT INTO products (
  id, name, description, price, original_price, discount, rating, review_count,
  category, colors, sizes, thickness, features, images, specifications, is_active
) VALUES
  (
    uuid_generate_v4(),
    'Gỗ Ép Tường Vân Sồi Trắng Premium',
    'Gỗ ép tường vân sồi trắng cao cấp với chất lượng vượt trội, mang đến vẻ đẹp tự nhiên và sang trọng cho không gian sống của bạn.',
    450000,
    520000,
    13,
    4.8,
    124,
    'Vân Sồi',
    '["Trắng", "Kem", "Trắng Ngà"]',
    '["122cm x 244cm", "100cm x 200cm", "80cm x 160cm"]',
    '["3mm", "5mm", "8mm"]',
    '["Chống ẩm", "Dễ lắp đặt", "Bền đẹp", "Thân thiện môi trường"]',
    '["/placeholder.svg?height=500&width=500"]',
    '{
      "material": "Gỗ MDF phủ veneer sồi tự nhiên",
      "origin": "Việt Nam",
      "warranty": "10 năm",
      "fireResistant": "Cấp B1",
      "moistureResistant": "95%",
      "installation": "Dán hoặc ốc vít"
    }',
    true
  ),
  (
    uuid_generate_v4(),
    'Gỗ Ép Tường Vân Óc Chó Cao Cấp',
    'Vân gỗ óc chó sang trọng, màu nâu đậm tạo không gian ấm cúng và đẳng cấp.',
    520000,
    580000,
    10,
    4.9,
    89,
    'Vân Óc Chó',
    '["Nâu đậm", "Nâu vàng"]',
    '["122cm x 244cm", "100cm x 200cm"]',
    '["5mm", "8mm"]',
    '["Cao cấp", "Chống mối mọt", "Vân đẹp"]',
    '["/placeholder.svg?height=500&width=500"]',
    '{
      "material": "Gỗ MDF phủ veneer óc chó tự nhiên",
      "origin": "Việt Nam",
      "warranty": "10 năm",
      "fireResistant": "Cấp B1",
      "moistureResistant": "95%",
      "installation": "Dán hoặc ốc vít"
    }',
    true
  );

-- Insert sample blog posts
INSERT INTO blog_posts (
  id, title, slug, excerpt, content, featured_image, author, category, tags, is_published, published_at
) VALUES
  (
    uuid_generate_v4(),
    'Xu hướng thiết kế nội thất 2024 với gỗ ép tường',
    'xu-huong-thiet-ke-noi-that-2024-voi-go-ep-tuong',
    'Khám phá những xu hướng thiết kế nội thất mới nhất năm 2024 sử dụng gỗ ép tường để tạo không gian sống hiện đại và sang trọng.',
    'Trong năm 2024, gỗ ép tường đang trở thành xu hướng hot trong thiết kế nội thất...',
    '/placeholder.svg?height=400&width=600',
    'Nguyễn Văn A',
    'Xu hướng thiết kế',
    '["thiết kế", "nội thất", "xu hướng 2024"]',
    true,
    NOW()
  ),
  (
    uuid_generate_v4(),
    'Hướng dẫn lắp đặt gỗ ép tường đúng kỹ thuật',
    'huong-dan-lap-dat-go-ep-tuong-dung-ky-thuat',
    'Hướng dẫn chi tiết từng bước lắp đặt gỗ ép tường một cách chuyên nghiệp và hiệu quả nhất.',
    'Lắp đặt gỗ ép tường đúng kỹ thuật là yếu tố quan trọng quyết định độ bền và thẩm mỹ...',
    '/placeholder.svg?height=400&width=600',
    'Trần Thị B',
    'Hướng dẫn lắp đặt',
    '["lắp đặt", "kỹ thuật", "hướng dẫn"]',
    true,
    NOW()
  );

-- Insert sample contacts
INSERT INTO contacts (id, name, phone, email, address, product, message, status) VALUES
  (
    uuid_generate_v4(),
    'Nguyễn Văn A',
    '0123456789',
    'nguyenvana@email.com',
    '123 Đường ABC, Quận 1, TP.HCM',
    'Gỗ Ép Tường Vân Sồi Trắng',
    'Tôi muốn tư vấn về sản phẩm này cho phòng khách 30m2',
    'new'
  ),
  (
    uuid_generate_v4(),
    'Trần Thị B',
    '0987654321',
    'tranthib@email.com',
    '456 Đường XYZ, Quận 3, TP.HCM',
    'Gỗ Ép Tường Vân Óc Chó',
    'Cần báo giá cho căn hộ 80m2, muốn xem mẫu trực tiếp',
    'contacted'
  );
