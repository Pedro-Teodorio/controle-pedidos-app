CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`patient_name` text NOT NULL,
	`work_id` text NOT NULL,
	`work_name` text NOT NULL,
	`quantity` real NOT NULL,
	`unit_price` real NOT NULL,
	`total_price` real NOT NULL,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`number` integer NOT NULL,
	`customer_name` text NOT NULL,
	`customer_phone` text,
	`notes` text,
	`status` text NOT NULL,
	`total` real NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`closed_at` text,
	`canceled_at` text
);
