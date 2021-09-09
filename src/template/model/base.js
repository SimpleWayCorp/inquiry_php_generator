const base = `
<?php

require_once(APP_DIR.'Helper/Validation.php');

class ModelBase
{
    /**
      data types
      ref: https://mariadb.com/kb/en/sql-99/sql-data-types/
    */
    var $COLUMN_TYPE_INTEGER                  = 1;
    var $COLUMN_TYPE_SMALLINT                 = 2;
    var $COLUMN_TYPE_NUMERIC                  = 3;
    var $COLUMN_TYPE_DECIMAL                  = 4;
    var $COLUMN_TYPE_FLOAT                    = 5;
    var $COLUMN_TYPE_REAL                     = 6;
    var $COLUMN_TYPE_DOUBLE_PRECISION         = 7;
    var $COLUMN_TYPE_BIT                      = 8;
    var $COLUMN_TYPE_BIT_VARYING              = 9;
    var $COLUMN_TYPE_BLOB                     = 10;
    var $COLUMN_TYPE_CHAR                     = 11;
    var $COLUMN_TYPE_VARCHAR                  = 12;
    var $COLUMN_TYPE_NCHAR                    = 13;
    var $COLUMN_TYPE_NCHAR_VARYING            = 14;
    var $COLUMN_TYPE_CLOB                     = 15;
    var $COLUMN_TYPE_NCLOB                    = 16;
    var $COLUMN_TYPE_DATE                     = 17;
    var $COLUMN_TYPE_TIME                     = 18;
    var $COLUMN_TYPE_TIME_WITH_TIME_ZONE      = 19;
    var $COLUMN_TYPE_TIMESTAMP                = 20;
    var $COLUMN_TYPE_TIMESTAMP_WITH_TIME_ZONE = 21;
    var $COLUMN_TYPE_INTERVAL                 = 22;
    var $COLUMN_TYPE_BOOLEAN                  = 23;
    var $COLUMN_TYPE_BIGINT                   = 32768; // 64bit integer. This data type is not defined in SQL99 but many DB engines have.

    /**
      @var array $columns The table columns
    */
    // $this->columns = array(
    //     'id' => array(
    //         'data_type' => Base::COLUMN_TYPE_INTEGER,
    //         'label' => 'ID',
    //         'caption' => 'ID',
    //         'default' => 0,
    //         'rule' => array('required'),
    //     )
    // );

    //           //
    // Utilities //
    //           //

    /*
     * elete spaces of every CHAR columns for PostgreSQL.
     */
    function trim()
    {
        foreach ($this->columns as $column => $config) {
            if (
                isset($config['data_type']) &&
                ($config['data_type'] === $this->COLUMN_TYPE_CHAR || $config['data_type'] === $this->COLUMN_TYPE_NCHAR) &&
                isset($this->{$column})
            ) {
                $this->{$column} = trim($this->{$column});
            }
        }
    }

    /*
     * Initialise unseted columns by default value.
     */
    function setDefault($ignores = array())
    {
        foreach ($this->columns as $column => $config) {
            if (!isset($ignores[$column]) && !isset($this->{$column})) {
                if (isset($config['default'])) {
                    $this->{$column} = $config['default'];
                } else {
                    $this->{$column} = null;
                }
            }
        }
    }

    /*
     * Correct value of selection columns within choises key.
     */
    function correct($ignores = array())
    {
        foreach ($this->columns as $column => $config) {
            if (!isset($this->{$column})) {
                if (
                    isset($config['choices']) && (
                        !isset($this->{$column}) ||
                        !isset($config['choices'][$this->{$column}])
                    )
                ) {
                    if (isset($config['default'])) {
                        $this->{$column} = $config['default'];
                    } else {
                        $this->{$column} = null;
                    }
                }
            }
        }
    }

    /*
     * Label getter.
     */
    function label($column)
    {
        if (isset($this->columns[$column]['label'])) {
            return $this->columns[$column]['label'];
        } else {
            return false;
        }
    }

    /*
     * Caption getter.
     */
    function caption($column)
    {
        if (isset($this->columns[$column]['caption'])) {
            return $this->columns[$column]['caption'];
        } else {
            return false;
        }
    }

    /*
     * Choices getter.
     */
    function choices($column = null)
    {
        if (is_null($column)) {
            $arr = array();
            foreach ($this->columns as $column => $config) {
                if (isset($this->columns[$column]['choices'])) {
                    $arr[$column] = $this->columns[$column]['choices'];
                }
            }
            return $arr;
       } else {
            if (isset($this->columns[$column]['choices'])) {
                return $this->columns[$column]['choices'];
            } else {
                return array();
            }
        }
    }

    /*
     * Choice value getter.
     */
    function choice($column, $value)
    {
        if (isset($this->columns[$column]['choices'][$value])) {
            return $this->columns[$column]['choices'][$value];
        } else {
            return '';
        }
    }

    /*
     * column exist checker.
     */
    function iscolumn($column)
    {
        return inset($this->columns[$column]);
    }

    /*
     * Copy column values from other model or hash.
     */
    function assign($source, $prefix_source = '', $prefix_mine = '')
    {
        $assign_ignores = array();
        if(isset($this->assign_ignores)) {
            $assign_ignores = $this->assign_ignores;
        }

        if (is_array($source)) {
            foreach ($this->columns as $column => $config) {
                if (empty($assign_ignores[$column])) {
                    $k = $prefix_source.substr($column, strlen($prefix_mine), strlen($column));
                    if (isset($source[$k])) {
                        $this->{$column} = $source[$k];
                    }
                }
            }
        } else {
            foreach ($this->columns as $column => $config) {
                if (empty($assign_ignores[$column])) {
                    $k = $prefix_source.substr($column, strlen($prefix_mine), strlen($column));
                    if (isset($source->{$k})) {
                        $this->{$column} = $source->{$k};
                    }
                }
            }
        }
    }

    /*
     * Return properties as hash.
     */
    function toArray()
    {
        $result = array();

        foreach ($this->columns as $column => $config) {
            if (isset($this->{$column})) {
                $result[$column] = $this->{$column};
            }
        }

        return $result;
    }

    /*
     * Validate properties.
     */
    function validate($ignores = array())
    {
        $result = array();
        $validation = new HelperValidation();

        foreach ($this->columns as $column => $config) {
            if (!isset($ignores[$column]) && !empty($config['rule'])) {
                foreach ($config['rule'] as $rule) {
                    $message = $validation->validate(
                        $rule,
                        array(
                            $this,
                            $column,
                            $config['label']
                        )
                    );
                    if (!empty($message)) {
                        if (empty($result[$column])) {
                            $result[$column] = array();
                        }
                        $result[$column][] = $message;
                    }
                }
            }
        }

        return $result;
    }
}
`
export default base
