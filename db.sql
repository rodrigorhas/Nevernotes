CREATE DATABASE  IF NOT EXISTS `nevernotes` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `nevernotes`;
-- MySQL dump 10.13  Distrib 5.5.46, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: nevernotes
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
  `user_id` int(11) DEFAULT NULL,
  `tags` text,
  `color` varchar(45) DEFAULT NULL,
  `type` char(1) DEFAULT NULL,
  `starred` int(11) DEFAULT '0',
  `deleted` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
INSERT INTO `notes` VALUES ('n5695e1855c6a37.26756803','Test','<p><span>lorem ipsum</span></p>',1452663173,1452787471,1,'php,data,mgconsult','amethyst','T',0,1),('n5695e37fccfef2.15792638','Lorem Ipsum','<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet,&nbsp;<br></p>',1452663679,1452664429,1,NULL,'alizarin','T',0,1),('n5695e4f7e0c1a1.08530916','HTML','<p style=\"line-height: 18.5714px;\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat voluptate expedita molestiae ex quod quo voluptates, delectus tempore adipisci in?<br><span style=\"line-height: 18.5714px;\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat voluptate expedita molestiae ex quod quo voluptates, delectus tempore adipisci in?<br></span><span style=\"line-height: 18.5714px;\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat voluptate expedita molestiae ex quod quo voluptates, delectus tempore adipisci in?</span></p><p style=\"line-height: 18.5714px;\"><span style=\"line-height: 18.5714px;\">asdasdasd<br></span><span style=\"line-height: 18.5714px;\">psdjapsd<br></span><span style=\"line-height: 18.5714px;\">asodpjaisofghueiwueyy</span></p><div><span style=\"line-height: 18.5714px;\"><br></span></div>',1452664055,1452796741,1,NULL,'silver','T',0,0),('n56963a5f6041d6.44493153','rodrigo','<p>Som pra testar mesmo. Em tela cheia fica fodao</p>',1452685919,1452773839,1,NULL,NULL,'T',0,0),('n56965dface8bf8.12312452','CACP Contabilidade','<p>Lorem ipsu, dolor sia mett</p><p><img src=\"http://localhost/nevernotes/assets/images/uploads/image001.png\" style=\"line-height: 18.5714px; width: 172px;\"><br></p>',1452695034,1452785161,1,NULL,'green_sea','T',0,1),('n56965dface8bf8.12937451','teste','<p>lorem ipsu, dolor sia met</p>',1452695034,1452695048,1,NULL,'abestos','T',0,0),('n56965dface8bf8.21231636','teste','<p>Hoje eu acordei, me sentindo estranho, nao sei o porque dessa louca paixao, por alguem que nao me ama, alguem que nao tem coraÃ§Ã£o, alguem que sÃ³ quer me ver sofrer, mas tudo na vida tem um jeito que so a gente sabe, que Ã© vocÃª.</p><p><br></p><p>E o teu olhar, teu sorriso, que me faz lembrar de todos os momentos, que pensei ter vivido, todos eles somente ao teu lado</p>',1452695034,1452773974,1,NULL,NULL,'T',0,0),('n56965dface8bf8.92451291','teste','<p>lorem ipsu, dolor sia met</p>',1452695034,1452695048,1,NULL,NULL,'T',0,0),('n56965dface8bf8.92459521','teste','<p>lorem ipsu, dolor sia met</p>',1452695034,1452695048,1,NULL,'nephritis','T',0,0),('n5697f253c3dc34.06885204','asdasd','<p>sdqefgrthjy</p>',1452798547,NULL,NULL,NULL,'mid_blue','T',0,0),('n5697f26151da21.13825754','Tedt on lg','<p><a href=\"Hsjdbjskwbdudbdb\">Http://www.google.com</a></p><p><br></p>',1452798561,1452798610,NULL,NULL,'amethyst','T',0,0),('n5697f714e2ccc4.60731075','qwd','<p>qwdqwd</p>',1452799764,NULL,NULL,NULL,'white','T',0,0);
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

-- Dump completed on 2016-01-14 16:50:28
