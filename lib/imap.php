<?php

class ImapReader {

    private $host;
    private $port;
    private $user;
    private $pass;
    private $folder;
    private $box;
    private $box_list;
    private $errors;
    private $connected;
    private $list;
    private $deleted;

    const FROM = 0;
    const TO = 1;
    const REPLY_TO = 2;
    const SUBJECT = 3;
    const CONTENT = 4;
    const ATTACHMENT = 5;

    public function __construct($host = null, $port = '143', $user = null, $pass = null, $folder = 'INBOX') {
        $this->host = $host;
        $this->port = $port;
        $this->user = $user;
        $this->pass = $pass;
        $this->folder = $folder;
        $this->box = null;
        $this->box_list = null;
        $this->errors = array();
        $this->connected = false;
        $this->list = null;
        $this->deleted = false;
    }
    public function __destruct() {
        if ($this->isConnected()) {
            $this->disconnect();
        }
    }
    public function changeServer($host = null, $port = '143', $user = null, $pass = null) {
        if ($this->isConnected()) {
            $this->disconnect();
        }
        $this->host = $host;
        $this->port = $port;
        $this->user = $user;
        $this->pass = $pass;
        $this->box_list = null;
        $this->errors = array();
        $this->list = null;
        return $this;
    }
    public function canConnect() {
        return (($this->connected == false) && (is_string($this->host)) && (!empty($this->host)) && (is_numeric($this->port)) && ($this->port >= 1) && ($this->port <= 65535) && (is_string($this->user)) && (!empty($this->user)) && (is_string($this->pass)) && (!empty($this->pass)));
    }
    public function connect() {
        if ($this->canConnect()) {
            $cert = 'ssl';
            $this->box = @imap_open("{{$this->host}:{$this->port}/{$cert}/novalidate-cert}{$this->folder}", $this->user, $this->pass);
            if ($this->box !== false) {
                $this->_connected();
            } else {
                $this->errors = array_merge($this->errors, imap_errors());
            }
        }
        return $this;
    }
    public function getQuota(){
        if (!$this->isConnected()) return false;
        return imap_mailboxmsginfo($this->box);
    }
    public function imapCheck() {
        if (!$this->isConnected()) return false;
        return imap_check($this->box);
    }
    public function fetchOverview($from, $to) {
        if (!$this->isConnected()) return false;
        $test = imap_reopen($this->box, "{$this->user}");
        if (!$test) return false;
        $msgs = imap_fetch_overview($this->box, ($from.':'.$to));
        if ($msgs) {
            $cnt = 0;
            foreach ($msgs as $id) {
                $this->list[$cnt] = $this->_fetchHeader($this->user, $id->msgno);
                $this->list[$cnt]->seenFlag = $id->seen;
                $cnt++;
            }
        }
        return true;
    }
    public function mailList( $reverse = FALSE ) {
        foreach ( $this->list as $k => $v ) $this->list[$k] = $this->fetch($v);
        if( $reverse ) $this->list = array_reverse( (array) $this->list );
        return $this->list;
    }
    public function boxList() {
        if (is_null($this->box_list)) {
            $list = imap_getmailboxes($this->box, "{{$this->host}:{$this->port}}", "*");
            $this->box_list = array();
            foreach ($list as $box) {
                $this->box_list[] = $box->name;
            }
        }
        return $this->box_list;
    }
    public function searchCriteriaCount($criteria) {
        if ($this->isConnected()) {
            $msgs = imap_search($this->box, $criteria);
            if ($msgs) { 
                $this->disconnect();
                return count($msgs); 
            }
        }
        return false;
    }
    public function fetchCountAllHeaders($mbox) {
        if ($this->isConnected()) {
            $test = imap_reopen($this->box, "{$mbox}");
            if (!$test) {
                return false;
            }
            $num_msgs = imap_num_msg($this->box);
            return $num_msgs;
        }
        return false;
    }
    public function fetchAllHeaders($mbox) {
        $num_msgs = $this->fetchCountAllHeaders($mbox);
        if ($num_msgs) {
            $this->list = array();
            for ($id = 1; ($id <= $num_msgs); $id++) {
                $this->list[] = $this->_fetchHeader($mbox, $id);
            }
            return true;
        }
        return false;
    }
    public function fetchSearchHeaders($mbox, $criteria) {
        if ($this->isConnected()) {
            $test = imap_reopen($this->box, "{$mbox}");
            if (!$test) {
                return false;
            }
            $msgs = imap_search($this->box, $criteria);
            if ($msgs) {
                foreach ($msgs as $id) {
                    $this->list[] = $this->_fetchHeader($mbox, $id);
                }
            }
            return true;
        }
        return false;
    }
    public function isConnected() {
        return $this->connected;
    }
    public function disconnect() {
        if ($this->connected) {
            if ($this->deleted) {
                imap_expunge($this->box);
                $this->deleted = false;
            }
            imap_close($this->box);
            $this->connected = false;
            $this->box = null;
        }
        return $this;
    }
    /**
     * Took from khigashi dot oang at gmail dot com at php.net
     * with replacement of ereg family functions by preg's ones.
     *
     * @param string $str
     * @return string
     */
    private function _fix($str) {
        if (preg_match("/=\?.{0,}\?[Bb]\?/", $str)) {
            $str = preg_split("/=\?.{0,}\?[Bb]\?/", $str);
            while (list($key, $value) = each($str)) {
                if (preg_match("/\?=/", $value)) {
                    $arrTemp = preg_split("/\?=/", $value);
                    $arrTemp[0] = base64_decode($arrTemp[0]);
                    $str[$key] = join("", $arrTemp);
                }
            }
            $str = join("", $str);
        }

        if (preg_match("/=\?.{0,}\?Q\?/", $str)) {
            $str = quoted_printable_decode($str);
            $str = preg_replace("/=\?.{0,}\?[Qq]\?/", "", $str);
            $str = preg_replace("/\?=/", "", $str);
        }
        return trim($str);
    }
    private function _connected() {
        $this->connected = true;
        return $this;
    }
    public function getErrors() {
        $errors = $this->errors;
        $this->errors = array();
        return $errors;
    }
    public function count() {
        if (is_null($this->list)) {
            return 0;
        }
        return count($this->list);
    }
    public function get($nbr = null) {
        if (is_null($nbr)) {
            return $this->list;
        }
        if ((is_array($this->list)) && (isset($this->list[$nbr]))) {
            return $this->list[$nbr];
        }
        return null;
    }
    public function fetch($nbr = null) {
        return $this->_callById('_fetch', $nbr);
    }
    private function _fetchHeader($mbox, $id) {
        $header = imap_header($this->box, $id);
        if (!is_object($header)) {
            continue;
        }
        $mail = new stdClass();
        $mail->id = $id;
        $mail->mbox = $mbox;
        $mail->timestamp = (isset($header->udate)) ? ($header->udate) : ('');
        $mail->date = date("d/m/Y H:i:s", (isset($header->udate)) ? ($header->udate) : (''));
        $mail->from = $this->_fix(isset($header->fromaddress) ? ($header->fromaddress) : (''));
        $mail->to = $this->_fix(isset($header->toaddress) ? ($header->toaddress) : (''));
        $mail->reply_to = $this->_fix(isset($header->reply_toaddress) ? ($header->reply_toaddress) : (''));
        // $mail->subject = $this->_fix(isset($header->subject) ? ($header->subject) : (''));
        $mail->subject = mb_decode_mimeheader($header->subject);
        $mail->content = array();
        $mail->attachments = array();
        $mail->deleted = false;
        return $mail;
    }
    public function seenMSG($param) {
        imap_body($this->box, $param) or die(imap_last_error());
    }
    public function moveMSGtoFolder($param, $folder) {
        imap_mail_move($this->box, $param, $folder) or die(imap_last_error());
        $this->deleted = true;
    }
    public function renameFolder($old_mbox, $new_mbox) {
        imap_renamemailbox($this->box, "{{$this->host}:{$this->port}}".$old_mbox, "{{$this->host}:{$this->port}}".$new_mbox) or die(imap_last_error());
    }
    public function createFolder($new_mbox) {
        imap_createmailbox($this->box, "{{$this->host}:{$this->port}}".$new_mbox) or die(imap_last_error());
    }
    private function _fetch($mail) {
        $test = imap_reopen($this->box, "{$mail->mbox}");
        if (!$test) {
            return $mail;
        }
        $structure = imap_fetchstructure($this->box, $mail->id);
        if ((!isset($structure->parts)) || (!is_array($structure->parts))) {
            $body = imap_body($this->box, $mail->id, FT_PEEK);
            $content = new stdClass();
            $content->type = 'content';
            $content->mime = $this->_fetchType($structure);
            $content->charset = $this->_fetchParameter($structure->parameters, 'charset');
            $content->data = $this->_decode($body, $structure->encoding);
            $content->size = strlen($content->data);
            $mail->content[] = $content;
            return $mail;
        } else {
            $parts = $this->_fetchPartsStructureRoot($mail, $structure);
            foreach ($parts as $part) {
                $content = new stdClass();
                $content->type = null;
                $content->data = null;
                $content->mime = $this->_fetchType($part->data);
                if ((isset($part->data->disposition)) && ((strcmp('attachment', STR::charcase($part->data->disposition, STR::CASE_LOWER)) == 0) || (strcmp('inline', STR::charcase($part->data->disposition, STR::CASE_LOWER)) == 0))) {
                    $content->type = $part->data->disposition;
                    $content->name = null;
                    if (isset($part->data->dparameters)) {
                        $content->name = $this->_fetchParameter($part->data->dparameters, 'filename');
                    }
                    if (is_null($content->name)) {
                        if (isset($part->data->parameters)) {
                            $content->name = $this->_fetchParameter($part->data->parameters, 'name');
                        }
                    }
                    $mail->attachments[] = $content;
                } else if ($part->data->type == 0) {
                    $content->type = 'content';
                    $content->charset = null;
                    if (isset($part->data->parameters)) {
                        $content->charset = $this->_fetchParameter($part->data->parameters, 'charset');
                    }
                    $mail->content[] = $content;
                }
                $body = imap_fetchbody($this->box, $mail->id, $part->no, FT_PEEK);
                if (isset($part->data->encoding)) {
                    $content->data = $this->_decode($body, $part->data->encoding);
                } else {
                    $content->data = $body;
                }
                $content->size = strlen($content->data);
            }
        }
        return $mail;
    }
    private function _fetchPartsStructureRoot($mail, $structure) {
        $parts = array();
        if ((isset($structure->parts)) && (is_array($structure->parts)) && (count($structure->parts) > 0)) {
            foreach ($structure->parts as $key => $data) {
                $this->_fetchPartsStructure($mail, $data, ($key + 1), $parts);
            }
        }
        return $parts;
    }
    private function _fetchPartsStructure($mail, $structure, $prefix, &$parts) {
        if ((isset($structure->parts)) && (is_array($structure->parts)) && (count($structure->parts) > 0)) {
            foreach ($structure->parts as $key => $data) {
                $this->_fetchPartsStructure($mail, $data, $prefix . "." . ($key + 1), $parts);
            }
        }

        $part = new stdClass;
        $part->no = $prefix;
        $part->data = $structure;

        $parts[] = $part;
    }
    private function _fetchParameter($parameters, $key) {
        foreach ($parameters as $parameter) {
            if (strcmp($key, STR::charcase($parameter->attribute, STR::CASE_LOWER)) == 0) {
                return $parameter->value;
            }
        }
        return null;
    }
    private function _fetchType($structure) {
        $primary_mime_type = array("TEXT", "MULTIPART", "MESSAGE", "APPLICATION", "AUDIO", "IMAGE", "VIDEO", "OTHER");
        if ((isset($structure->subtype)) && ($structure->subtype) && (isset($structure->type))) {
            return $primary_mime_type[(int) $structure->type] . '/' . $structure->subtype;
        }
        return "TEXT/PLAIN";
    }
    private function _decode($message, $coding) {
        switch ($coding) {
            case 2:
                $message = imap_binary($message);
                break;
            case 3:
                $message = imap_base64($message);
                break;
            case 4:
                $message = imap_qprint($message);
                break;
            case 5:
                break;
            default:
                break;
        }
        return $message;
    }
    private function _callById($method, $data) {
        $callback = array($this, $method);
        if (is_null($data)) {
            $result = array();
            foreach ($this->list as $mail) {
                $result[] = $this->_callById($method, $mail);
            }
            return $result;
        }
        if (is_array($data)) {
            $result = array();
            foreach ($data as $elem) {
                $result[] = $this->_callById($method, $elem);
            }
            return $result;
        }
        if ((is_object($data)) && ($data instanceof stdClass) && (isset($data->id))) {
            return call_user_func($callback, $data);
        }
        if (($this->isConnected()) && (is_array($this->list)) && (is_numeric($data))) {
            foreach ($this->list as $mail) {
                if ($mail->id == $data) {
                    return call_user_func($callback, $mail);
                }
            }
        }
        return null;
    }
    public function delete($nbr) {
        $this->_callById('_delete', $nbr);
        return;
    }
    private function _delete($mail) {
        if ($mail->deleted == false) {
            $test = imap_reopen($this->box, "{$mail->mbox}");
            if ($test) {
                $this->deleted = true;
                imap_delete($this->box, $mail->id);
                $mail->deleted = true;
            }
        }
    }
    public function searchBy($pattern, $type) {
        $result = array();
        if (is_array($this->list)) {
            foreach ($this->list as $mail) {
                $match = false;
                switch ($type) {
                    case self::FROM:
                        $match = $this->_match($mail->from, $pattern);
                        break;
                    case self::TO:
                        $match = $this->_match($mail->to, $pattern);
                        break;
                    case self::REPLY_TO:
                        $match = $this->_match($mail->reply_to, $pattern);
                        break;
                    case self::SUBJECT:
                        $match = $this->_match($mail->subject, $pattern);
                        break;
                    case self::CONTENT:
                        foreach ($mail->content as $content) {
                            $match = $this->_match($content->data, $pattern);
                            if ($match) {
                                break;
                            }
                        }
                        break;
                    case self::ATTACHMENT:
                        foreach ($mail->attachments as $attachment) {
                            $match = $this->_match($attachment->name, $pattern);
                            if ($match) {
                                break;
                            }
                        }
                        break;
                }
                if ($match) {
                    $result[] = $mail;
                }
            }
        }
        return $result;
    }
    private function _nmatch($string, $pattern, $a, $b) {
        if ((!isset($string[$a])) && (!isset($pattern[$b]))) {
            return 1;
        }
        if ((isset($pattern[$b])) && ($pattern[$b] == '*')) {
            if (isset($string[$a])) {
                return ($this->_nmatch($string, $pattern, ($a + 1), $b) + $this->_nmatch($string, $pattern, $a, ($b + 1)));
            } else {
                return ($this->_nmatch($string, $pattern, $a, ($b + 1)));
            }
        }
        if ((isset($string[$a])) && (isset($pattern[$b])) && ($pattern[$b] == '?')) {
            return ($this->_nmatch($string, $pattern, ($a + 1), ($b + 1)));
        }
        if ((isset($string[$a])) && (isset($pattern[$b])) && ($pattern[$b] == '\\')) {
            if ((isset($pattern[($b + 1)])) && ($string[$a] == $pattern[($b + 1)])) {
                return ($this->_nmatch($string, $pattern, ($a + 1), ($b + 2)));
            }
        }
        if ((isset($string[$a])) && (isset($pattern[$b])) && ($string[$a] == $pattern[$b])) {
            return ($this->_nmatch($string, $pattern, ($a + 1), ($b + 1)));
        }
        return 0;
    }
    private function _match($string, $pattern) {
        return $this->_nmatch($string, $pattern, 0, 0);
    }
}

class ImapFetch {
    const
        ERROR_INN = 0x0001,            // 1
        ERROR_PREAPPROVE = 0x0002,         // 2
        ERROR_NAME = 0x0004,           // 4
        ERROR_EMAIL = 0x0008,          // 8
        ERROR_GARANTIYA_SUMM = 0x0010,      // 16
//        ERROR_ = 0x0020,           // 32
//        ERROR_ = 0x0040,        // 64
        ERROR_PHONE = 0x0080,          // 128
        ERROR_PHONE_PARTNER = 0x0100,         // 256
//        ERROR_ = 0x0200,         // 512
//        ERROR_ = 0x0400,    // 1024
//        ERROR_ = 0x0800, // 2048
        ERROR_DUPLICATE = 0x1000,      // 4096
//        ERROR_ = 0x2000,   // 8192
//        ERROR_ = 0x4000,        // 16384

        FOLDER_STATE_ACTIVE = 0,
        FOLDER_STATE_DISSABLE = 1,

        FETCH_STATE_NEW = 0,
        FETCH_STATE_OK = 1,
        FETCH_STATE_ERROR = 2;

    public static $email = array();

    private static $rules = array();
    private static $folder_state = array();
    private static $fetch_state = array();
    private static $callbacks = array();

    public static function getErrors($errCode = 0) {
        if($errCode == 0) return FALSE;
        $err = array();
        if($errCode & self::ERROR_INN) $err[] = 'Невірний ІПН/ЄДРПОУ';
        if($errCode & self::ERROR_PREAPPROVE) $err[] = 'Preapprove';
        if($errCode & self::ERROR_NAME) $err[] = 'Невірне І\'мя';
        if($errCode & self::ERROR_EMAIL) $err[] = 'Невірний email';
        if($errCode & self::ERROR_PHONE) $err[] = 'Невірний номер телефону';
        if($errCode & self::ERROR_PHONE_PARTNER) $err[] = 'Невірний номер телефону партнера';
        if($errCode & self::ERROR_DUPLICATE) $err[] = 'Дубликат';
        if($errCode & self::ERROR_GARANTIYA_SUMM) $err[] = 'Сумма гарантії > 150к';
        if(empty($err)) return FALSE;
        return $err;
    }

    public static function updateFlag($emailID = NULL, $state = 0, $error = 0){
        if(!is_null($emailID) && is_int($emailID)) {
            $q = DBD::get (1)->prepare ('UPDATE `sb_imap_fetch` SET `state` = ?, `error` = ? WHERE `id` = ?');
            $q->execute (array($state, $error, $emailID)) or CLI::report(CLI::SCRIPT. ' ImapFetch.updateFlag: Error Update '. vsprintf ('[%s][%s] %s', $q->errorInfo ()));
        } else {
            CLI::report(CLI::SCRIPT. ' ImapFetch.updateFlag: Invalide email ID!');
        }
    }

    public static function setRules($ruleID = NULL, $function) {
        if(is_array($ruleID)) {
            $err = TRUE;
            foreach ($ruleID as $value) {
                if(is_int($value)) {
                    if($err === TRUE) $err = FALSE;
                    self::$rules[] = (string)$value;
                    self::$callbacks[(string)$value] = $function;
                }
            }
            if($err === TRUE) CLI::report(CLI::SCRIPT. ' ImapFetch.setRules: Invalide array with rule ID!');
        } else {
            if (is_null($ruleID) || !is_int($ruleID)) {
                CLI::report(CLI::SCRIPT. ' ImapFetch.setRules: Invalide rule ID!');
            }
            if (!is_callable ($function) ) {
                CLI::report(CLI::SCRIPT. ' ImapFetch.setRules: Function is not callable!');
            }
            self::$rules[] = (string)$ruleID;
            self::$callbacks[(string)$ruleID] = $function;
        }
    }

    public static function parse() {
        if (empty(self::$rules) ) {
            CLI::report(CLI::SCRIPT. ' ImapFetch.parse: No processing rules!');
        }
        $q = DBD::get (1)->prepare ('
                    SELECT `sb_imap_fetch`.*, `sb_imap_rule`.`id` as `rule` FROM `sb_imap_rule`
                    INNER JOIN `sb_imap_folder` ON `sb_imap_folder`.`id` = `sb_imap_rule`.`folder`
                    INNER JOIN `sb_imap_fetch` ON `sb_imap_fetch`.`folder` = `sb_imap_folder`.`id`
                    WHERE `sb_imap_rule`.`id` IN ('.implode(',',self::$rules).') AND `sb_imap_fetch`.`subject` LIKE `sb_imap_rule`.`subject`
                    AND `sb_imap_folder`.`state` = 0
                    AND `sb_imap_fetch`.`state` = 0
                ');
        $q->execute () or CLI::report(CLI::SCRIPT. ' ImapFetch.parse: Error Select '. vsprintf ('[%s][%s] %s', $q->errorInfo ()));
        $Email = $q->fetchAll ();
        self::$email = $Email;
        echo 'Find emails '.count($Email).' !'.PHP_EOL;
        foreach ($Email as $email){
            self::$email = $email;
            call_user_func (self::$callbacks[$email->rule]);
        }
    }
}