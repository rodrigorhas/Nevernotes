CREATE DATABASE  IF NOT EXISTS `nevernotes` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `nevernotes`;
-- MySQL dump 10.13  Distrib 5.5.46, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: nevernotes
-- ------------------------------------------------------
-- Server version	5.5.46-0ubuntu0.14.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notes` (
  `id` varchar(28) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `text` longtext,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
INSERT INTO `notes` VALUES ('n5695e1855c6a37.26756803','Test','<p>Test 123</p>',1452663173,1452664459),('n5695e37fccfef2.15792638','Lorem Ipsum','<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet,&nbsp;<br></p>',1452663679,1452664429),('n5695e4f7e0c1a1.08530916','HTML','<pre>&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n&lt;head&gt;\n    &lt;meta charset=\"utf-8\"&gt;\n    &lt;title&gt;Bootstrap 3 responsive centered columns&lt;/title&gt;\n    &lt;meta name=\"description\" content=\"Bootstrap 3 responsive centered columns\"&gt;\n    &lt;!-- include bootstrap --&gt;\n    &lt;link rel=\"stylesheet\" href=\"https://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css\"&gt;\n&lt;/head&gt;\n&lt;body&gt;\n\n&lt;h1&gt;With width auto&lt;/h1&gt;\n\n&lt;div class=\"container\"&gt;\n    &lt;div class=\"row row-centered\"&gt;\n        &lt;div class=\"col-xs-6 col-centered\"&gt;&lt;div class=\"item\"&gt;&lt;div class=\"content\"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;\n        &lt;div class=\"col-xs-6 col-centered\"&gt;&lt;div class=\"item\"&gt;&lt;div class=\"content\"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;\n        &lt;div class=\"col-xs-3 col-centered\"&gt;&lt;div class=\"item\"&gt;&lt;div class=\"content\"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;\n        &lt;div class=\"col-xs-3 col-centered\"&gt;&lt;div class=\"item\"&gt;&lt;div class=\"content\"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;\n        &lt;div class=\"col-xs-3 col-centered\"&gt;&lt;div class=\"item\"&gt;&lt;div class=\"content\"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;\n    &lt;/div&gt;\n&lt;/div&gt;\n\n&lt;h1&gt;With fixed width&lt;/h1&gt;\n  \n&lt;div class=\"container\"&gt;\n    &lt;div class=\"row row-centered\"&gt;\n        &lt;div class=\"col-xs-6 col-centered col-fixed\"&gt;&lt;div class=\"item\"&gt;&lt;div class=\"content\"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;\n        &lt;div class=\"col-xs-6 col-centered col-fixed\"&gt;&lt;div class=\"item\"&gt;&lt;div class=\"content\"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;\n        &lt;div class=\"col-xs-6 col-centered col-fixed\"&gt;&lt;div class=\"item\"&gt;&lt;div class=\"content\"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;\n        &lt;div class=\"col-xs-6 col-centered col-fixed\"&gt;&lt;div class=\"item\"&gt;&lt;div class=\"content\"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;\n        &lt;div class=\"col-xs-6 col-centered col-fixed\"&gt;&lt;div class=\"item\"&gt;&lt;div class=\"content\"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;\n    &lt;/div&gt;\n&lt;/div&gt;\n  \n&lt;h1&gt;With min-width&lt;/h1&gt;\n  \n&lt;div class=\"container\"&gt;\n    &lt;div class=\"row row-centered\"&gt;\n        &lt;div class=\"col-xs-6 col-centered col-min\"&gt;&lt;div class=\"item\"&gt;&lt;div class=\"content\"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;\n        &lt;div class=\"col-xs-6 col-centered col-min\"&gt;&lt;div class=\"item\"&gt;&lt;div class=\"content\"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;\n        &lt;div class=\"col-xs-6 col-centered col-min\"&gt;&lt;div class=\"item\"&gt;&lt;div class=\"content\"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;\n        &lt;div class=\"col-xs-6 col-centered col-min\"&gt;&lt;div class=\"item\"&gt;&lt;div class=\"content\"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;\n        &lt;div class=\"col-xs-6 col-centered col-min\"&gt;&lt;div class=\"item\"&gt;&lt;div class=\"content\"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;\n    &lt;/div&gt;\n&lt;/div&gt;\n  \n&lt;h1&gt;With max-width&lt;/h1&gt;\n  \n&lt;div class=\"container\"&gt;\n    &lt;div class=\"row row-centered\"&gt;\n        &lt;div class=\"col-xs-6 col-centered col-max\"&gt;&lt;div class=\"item\"&gt;&lt;div class=\"content\"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;\n        &lt;div class=\"col-xs-6 col-centered col-max\"&gt;&lt;div class=\"item\"&gt;&lt;div class=\"content\"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;\n        &lt;div class=\"col-xs-6 col-centered col-max\"&gt;&lt;div class=\"item\"&gt;&lt;div class=\"content\"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;\n        &lt;div class=\"col-xs-6 col-centered col-max\"&gt;&lt;div class=\"item\"&gt;&lt;div class=\"content\"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;\n        &lt;div class=\"col-xs-6 col-centered col-max\"&gt;&lt;div class=\"item\"&gt;&lt;div class=\"content\"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;\n    &lt;/div&gt;\n&lt;/div&gt;\n  \n&lt;/body&gt;\n&lt;/html&gt;</pre>',1452664055,1452664508);
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-01-13  2:57:53
