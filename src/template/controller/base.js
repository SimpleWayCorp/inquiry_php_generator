const base = (urlPath) => {
    return `
<?php

class ControllerBase
{
    var $params = array();

    function run()
    {
        $this->params = $_REQUEST;
        foreach ($this->params as $key => $value) {
            if (is_scalar($value)) {
                $cs = mb_detect_encoding($value, array('UTF-8', 'SJIS', 'EUC-JP', 'JIS', 'ASCII'));
                if ($cs != 'UTF-8')
                {
                    $value = mb_convert_encoding($value, 'UTF-8', $cs);
                }
                $this->params[$key] = $value;
            }
        }
        $action = 'default';
        if (!empty($this->params['action']) && (substr($this->params['action'], 0, 1) !== '_') && method_exists($this, 'action_'.$this->params['action']))
        {
            $action = $this->params['action'];
        }
        $this->{'action_'.$action}();
    }

    function render($template, $data = array())
    {
        $path = APP_DIR.'View${urlPath}'.$template;
        if (is_file($path))
        {
            extract($data);
            require $path;
        }
    }

    function action_default()
    {
    }
}
`
}
export default base
