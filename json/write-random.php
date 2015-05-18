<?php
////////////////////////// begin: temporary solution ///////////////////////
$postdata = file_get_contents("php://input");

$randFile = "sentences-random.json";

file_put_contents($randFile, $postdata);
echo $randFile;
////////////////////////// end: temporary solution ///////////////////////
?>