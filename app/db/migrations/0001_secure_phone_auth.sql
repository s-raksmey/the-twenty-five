ALTER TABLE `users` ADD COLUMN `phoneNumberHash` text;
ALTER TABLE `users` ADD COLUMN `phoneNumberLast4` text;
CREATE UNIQUE INDEX IF NOT EXISTS `users_phoneNumberHash_unique` ON `users` (`phoneNumberHash`);
