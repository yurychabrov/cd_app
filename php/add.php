<?php 
/**
 * добавление нового альбома или обновление существующего
 */
require_once "lib/core.php";

$post = new Request("POST");

// минимальная обработка файла и перемещение его в нужный каталог
$types = ['image/gif', 'image/png', 'image/jpeg'];
$size = 50024000;

$fotofile = isset($_FILES["file"])
          ? $_FILES["file"]
          : '';

$foto_path = "";

if ($fotofile['size'] != 0) {
        if (!in_array($fotofile['type'], $types))
            die('Запрещённый тип файла. Допускаются форматы картинки: gif, png, jpeg ');
    
        if ($fotofile['size'] > $size)
            die('Слишком большой размер файла.'); 

        if (!@copy($fotofile['tmp_name'], '../img/' . $fotofile['name'])) { 
            echo 'Картинка не загружена '; 
        }
        $foto_path = $fotofile['name']; 
}

$params = [
    $post->album_name,
    $post->album_author,
    intval($post->album_year),
    $post->purchase_date,
    intval($post->album_duration),
    intval($post->price),
    intval($post->number_rum),
    intval($post->number_rack),
    intval($post->number_shelf),
    $foto_path  
];

if ($post->type_f === 'add') {
    $sql = "insert into collections_cd (album_name, album_author, album_year, purchase_date, album_duration, price, number_rum, number_rack, number_shelf, file) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";

    try {
        $result = DB::add($sql, $params);
        echo "Новый альбом успешно добавлен!";
    } catch (\Throwable $th) {
        echo "Ошибка! Альбом не добавлен!";
    }
}

if ($post->type_f === 'edit') {
    if ( !empty($foto_path) ) {
        $img = ', file = ?';
    }
    else {
        $img = '';
        array_pop($params);
    }
    array_push($params, $post->id);
    
    
    $sql = "update collections_cd 
            set album_name = ?, 
                album_author = ?, 
                album_year = ?, 
                purchase_date = ?, 
                album_duration = ?, 
                price = ?, 
                number_rum = ?, 
                number_rack = ?, 
                number_shelf = ? 
                $img
            where id = ?
            ";

    try {
        $result = DB::set($sql, $params);
        echo "Альбом #{$post->id} успешно отредактирован!";
    } catch (\Throwable $th) {
        echo "Ошибка редактирования!";
    }
}


