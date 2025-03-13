-- CreateTable
CREATE TABLE `user_tb` (
    `userid` INTEGER NOT NULL AUTO_INCREMENT,
    `userFullame` VARCHAR(100) NOT NULL,
    `userName` VARCHAR(50) NOT NULL,
    `userPassward` VARCHAR(50) NOT NULL,
    `userImage` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `festival_tb` (
    `festid` INTEGER NOT NULL AUTO_INCREMENT,
    `festName` VARCHAR(150) NOT NULL,
    `festDetail` VARCHAR(191) NOT NULL,
    `festState` VARCHAR(191) NOT NULL,
    `festCost` DOUBLE NOT NULL,
    `festNumDate` INTEGER NOT NULL,
    `userid` INTEGER NOT NULL,
    `festImage` VARCHAR(150) NOT NULL,

    PRIMARY KEY (`festid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
