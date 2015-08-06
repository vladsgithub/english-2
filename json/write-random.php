<?php
////////////////////////// begin: temporary solution ///////////////////////
$postdata = file_get_contents("php://input");

$randFile = $_GET["jsonFileName"]."-random.json";

file_put_contents($randFile, $postdata);
echo $randFile;
////////////////////////// end: temporary solution ///////////////////////
?>