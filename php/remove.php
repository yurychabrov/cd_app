<?php 
/**
 * удаление альбома
 */
require_once "lib/core.php";
$_POST = json_decode( file_get_contents("php://input"), true );
$id = strip_tags($_POST["id"]);
if (!$id) die('Не верно передан id альбома');


try {
    DB::set("DELETE FROM `collections_cd` WHERE `id` = ? ", $id);
} catch (\Throwable $th) {
    echo "Ошибка! Альбом не удалился!";
}