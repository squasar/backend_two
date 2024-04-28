<?php


header('Access-Control-Allow-Origin: *');


class MyFile
{

    private $image_root_path = "C:\\xampp\\htdocs\\dupia\\angRes\\backend_two\\views\\images\\profilePics\\";
    private $res_root_path = "localhost/dupia/angRes/backend_two/views/images/profilePics/";
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

    function updateOnDB($file_name)
    {
        $sql = "update users set photo='" . $file_name . "' where ref_id='" . $this->id."';";
        $this->execSQL($sql);
    }

    function deleteOnDB()
    {
        $sql = "update users set photo=null where ref_id='" . $this->id."';";
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

    function setFile($ref_id)
    {
        $this->id = $ref_id;
        $sql = "select photo from users where ref_id='" . $ref_id ."';";
        $res = $this->selectQuerySQL($sql);
        if(isset($res['photo'])){
            $this->old_image_name = $res['photo'];
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

    function uploadFile($file)
    {
        $target = basename($file/*["file"]*/["name"]);

        $_uzanti = explode(".", $target);
        $t_uzanti = explode(".", $target)[count($_uzanti) - 1];//[1];
        //$t_uzanti = explode(".", $target)[1];

        $new_target = $this->id . "@" . $this->rand_str . "." . $t_uzanti;

        $this->f_uzanti = $t_uzanti;

        $file_path = $this->image_root_path . "/" . $target;
        $new_file_path = $this->image_root_path . "/" . $new_target;

        if (move_uploaded_file($file/*["file"]*/["tmp_name"], $file_path)) {
            rename($file_path, $new_file_path);
            $this->updateOnDB($new_target);
            $this->file_path_on_server = $this->res_root_path . $new_target;
            return $this->file_path_on_server;
        } else {
            return false;
        }
    }


    function deleteFile()
    {
        $filepath = $this->image_root_path . $this->id . "@" . $this->rand_str . "." . $this->f_uzanti;

        if (file_exists($filepath)) {
            unlink($filepath);
            $this->deleteOnDB();
            return true;
        } else {
            return false;
        }
    }

}

/*function outLine($val){
    $tag = "Giris";
    $sss = json_encode([$tag, $val]);
    print_r($sss);
}*/

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
    //outLine("3");
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

    $manager = new MyFile();
    $manager->setFile($ref_id);

    if ($command == "upload") {
        $jsonArr = ['result'=>$manager->uploadFile($file) ]; 
        echo json_encode($jsonArr,JSON_UNESCAPED_UNICODE);
    } else if ($command == "delete") {
        $jsonArr = ['result'=>$manager->deleteFile() ]; 
        echo json_encode($jsonArr,JSON_UNESCAPED_UNICODE);
    } else if ($command == "change") {
        $manager->deleteFile();
        $jsonArr = ['result'=>$manager->uploadFile($file) ]; 
        echo json_encode($jsonArr,JSON_UNESCAPED_UNICODE);
    } else if($command == "get"){
        $jsonArr = ['result'=>$manager->getFile() ];
        echo json_encode($jsonArr,JSON_UNESCAPED_UNICODE);
    }else if($command == "getFileForPost"){
        $res="http://localhost:8090/dupia/angRes/backend_two/views/images/profilePics/".$manager->getFile();
        if($res == "http://localhost:8090/dupia/angRes/backend_two/views/images/profilePics/"){
            $res = "http://localhost:4200/assets/profile_picture_none.jpg";
        }
        $jsonArr = ['result'=>$res];
        echo json_encode($jsonArr);
    }
}
