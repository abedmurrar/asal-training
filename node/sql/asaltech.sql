-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 25, 2018 at 07:28 AM
-- Server version: 5.7.21-0ubuntu0.17.10.1
-- PHP Version: 7.0.25-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";



--
-- Database: `asaltech`
--
CREATE DATABASE IF NOT EXISTS `asaltech` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `asaltech`;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(64) NOT NULL,
  `u_role` int(11) DEFAULT '2',
  `last_modified` datetime DEFAULT NULL,
  `last_logged` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `role_cons` (`u_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `u_role`, `last_modified`, `last_logged`) VALUES
(1, 'site.admin', 'abedmurrar15@gmail.com', '00316c1ef229e1d28ee8956bfab1029731d2b26e03110b58986d1f8e04eeefca', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
CREATE TABLE IF NOT EXISTS `user_role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(15) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_role`
--

INSERT INTO `user_role` (`role`) VALUES
('admin'),
('client');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `role_cons` FOREIGN KEY (`u_role`) REFERENCES `user_role` (`role_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- --------------------------------------------------------

--
-- Table structure for table `resets`
--
DROP TABLE IF EXISTS `resets`;
CREATE TABLE IF NOT EXISTS `resets` ( 
`reset_id` int(11) NOT NULL AUTO_INCREMENT,
`token` varchar(255) NOT NULL,
`user_id` int(11) NOT NULL,
`request_time` datetime NOT NULL,
PRIMARY KEY (`reset_id`),
UNIQUE KEY `token` (`token`),
KEY `fk_user` (`user_id`),
CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) 
REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;