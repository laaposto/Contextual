<?php
$img        = $_GET['url'];
$myfile = fopen("urls_logs.txt", "a") or die("error4");
$txt = $_SERVER['REMOTE_ADDR'] . ' ---> ' . $img . ' ---> ' . gmdate('d-m-Y H:i:s',strtotime('+17 minutes'));
fwrite($myfile, "\n". $txt);
fclose($myfile);
?>