<?php defined ('__INCLUDE_SAFE__') || die ();

//defined ('SYS_CLI') && define ('SALESBASE_CONNECTION_USER_ID', '-1:System');
//isset ($_SESSION['user']) && define ('SALESBASE_CONNECTION_USER_ID', $_SESSION['user']['id']. ':'. $_SESSION['user']['username']);
//defined ('SALESBASE_CONNECTION_USER_ID') || define ('SALESBASE_CONNECTION_USER_ID', '0:Anonymous');

//if (SYS_DBR_ACCESS) {
//    require_once PATH_SYS. 'dbr'. PHP;
//    if (defined ('SYS_CLI')) $conf = CLI::loadConfigFile ('db');
//    else $conf = Core::loadConfigFile ('db');
//
//    try {
//        # Connect to DB Replica
//        DBR::set (@new PDO ($conf['replica']['dsn'], $conf['replica']['user'], $conf['replica']['pass'], $conf['replica']['options']));
//        # Set connection charset/collation
//        DBR::get ()->query (sprintf ('SET NAMES `%s` COLLATE `%s`', $conf['replica']['charset'], $conf['replica']['collation']));
//        define ('DBR_STATUS', TRUE);
//    } catch (PDOException $e) {
////        Core::message (Core::MSG_ERROR, $e->getCode (). $e->getMessage ());
//        define ('DBR_STATUS', FALSE);
//    }
//} else define ('DBR_STATUS', FALSE);
define ('DBR_STATUS', FALSE);


class xPDO extends PDO {
    // Executed queries count
    public static $eqc = 0, $fqc = 0;
    
    private static function getUser () {
        if (defined ('SYS_CLI')) return '-1:System';
        if (isset ($_SESSION) && isset ($_SESSION['user'])) return $_SESSION['user']['id']. ':'. $_SESSION['user']['username'];
        return '0:Anonymous';
    }
    
    public function query ($statement) {
        xPDO::$eqc++;
        $statement = preg_replace ('/(^\s+|\s+$)/ui', '', preg_replace ('/\s{2,}/ui', ' ', str_replace (array ("\n", "\r"), ' ', $statement)));
        return parent::query ('/*'. self::getUser (). '*/'. $statement);
    }
    
    public function exec ($statement) {
        xPDO::$eqc++;
        $statement = preg_replace ('/(^\s+|\s+$)/ui', '', preg_replace ('/\s{2,}/ui', ' ', str_replace (array ("\n", "\r"), ' ', $statement)));
        return parent::exec ('/*'. self::getUser (). '*/'. $statement);
    }
    
    public function prepare ($statement, $driver_options = array ()) {
        $statement = preg_replace ('/(^\s+|\s+$)/ui', '', preg_replace ('/\s{2,}/ui', ' ', str_replace (array ("\n", "\r"), ' ', $statement)));
//        if (DBR_STATUS === TRUE && preg_match ('/^SELECT/i', $statement) && (xPDO::$eqc % 3 == 0 || preg_match ('/(co_cm_search_feedback|co_cm_customer_offer)/ui', $statement))) {
        if (DBR_STATUS === TRUE && preg_match ('/^SELECT/i', $statement) && preg_match ('/(co_cm_search_feedback|co_cm_customer_offer|sb_customer|sb_customer_tmp)/ui', $statement)) {
            return DBR::prepare ('/*'. self::getUser (). '*/'. $statement);
        }
        return new xPDOStatement (parent::prepare ('/*'. self::getUser (). '*/'. $statement, $driver_options));
    }
}

class xPDOStatement extends PDOStatement {
    private $stmt;
    
    public function __construct (PDOStatement $stmt) {
        $this->stmt = $stmt;
    }
    
    public function __call ($method, $args) {
        return call_user_func_array (array ($this->stmt, $method), $args);
    }
    
    public function bindColumn ($column, &$param, $type = NULL, $maxlen = NULL, $driverdata = NULL) {
        $args = func_get_args ();
        return call_user_func_array (array ($this->stmt, 'bindColumn'), $args);
    }

    public function bindParam ($parameter, &$variable, $data_type = PDO::PARAM_STR, $length = NULL, $driver_options = NULL) {
        $args = func_get_args ();
        return call_user_func_array (array ($this->stmt, 'bindParam'), $args);
    }

    public function bindValue ($parameter, $value, $data_type = PDO::PARAM_STR) {
        $args = func_get_args ();
        return call_user_func_array (array ($this->stmt, 'bindValue'), $args);
    }

    public function closeCursor () {
        return $this->stmt->closeCursor ();
    }
    
    public function columnCount () {
        return $this->stmt->columnCount ();
    }
    
    public function debugDumpParams () {
        return $this->stmt->debugDumpParams ();
    }
    
    public function errorCode () {
        return $this->stmt->errorCode ();
    }
    
    public function errorInfo () {
        return $this->stmt->errorInfo ();
    }
    
    public function fetch ($fetch_style = NULL, $cursor_orientation = PDO::FETCH_ORI_NEXT, $cursor_offset = 0) {
        xPDO::$fqc++;
        $args = func_get_args ();
        return call_user_func_array (array ($this->stmt, 'fetch'), $args);
    }
    
    public function fetchAll ($fetch_style = NULL, $fetch_argument = NULL, $ctor_args = array ()) {
        xPDO::$fqc++;
        $args = func_get_args ();
        return call_user_func_array (array ($this->stmt, 'fetchAll'), $args);
    }
    
    public function fetchColumn ($column_number = 0) {
        xPDO::$fqc++;
        $args = func_get_args ();
        return call_user_func_array (array ($this->stmt, 'fetchColumn'), $args);
    }
    
    public function fetchObject ($class_name = 'stdClass', $ctor_args = NULL) {
        xPDO::$fqc++;
        $args = func_get_args ();
        return call_user_func_array (array ($this->stmt, 'fetchObject'), $args);
    }
    
    public function getAttribute ($attribute) {
        $args = func_get_args ();
        return call_user_func_array (array ($this->stmt, 'getAttribute'), $args);
    }
    
    public function getColumnMeta ($column) {
        $args = func_get_args ();
        return call_user_func_array (array ($this->stmt, 'getColumnMeta'), $args);
    }
    
    public function nextRowset () {
        $this->stmt->nextRowset ();
    }
    
    public function rowCount () {
        return $this->stmt->rowCount ();
    }
    
    public function setAttribute ($attribute, $value) {
        $args = func_get_args ();
        return call_user_func_array (array ($this->stmt, 'setAttribute'), $args);
    }
    
    public function setFetchMode ($mode, $params = NULL) {
        $args = func_get_args ();
        return call_user_func_array (array ($this->stmt, 'setFetchMode'), $args);
    }
    
    public function execute ($input_parameters = NULL) {
        xPDO::$eqc++;
        $args = func_get_args ();
        return call_user_func_array (array ($this->stmt, 'execute'), $args);
    }
}

/*
 * Connector for databases (master if configured for replication)
 */
final class DBD {
    private static  $c = array (),
                    $curr = 0;

    const FORMAT_DATE = 'Y-m-d',
          FORMAT_TIME = 'H:i:s',
          FORMAT_DATETIME = 'Y-m-d H:i:s';

    public static function get ($curr = NULL) {
        if ($curr === NULL) {
            $curr = static::$curr;
        }

        return static::$c[$curr];
    }

//    public static function prepare ($sql) {
//        return static::$c[static::$curr]->prepare ($sql);
//    }
//    
//    public static function query ($sql) {
//        return static::$c[static::$curr]->query ($sql);
//    }
    
    public static function set (PDO $c) {
        static::$c[++static::$curr] = $c;

        return static::$curr;
    }
    
    public static function getCurrentIndex () {
        return static::$curr;
    }
    
    public static function __callStatic ($method, $arguments) {
        return call_user_func_array (array (static::$c[static::$curr], $method), $arguments);
    }
}

?>