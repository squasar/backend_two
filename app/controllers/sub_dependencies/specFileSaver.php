<?php


header('Access-Control-Allow-Origin: *');


class SpecFile
{

    private $image_root_path = "C:\\xampp\\htdocs\\dupia\\angRes\\backend_two\\views\\images\\postAttachments\\";
    private $res_root_path = "localhost/dupia/angRes/backend_two/views/images/postAttachments/";
    private $file_path_on_server ="";
    private $id = "";
    private $rand_str = "";
    private $f_uzanti = "";
    private $old_image_name = "";
    private $isImageExistOnDB = false;
    private $new_image_name = "";

    private $db_connection;
    private $db_name;
    private $db_servername;
    private $db_username;
    private $db_password;

    function __construct()
    {
        $katrs = ["AWS", "CDT", "RES", "YTG", "JHK", "CIN", "ETI", "BIM", "SOK", "KIL", "DON", "OKU", "GIT", "AKL", "SAT", "ETS", "CES", "JKL", "HNM", "MAN"];
        $_index = rand(0, 19);
        $this->rand_str = $katrs[$_index];
        $this->isImageExistOnDB = false;
        $this->createDBconnection("localhost", "root", "", "my_dupia");
    }

    function updateOnDB($file_name, $table_name, $where_id_key, $where_id_val)
    {
        $sql = "update ".$table_name." set file_path='" . $file_name . 
                    "' where ".$where_id_key."='".$where_id_val."';";
        $this->execSQL($sql);
    }

    function deleteOnDB($table_name, $where_id_key, $where_id_val)
    {
        $sql = "update ".$table_name." set file_path='" . "null" . 
                    "' where ".$where_id_key."='".$where_id_val."';";
        $this->execSQL($sql);
    }

    function prepareSQL($sql)
    {
        $stmt = $this->db_connection->prepare($sql);
        $stmt->execute();
        
        $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
        return $result;
    }

    function selectQuerySQL($sql)
    {
        $stmt = $this->db_connection->query($sql);
        $result = $stmt->fetch();
        return $result;
    }

    function execSQL($sql)
    {
        $this->db_connection->exec($sql);
    }

    function closeDBconnection()
    {
        $this->db_connection = null;
    }

    function createDBconnection($servername, $username, $password, $dbname)
    {
        $this->db_servername = $servername;
        $this->db_username = $username;
        $this->db_password = $password;
        $this->db_name = $password;

        try {
            $this->db_connection = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
            $this->db_connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
        }
    }

    function setFile($ref_id, $column_name, $table_name, $where_id_key, $where_id_val)
    {
        $this->id = $ref_id;
        $sql = "select ".$column_name." from ".$table_name." where ".$where_id_key."='" . $where_id_val ."';";
        $res = $this->selectQuerySQL($sql);
        if(isset($res['file_path'])){
            $this->old_image_name = $res['file_path'];
            $this->isImageExistOnDB = true;
        }else{
            $this->old_image_name = "";
            $this->isImageExistOnDB = false;
        }
        //outLine($res['photo']);
        if ($this->old_image_name!= null && $this->old_image_name != "" && !empty($this->old_image_name)) {
            $focused_part = explode("@", $this->old_image_name)[1];
            $this->rand_str = explode(".", $focused_part)[0];
            $this->f_uzanti = explode(".", $focused_part)[1];
            $this->file_path_on_server = $this->res_root_path . $this->old_image_name;
        }
    }

    function getFile()
    {
        if($this->isImageExistOnDB){
            return $this->old_image_name;
        }else{
            return "NONE";
        }
    }

    function uploadFile($file, $post_ref_id)
    {
        $target = basename($file/*["file"]*/["name"]);
        
        $_uzanti = explode(".", $target);
        $t_uzanti = explode(".", $target)[count($_uzanti) - 1];//[1];
        
        
        $new_target = $this->id . "@" . $this->rand_str . "." . $t_uzanti;

        $this->f_uzanti = $t_uzanti;

        $file_path = $this->image_root_path . "/" . $target;
        $new_file_path = $this->image_root_path . "/" . $new_target;

        if (move_uploaded_file($file/*["file"]*/["tmp_name"], $file_path)) {
            rename($file_path, $new_file_path);
            $this->updateOnDB($new_target, "posts", "post_ref_id", $post_ref_id);
            $this->file_path_on_server = $this->res_root_path . $new_target;
            return $this->file_path_on_server;
        } else {
            return false;
        }
    }


    function deleteFile($post_ref_id)
    {
        $filepath = $this->image_root_path . $this->id . "@" . $this->rand_str . "." . $this->f_uzanti;

        if (file_exists($filepath)) {
            unlink($filepath);
            $this->deleteOnDB("posts", "post_ref_id", $post_ref_id);
            return true;
        } else {
            return false;
        }
    }

}


//echo "IAMHEREYETTTY!!!";
//var_dump($_POST);
//print_r($_POST["my_id"]);
//$data = json_encode($_POST);
//print_r($data);


function outLine($val){
    $tag = "Giris";
    $sss = json_encode([$tag, $val]);
    print_r($sss);
}

$hasFileInParams = false;
$hasPostAsFile = false;

if (isset($_FILES["file"])) {
    $hasFileInParams = true;
    $hasPostAsFile = false;
}
if (isset($_POST["file"])) {
    $hasPostAsFile = true;
    $hasFileInParams = false;
}
if (isset($_POST["my_id"])) {
    
}
if (isset($_POST["command"])) {
    //outLine("4");
}


if ($_POST["my_id"] && $_POST["command"] && ($hasFileInParams||$hasPostAsFile)) {
    $command = $_POST["command"];
    $ref_id = $_POST["my_id"];
    if($hasFileInParams){
        $file = $_FILES["file"];
    }else if($hasPostAsFile){
        $file = $_POST["file"];
    }

    //outLine("111111111111111111111");
    $manager = new SpecFile();
    $manager->setFile($ref_id, "file_path", "posts", "post_ref_id", $ref_id);
    //outLine("222222222222222222222");


    if ($command == "upload") {
        $jsonArr = ['result'=>$manager->uploadFile($file, $ref_id) ]; 
        echo json_encode($jsonArr,JSON_UNESCAPED_UNICODE);
    } else if ($command == "delete") {
        $jsonArr = ['result'=>$manager->deleteFile($ref_id) ]; 
        echo json_encode($jsonArr,JSON_UNESCAPED_UNICODE);
    } else if ($command == "change") {
        $manager->deleteFile($ref_id);
        $jsonArr = ['result'=>$manager->uploadFile($file, $ref_id) ]; 
        echo json_encode($jsonArr,JSON_UNESCAPED_UNICODE);
    } else if($command == "get"){
        $jsonArr = ['result'=>$manager->getFile() ];
        echo json_encode($jsonArr,JSON_UNESCAPED_UNICODE);
    } else if($command == "postImage"){
        outLine($command);
        echo "HERE";
        $jsonArr = ['result'=>$manager->uploadFile($file, $ref_id) ];
        echo json_encode($jsonArr,JSON_UNESCAPED_UNICODE);
    }else if($command == "getPostedFile"){
        $res="http://localhost:8090/dupia/angRes/backend_two/views/images/postAttachments/".$manager->getFile();
        //echo $res;
        $jsonArr = ['result'=>$res/*$manager->getFile()*/ ];
        //echo json_encode($jsonArr,JSON_UNESCAPED_UNICODE);
        echo json_encode($jsonArr);
    }
}
