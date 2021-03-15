<?php 
/**
 * вывод списка альбомов
 */
if ( $_SERVER["REQUEST_METHOD"] != 'POST' ) header("Location: /");
require_once "lib/core.php";

// если есть фильтры, то получаем и обрабатываем их
$_POST = json_decode( file_get_contents("php://input"), true );
$author = strip_tags($_POST["author"]);
$year_sort = strip_tags($_POST["year_sort"]);

$where = "";
$order_by = "";
if (!empty($author) and strlen($author) > 0 ) $where .= " where album_author = ? ";
if (!empty($year_sort)) {
    $order_by = " order by album_year $year_sort ";
}

$sql = "SELECT * FROM collections_cd $where $order_by ";
$items = DB::getAll( $sql, $author );

if ( count($items) > 0 ) {
    echo json_encode($items, JSON_UNESCAPED_UNICODE);
}

