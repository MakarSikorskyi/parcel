<?php
require_once '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'sys' . DIRECTORY_SEPARATOR . 'core.php';

class Category {
    public function get($ajaxSet = true) {
        $category = array();
        $q = DBD::get()->prepare(' SELECT * FROM parcel_category ');
        $q->execute();
        while($r = $q->fetch()) {
            $category[$r->id] = $r;
        }
        if ($ajax) AJAX::set('category', $category);
        return $category;
    }
    
    public function add() {
        $name = Core::getInputVar (INPUT_POST, NULL, 'name');
        
        $q = DBD::get()->prepare(' INSERT INTO parcel_category (name) VALUE(?) ');
        if(!$q->execute (array ($name))) {
            Core::message (Core::MSG_ERROR, 'parcel/main.php: '. __LINE__. ' '. vsprintf ('[%s][%s] %s', $q->errorInfo ()));
        }
        self::get();
    }
    
    public function delete() {
        $id = Core::getInputVar (INPUT_POST, NULL, 'id');
        
        $q = DBD::get()->prepare(' DELETE FROM parcel_category WHERE id = ? ');
        if(!$q->execute (array ($id))) {
            Core::message (Core::MSG_ERROR, 'parcel/main.php: '. __LINE__. ' '. vsprintf ('[%s][%s] %s', $q->errorInfo ()));
        }
        self::get();
    }
}

class Parcel {
    public static $fields = array(
        'state' => array(
            'required' => false,
            'search' => true,
            'pdo_param' => PDO::PARAM_INT
        ),
        'recipient' => array(
            'required' => true,
            'search' => true,
            'pdo_param' => PDO::PARAM_INT
        ),
        'sender' => array(
            'required' => false,
            'search' => true,
            'pdo_param' => PDO::PARAM_INT
        ),
        'category' => array(
            'required' => true,
            'search' => true,
            'pdo_param' => PDO::PARAM_INT
        ), 
        'weight' => array(
            'required' => true,
            'pdo_param' => PDO::PARAM_INT
        ), 
        'size' => array(
            'required' => true,
            'pdo_param' => PDO::PARAM_STR
        ), 
        'price' => array(
            'required' => true,
            'pdo_param' => PDO::PARAM_INT
        ), 
        'comment' => array(
            'required' => false,
            'pdo_param' => PDO::PARAM_STR
        ), 
        'id' => array(
            'required' => false,
            'search' => true,
            'pdo_param' => PDO::PARAM_INT
        )
    );
    
    public static $data = array();
    
    public function getUserInfo($id, $arg = false) {
        $q = DBD::get()->prepare('SELECT 
                    se.id,
                    CONCAT_WS(" ", sed.lastname, sed.firstname, sed.middlename) as name,
                    sed.phone_1 as phone,
                    sed.email
                FROM sb_employee se
                INNER JOIN sb_employee_data sed ON se.id = sed.id
                WHERE se.id = ?');
        $q->execute(array($id));
        $q = $q->fetch();
        if($arg && isset($q->$arg)) $q = $q->$arg;
        return $q;
    }

    public function get($id) {
        $q = DBD::get()->prepare(' SELECT * FROM parcel WHERE id = ?');
        $q->execute(array($id));
        
        try {
            if($q = $q->fetch()) {
                foreach ($q as $k => $v) { self::set($k, $v); }
            } else {
                throw new Exception("Can`t get parcel!!!");
            }
        }  catch (Exception $e) {
            Core::message(Core::MSG_ERROR, $e->getMessage());
            AJAX::send();
        }
    }
    
    public function search($searchParam = array()) {
        $sql = array();
        if(is_array($searchParam)) {
            foreach ($searchParam as $key => $value) {
                if( isset(self::$fields[$key]['search']) ) {
                    if(is_array($value)) {
                        $sql[] = $key . ' IN ('.implode($value).')';
                    } else {
                        $sql[] = $key . ' = '. $value;
                    }
                }
            }
            
            $q = DBD::get()->prepare(' SELECT * FROM parcel ' .( (!empty($sql)) ? ' WHERE ' : '' ).implode(' AND ', $sql). ' ORDER BY id DESC');
            $q->execute();
            $q = $q->fetchAll();
            return $q;
            
        } else {
            return false;
        }
    }
    
    public static function set($param, $value) {
        if(!empty($value) && array_key_exists($param, self::$fields)) self::$data[$param] = $value;
    }
    
    public static function save() {
        foreach (self::$fields as $field => $filter) {
            try {
                if($filter['required'] && empty(self::$data[$field])) {
                    throw new Exception("No data for required field ".$field);
                } 
            }  catch (Exception $e) {
                Core::message(Core::MSG_ERROR, $e->getMessage());
                AJAX::send();
            }
        } 
        
        if(!isset(self::$data['id'])) {
            self::$data['sender'] = User::get('id');
            self::$data['state'] = 1;
            
            ksort(self::$data);
            
            $q = DBD::get()->prepare(' INSERT INTO parcel ('. implode(',',array_keys(self::$data))
                    .') VALUE('. implode(',', array_map(function($k) {return ':'.$k;}, array_keys(self::$data)) ).') ');
            
            foreach (self::$data as $key => $value) {
                $q->bindValue(":".$key, $value, self::$fields[$key]['pdo_param']);
            }
           
            if(!$q->execute ()) {
                Core::message (Core::MSG_ERROR, 'parcel/main.php: '. __LINE__. ' '. vsprintf ('[%s][%s] %s', $q->errorInfo ()));
            }
        } else {
            $q = DBD::get()->prepare(' UPDATE parcel SET '. implode(',', array_map(function($k) {return '`'.$k.'` = :'.$k;}, array_keys(self::$data)) )
                    .' WHERE `id` = :id ');
            
            foreach (self::$data as $key => $value) {
                $q->bindValue(":".$key, $value, self::$fields[$key]['pdo_param']);
            }
           
            if(!$q->execute ()) {
                Core::message (Core::MSG_ERROR, 'parcel/main.php: '. __LINE__. ' '. vsprintf ('[%s][%s] %s', $q->errorInfo ()));
            }
        }
    }
}

switch(Core::getInputVar (INPUT_POST, NULL, 'action')) {
    case 'get_category':
            Category::get();
            AJAX::send();
        break;
    case 'add_category':
            Category::add();
            AJAX::send();
        break;
    case 'delete_category':
            Category::delete();
            AJAX::send();
        break;
    case 'add_parcel':
            $parcel = new Parcel();
            foreach ($parcel::$fields as $field => $v) {
                $parcel->set($field, Core::getInputVar (INPUT_POST, NULL, $field));
            }
            $parcel->save();
            Core::message(Core::MSG_INFO, 'Посылка добавлена!');
            AJAX::redirect(URL_MOD. 'parcel/main.php');
        break;
    case 'edit_parcel':
            $parcel = new Parcel();
            $parcel->get(Core::getInputVar (INPUT_POST, NULL, 'id'));
            foreach ($parcel::$fields as $field => $v) {
                if(!empty(Core::getInputVar (INPUT_POST, NULL, $field))) $parcel->set($field, Core::getInputVar (INPUT_POST, NULL, $field));
            }
            $parcel->save();
            Core::message(Core::MSG_INFO, 'Посылку оновлено!');
            AJAX::redirect(URL_MOD. 'parcel/main.php');
        break;
    case 'print':
            $parcels = Parcel::search(array('id' => Core::getInputVar (INPUT_POST, NULL, 'id')));
            foreach ($parcels as $key => $value) {
                $parcels[$key]->sender = Parcel::getUserInfo($parcels[$key]->sender);
                $parcels[$key]->recipient = Parcel::getUserInfo($parcels[$key]->recipient);
            }
            AJAX::set('print', array_shift($parcels));
            AJAX::send();
        break;
    case 'get_list':
            $q = DBD::get()->prepare(' 
                SELECT 
                    se.id,
                    CONCAT_WS(" ", sed.lastname, sed.firstname, sed.middlename) as name 
                FROM sb_employee se
                INNER JOIN sb_employee_data sed ON se.id = sed.id
                WHERE se.id != ?
            ');
            $q->execute(array(User::get('id')));
            $q = $q->fetchAll();
            
            $list = array(
                'category' => Category::get(false),
                'recipient' => $q
            );
            
            AJAX::set('list', $list);
            AJAX::send();
        break;
    case 'get_chart':
            if(User::access ('parcel', 'client', FALSE) && !User::access ('admin', 'su', FALSE)) {
                $chart = array(
                    'send' => count(Parcel::search(array('state' => 1, 'sender' => User::get('id')))) + count(Parcel::search(array('state' => 1, 'recipient' => User::get('id')))),
                    'recive' => count(Parcel::search(array('state' => 2, 'sender' => User::get('id')))) + count(Parcel::search(array('state' => 2, 'recipient' => User::get('id')))),
                    'canceled' => count(Parcel::search(array('state' => 3, 'sender' => User::get('id')))) + count(Parcel::search(array('state' => 3, 'recipient' => User::get('id'))))
                );
            } else {
                $chart = array(
                    'send' => count(Parcel::search(array('state' => 1))),
                    'recive' => count(Parcel::search(array('state' => 2))),
                    'canceled' => count(Parcel::search(array('state' => 3)))
                );
            }
            AJAX::set('chart', $chart);
            AJAX::send();
        break;
    default:
            $data = array();
            if(User::access ('parcel', 'client', FALSE) && !User::access ('admin', 'su', FALSE)) {
                $parcels = Parcel::search(array('sender' => User::get('id')));
                foreach ($parcels as $key => $value) {
                    $parcels[$key]->sender_name = Parcel::getUserInfo($parcels[$key]->sender, 'name');
                    $parcels[$key]->recipient_name = Parcel::getUserInfo($parcels[$key]->recipient, 'name');
                    $data[] = $parcels[$key];
                }
                $parcels = Parcel::search(array('recipient' => User::get('id')));
                foreach ($parcels as $key => $value) {
                    $parcels[$key]->sender_name = Parcel::getUserInfo($parcels[$key]->sender, 'name');
                    $parcels[$key]->recipient_name = Parcel::getUserInfo($parcels[$key]->recipient, 'name');
                    $data[] = $parcels[$key];
                }
            } else {
                $parcels = Parcel::search();
                foreach ($parcels as $key => $value) {
                    $parcels[$key]->sender_name = Parcel::getUserInfo($parcels[$key]->sender, 'name');
                    $parcels[$key]->recipient_name = Parcel::getUserInfo($parcels[$key]->recipient, 'name');
                    $data[] = $parcels[$key];
                }
            }
            
        
            AJAX::set('category', Category::get());
            AJAX::set('parcel_list', $data);
        break;
}


AJAX::send(URL_MOD. 'parcel/main.js');