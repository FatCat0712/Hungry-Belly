SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `restaurants`;
DROP TABLE IF EXISTS `food_items`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `user_addresses`;
DROP TABLE IF EXISTS `carts`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `restaurant_images`;
DROP TABLE IF EXISTS `refresh_token`;
DROP TABLE IF EXISTS `food_item_categories`;
DROP TABLE IF EXISTS `food_images`;
DROP TABLE IF EXISTS `restaurant_users`;
DROP TABLE IF EXISTS `user_sessions`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `users` (
    `id` BIGINT NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `enabled` BOOLEAN NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role VARCHAR` INTEGER NOT NULL,
    `photo` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `roles` (
    `id` BIGINT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `user_roles` (
    `id BIGINT` INTEGER NOT NULL,
    `user_id` BIGINT NOT NULL,
    `role_id` BIGINT NOT NULL,
    PRIMARY KEY (`id BIGINT`, `user_id`, `role_id`)
);

CREATE TABLE `restaurants` (
    `id` BIGINT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `enabled` BOOLEAN NOT NULL,
    `rating` INTEGER NOT NULL,
    `cuisine` VARCHAR(255) NOT NULL,
    `address_line` VARCHAR(255) NOT NULL,
    `ward` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `min_prep_time` TINYINT NOT NULL,
    `max_prep_time` TINYINT NOT NULL,
    `latitude` DECIMAL(10,8) NOT NULL,
    `longtitude` DECIMAL(10,8) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `food_items` (
    `id` BIGINT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `price` DECIMAL(10,2) NOT NULL,
    `is_avaliable` BOOLEAN NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    `restaurant_id` BIGINT NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `categories` (
    `id` BIGINT NOT NULL,
    `enabled` BOOLEAN NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `alias` VARCHAR(255) NOT NULL,
    `parent` BIGINT NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `orders` (
    `id` BIGINT NOT NULL,
    `order_time` DATETIME NOT NULL,
    `shipping_cost` DECIMAL(10,2) NOT NULL,
    `food_cost` DECIMAL(10,2) NOT NULL,
    `tax` DECIMAL(10,2) NOT NULL,
    `total` DECIMAL(10,2) NOT NULL,
    `delivery_date` DATETIME NOT NULL,
    `order_status` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `user_id` BIGINT NOT NULL,
    `estimated_deliver_minutes` INTEGER NOT NULL,
    `receiver_name` VARCHAR(255) NOT NULL,
    `address_line` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(255) NOT NULL,
    `ward` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `order_items` (
    `id` BIGINT NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DECIMAL(10,2) NOT NULL,
    `food_item_id` BIGINT NOT NULL,
    `order_id` BIGINT NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `user_addresses` (
    `id` BIGINT NOT NULL,
    `phone_number` VARCHAR(255) NOT NULL,
    `user_id` BIGINT NOT NULL,
    `receiver_name` VARCHAR(255) NOT NULL,
    `address_line` VARCHAR(255) NOT NULL,
    `ward` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `latitude` DECIMAL(10,8) NOT NULL,
    `longtitude` DECIMAL(10,8) NOT NULL,
    `is_default` BOOLEAN NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `carts` (
    `id` BIGINT NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `cart_status` VARCHAR(255) NOT NULL,
    `user_id` BIGINT NOT NULL,
    `restaurant_id` BIGINT NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `cart_items` (
    `id` BIGINT NOT NULL,
    `quantity` INTEGER NOT NULL,
    `cart_id` BIGINT NOT NULL,
    `food_item_id` BIGINT NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `payments` (
    `id` BIGINT NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `method` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `order_id` BIGINT NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `reviews` (
    `id` BIGINT NOT NULL,
    `rating` TINYINT NOT NULL,
    `comment` TEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `user_id` BIGINT NOT NULL,
    `restaurant_id` BIGINT NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `permissions` (
    `id` BIGINT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `isActive` BOOLEAN NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `role_permissions` (
    `role_id` BIGINT NOT NULL,
    `permission_id` BIGINT NOT NULL,
    PRIMARY KEY (`role_id`, `permission_id`)
);

CREATE TABLE `restaurant_images` (
    `id` BIGINT NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    `image_type` ENUM NOT NULL,
    `is_primary` BOOLEAN NOT NULL,
    `display_order` INTEGER NOT NULL,
    `temp_id` INTEGER NOT NULL,
    `restaurant_id` BIGINT NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `refresh_token` (
    `id` BIGINT NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expiry_date` DATETIME NOT NULL,
    `user_id` BIGINT NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `food_item_categories` (
    `food_item_id` BIGINT NOT NULL,
    `category_id` BIGINT NOT NULL,
    PRIMARY KEY (`food_item_id`, `category_id`)
);

CREATE TABLE `food_images` (
    `id` BIGINT NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    `image_type` ENUM NOT NULL,
    `is_primary` BOOLEAN NOT NULL,
    `display_order` INTEGER NOT NULL,
    `temp_id` INTEGER NOT NULL,
    `food_id` BIGINT NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `restaurant_users` (
    `id` BIGINT NOT NULL,
    `role` ENUM NOT NULL,
    `restaurant_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `user_sessions` (
    `id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `valid` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `invalidated_at` TIMESTAMP NOT NULL,
    `ip_address` VARCHAR(255) NOT NULL,
    `user_agent` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
);

ALTER TABLE `user_roles` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);
ALTER TABLE `user_roles` ADD FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`);
ALTER TABLE `food_items` ADD FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`);
ALTER TABLE `orders` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);
ALTER TABLE `order_items` ADD FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`);
ALTER TABLE `user_addresses` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);
ALTER TABLE `carts` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);
ALTER TABLE `carts` ADD FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`);
ALTER TABLE `cart_items` ADD FOREIGN KEY (`food_item_id`) REFERENCES `food_items`(`id`);
ALTER TABLE `cart_items` ADD FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`);
ALTER TABLE `payments` ADD FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`);
ALTER TABLE `reviews` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);
ALTER TABLE `reviews` ADD FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`);
ALTER TABLE `role_permissions` ADD FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`);
ALTER TABLE `role_permissions` ADD FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`);
ALTER TABLE `restaurant_images` ADD FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`);
ALTER TABLE `refresh_token` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);
ALTER TABLE `food_item_categories` ADD FOREIGN KEY (`food_item_id`) REFERENCES `food_items`(`id`);
ALTER TABLE `food_item_categories` ADD FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`);
ALTER TABLE `food_images` ADD FOREIGN KEY (`food_id`) REFERENCES `categories`(`id`);
ALTER TABLE `restaurant_users` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);
ALTER TABLE `restaurant_users` ADD FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`);
ALTER TABLE `user_sessions` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`);