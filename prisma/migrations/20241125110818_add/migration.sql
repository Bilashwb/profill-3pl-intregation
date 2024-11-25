-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `shop` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `isOnline` BOOLEAN NOT NULL DEFAULT false,
    `scope` VARCHAR(191) NULL,
    `expires` DATETIME(3) NULL,
    `accessToken` VARCHAR(191) NOT NULL,
    `userId` BIGINT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `accountOwner` BOOLEAN NOT NULL DEFAULT false,
    `locale` VARCHAR(191) NULL,
    `collaborator` BOOLEAN NULL DEFAULT false,
    `emailVerified` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shop` VARCHAR(191) NOT NULL,
    `customer_id` INTEGER NOT NULL,
    `credential` VARCHAR(191) NOT NULL DEFAULT '',
    `prefix` VARCHAR(191) NOT NULL DEFAULT '',
    `environment` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `podVariants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` VARCHAR(191) NOT NULL,
    `variantId` VARCHAR(191) NOT NULL DEFAULT '',
    `profillSku` VARCHAR(191) NOT NULL DEFAULT '',
    `hitSku` VARCHAR(191) NOT NULL DEFAULT '',
    `upcCode` VARCHAR(191) NOT NULL DEFAULT '',
    `htsCode` VARCHAR(191) NOT NULL DEFAULT '',
    `hitcolor` VARCHAR(191) NOT NULL DEFAULT '',
    `hitsize` VARCHAR(191) NOT NULL DEFAULT '',
    `artfileUrl` VARCHAR(191) NOT NULL DEFAULT '',
    `shop` VARCHAR(191) NOT NULL DEFAULT '',
    `profillStatus` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `podPrice` DOUBLE NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PodConfigs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL DEFAULT '',
    `locationId` VARCHAR(191) NOT NULL DEFAULT '',
    `colors` VARCHAR(191) NOT NULL DEFAULT '',
    `decoration` VARCHAR(191) NOT NULL DEFAULT '',
    `description` VARCHAR(191) NOT NULL DEFAULT '',
    `artfile` VARCHAR(191) NOT NULL DEFAULT '',
    `artfileUrl` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shop` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `orderId` VARCHAR(191) NOT NULL DEFAULT '',
    `received` VARCHAR(191) NOT NULL DEFAULT '',
    `queueId` VARCHAR(191) NOT NULL DEFAULT '',
    `submitted` VARCHAR(191) NOT NULL DEFAULT '',
    `warehouseOrderId` VARCHAR(191) NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
