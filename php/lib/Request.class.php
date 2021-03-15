<?php 

// класс для работы с get/post параметрами

class Request 
{
    private $params = [];

    function __get($name) {
        if ( isset($this->params["$name"]) )
            return strip_tags( $this->params["$name"] );

        return null;
    }


    function __construct($method) {
        if ( $_SERVER["REQUEST_METHOD"] != $method ) exit;
        $this->params = $_REQUEST;
    }

}