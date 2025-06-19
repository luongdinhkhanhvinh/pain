-- Insert sample products data
INSERT INTO products (
  name, 
  description, 
  price, 
  category, 
  image_url, 
  is_active, 
  created_at, 
  updated_at
) VALUES 
(
  'Silklux Premium Collection',
  'Bộ sưu tập nội thất cao cấp với thiết kế sang trọng và chất liệu premium. Được chế tác từ gỗ tự nhiên cao cấp với kỹ thuật hoàn thiện tinh xảo.',
  2500000,
  'Premium',
  '/SILKLUX-01.png',
  true,
  NOW(),
  NOW()
),
(
  'Silklux Luxury Series',
  'Dòng sản phẩm luxury với chất liệu cao cấp nhất, thiết kế độc đáo. Mang đến không gian sống đẳng cấp và tinh tế.',
  3200000,
  'Luxury',
  '/SILKLUX-02.png',
  true,
  NOW(),
  NOW()
),
(
  'Silklux Elite Design',
  'Thiết kế elite cho không gian đẳng cấp, phù hợp với mọi phong cách nội thất. Sự kết hợp hoàn hảo giữa truyền thống và hiện đại.',
  1800000,
  'Elite',
  '/SILKLUX-03.png',
  true,
  NOW(),
  NOW()
),
(
  'Silklux Classic Collection',
  'Bộ sưu tập classic với phong cách truyền thống, thanh lịch. Mang đậm nét cổ điển Việt Nam với chất liệu gỗ quý hiếm.',
  1500000,
  'Classic',
  '/SILKLUX-04.png',
  true,
  NOW(),
  NOW()
),
(
  'Silklux Modern Style',
  'Phong cách hiện đại với đường nét tối giản, sang trọng. Thiết kế contemporary phù hợp với không gian sống hiện đại.',
  2200000,
  'Modern',
  '/SILKLUX-01.png',
  true,
  NOW(),
  NOW()
),
(
  'Silklux Vintage Collection',
  'Bộ sưu tập vintage với nét cổ điển, mang đậm dấu ấn thời gian. Được tái hiện từ những mẫu thiết kế kinh điển.',
  1900000,
  'Vintage',
  '/SILKLUX-02.png',
  true,
  NOW(),
  NOW()
),
(
  'Silklux Royal Series',
  'Dòng sản phẩm hoàng gia với thiết kế cung đình, chất liệu vàng và gỗ quý. Dành cho những không gian đặc biệt.',
  4500000,
  'Royal',
  '/SILKLUX-03.png',
  true,
  NOW(),
  NOW()
),
(
  'Silklux Minimalist',
  'Thiết kế tối giản với triết lý "less is more". Phù hợp với lối sống hiện đại, tập trung vào chức năng và thẩm mỹ.',
  1200000,
  'Minimalist',
  '/SILKLUX-04.png',
  true,
  NOW(),
  NOW()
);
