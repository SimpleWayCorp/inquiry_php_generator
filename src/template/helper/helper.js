export const csrf = `
<?php

class HelperCsrf
{
    var $namespace = '';
    var $hash_key = '';
    var $lifetime = 300/*secs*/;
    var $onetime = false;

    function __construct($namespace = '') {
        if (!empty($config['csrf_hash_key'])) {
            $this->hash_key = $config['csrf_hash_key'];
        }
        if (empty($this->hash_key)) {
            $this->hash_key = md5(__FILE__);
        }

        session_start();
        $this->namespace = $namespace;
    }

    function HelperCsrf($namespace = '')
    {
        $this->__construct($namespace);
    }

    function initialize()
    {
        if (empty($_SESSION['csrf']) || empty($_SESSION['csrf'][$this->namespace])) {
            $this->clear();
        }
    }

    function clear()
    {
        if (empty($_SESSION['csrf'])) {
            $_SESSION['csrf'] = array();
        }
        $_SESSION['csrf'][$this->namespace] = array(
            'expire' => time(),
            'token' => '',
        );
    }

    function generate()
    {
        $this->initialize();
        if ($this->onetime || empty($_SESSION['csrf'][$this->namespace]['token']) || ($_SESSION['csrf'][$this->namespace]['expire'] < time() + ($this->lifetime / 2))) {
            $_SESSION['csrf'][$this->namespace]['expire'] = time() + $this->lifetime;
            $_SESSION['csrf'][$this->namespace]['token'] = sha1($_SESSION['csrf'][$this->namespace]['expire'].$this->hash_key);
        }

        return $_SESSION['csrf'][$this->namespace]['token'];
    }

    function validate($token) {
        $result = false;

        $this->initialize();
        $result = $_SESSION['csrf'][$this->namespace]['token'] === $token;

        return $result;
    }
}
`

export const mail = `
<?php

class HelperMail
{
    function send($from, $to, $subject, $body, $bcc = null)
    {
        $headers = array(
            'From: '.$from,
            'Bcc: '.implode(',', (array)$bcc),
        );
        $parameter = '-f '.$from;
        mb_language('Japanese');
        mb_internal_encoding('UTF-8');
        mb_send_mail($to, $subject, $body, implode("\n", $headers), $parameter);
    }
}
`

export const sanitize = `
<?php

class HelperSanitize
{
    function html(&$data)
    {
        function escapeRecursive(&$arr)
        {
            foreach ($arr as $key => $value) {
                if (is_string($value)) {
                    $arr[$key] = htmlspecialchars($value, ENT_QUOTES);
                } else if (is_array($value)) {
                    escapeRecursive($arr[$key]);
                }
            }
        }
        if (!empty($data)) {
            escapeRecursive($data);
        }
    }
}
`

export const template = `
<?php

class HelperTemplate
{
    function render($path, $data = array())
    {
        if (is_file($path)) {
            extract($data);
            ob_start();
            require $path;
            return ob_get_clean();
        }
    }
}
`

export const validation = `
<?php

class HelperValidation
{
    var $messages = array(
        'required' => '%sを入力してください。',
        'requiredSelect' => '%sを選択してください。',
        'length' => '%sは%d文字以下で入力してください。',
        'email' => '%sは正しい形式で入力してください。',
        'url' => '%sは正しい形式で入力してください。',
        'digit' => '%sは数字で入力してください。',
        'integer' => '%sは整数で入力してください。',
        'numberMin' => '%sは%d以上の値を入力してください。',
        'numberMax' => '%sは%d以下の値を入力してください。',
        'equal' => '%sは%sを入力してください。',
        'retry' => 'もう一度フォームを送信しなおしてください。',
    );

    function _usort($a, $b) { return strlen($b) - strlen($a); }

    function validate($name, $arguments)
    {
        $result = '';
        $methods = get_class_methods($this);

        usort($methods, array($this, '_usort'));
        foreach ($methods as $method) {
            if (strncmp(strtolower($name), strtolower($method), strlen($method)) === 0) {
                $callee = substr($name, 0, strlen($method));
                $args = explode('|', substr($name, strlen($method) + 1));
                $result = call_user_func_array(array($this, $callee), array_merge($arguments, $args));
                break;
            }
        }

        return $result;
    }

    function required($model, $property, $label)
    {
        $result = '';

        if (!isset($model->{$property}) || ($model->{$property} === '')) {
            $result = sprintf($this->messages['required'], $label);
        }

        return $result;
    }

    function requiredWith($model, $property, $label, $with)
    {
        $result = '';
        $check = false;
        $withs = func_get_args();

        array_shift($withs);
        array_shift($withs);
        array_shift($withs);
        foreach ($withs as $w) {
            $check |= (isset($model->{$w}) && ($model->{$w} !== ''));
        }
        if ($check && (!isset($model->{$property}) || ($model->{$property} === ''))) {
            $result = sprintf($this->messages['required'], $label);
        }

        return $result;
    }

    function requiredSelect($model, $property, $label)
    {
        $result = '';

        if (!isset($model->{$property}) || empty($model->{$property})) {
            $result = sprintf($this->messages['requiredSelect'], $label);
        }

        return $result;
    }

    function length($model, $property, $label, $length)
    {
        $result = '';

        if (isset($model->{$property}) && ($model->{$property} !== '') && ($length < mb_strlen($model->{$property}))) {
            $result = sprintf($this->messages['length'], $label, $length);
        }

        return $result;
    }

    function email($model, $property, $label)
    {
        $result = '';

        if (isset($model->{$property}) && ($model->{$property} !== '') && ((strpos($model->{$property}, '@') === false) || (strpos($model->{$property}, '.') === false))) {
            $result = sprintf($this->messages['email'], $label);
        }

        return $result;
    }

    function url($model, $property, $label)
    {
        $result = '';

        if (isset($model->{$property}) && ($model->{$property} !== '') && !preg_match('/^(http|https):\\/\\/([A-Z0-9][A-Z0-9_-]*(?:\\.[A-Z0-9][A-Z0-9_-]*)+):?(\\d+)?\\/?/i', $model->{$property})) {
            $result = sprintf($this->messages['url'], $label);
        }

        return $result;
    }

    function digit($model, $property, $label)
    {
        $result = '';

        if (isset($model->{$property}) && ($model->{$property} !== '') && !ctype_digit($model->{$property})) {
            $result = sprintf($this->messages['integer'], $label);
        }

        return $result;
    }

    function integer($model, $property, $label)
    {
        $result = '';

        if (isset($model->{$property}) && ($model->{$property} !== '') && !preg_match('/^0$|^-?[1-9][0-9]*$/', $model->{$property})) {
            $result = sprintf($this->messages['integer'], $label);
        }

        return $result;
    }

    function numberMin($model, $property, $label, $min)
    {
        $result = '';

        if (isset($model->{$property}) && ($model->{$property} !== '') && is_numeric($model->{$property}) && ($model->{$property} < $min)) {
            $result = sprintf($this->messages['numberMin'], $label, $min);
        }

        return $result;
    }

    function numberMax($model, $property, $label, $max)
    {
        $result = '';

        if (isset($model->{$property}) && ($model->{$property} !== '') && is_numeric($model->{$property}) && ($max < $model->{$property})) {
            $result = sprintf($this->messages['numberMax'], $label, $max);
        }

        return $result;
    }

    function equal($model, $property, $label, $value)
    {
        $result = '';

        if (isset($model->{$property}) && ($model->{$property} !== '') && ($model->{$property} == $value)) {
            $result = sprintf($this->messages['equal'], $label, $value);
        }

        return $result;
    }

    function getMessage($name)
    {
        $result = '';

        if (isset($this->messages[$name])) {
            $result = $this->messages[$name];
        }

        return $result;
    }
}
`
