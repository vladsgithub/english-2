<?php
//Получаем содержимое файла в виде одной строки - готовый json
//$postdata = file_get_contents("php://input");

//$oldFile = "words-".$_GET["date"].".json";
//$newFile = "words.json";

//if (file_exists($newFile)) copy($newFile, $oldFile);
//file_put_contents($newFile, $postdata);
//echo $newFile.", ".$oldFile;


////////////////////////// begin: temporary solution ///////////////////////
$postdata = file_get_contents("php://input");

$oldFile = "sentences-".$_GET["date"].".json";
$newFile = "sentences.json";

if (file_exists($newFile)) copy($newFile, $oldFile);
file_put_contents($newFile, $postdata);
echo $newFile.", ".$oldFile;
////////////////////////// end: temporary solution ///////////////////////
?>