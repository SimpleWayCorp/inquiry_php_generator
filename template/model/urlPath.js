const urlPath = (upperCamelUrl) => {
    return `
    <?php
    
    require_once(APP_DIR.'Model/Base.php');
    
    class Model${upperCamelUrl} extends ModelBase
    {
        function __construct()
        {
            $this->columns = array(
                'subject' => array(
                    'data_type' => $this->COLUMN_TYPE_SMALLINT,
                    'label' => '件名',
                    'caption' => '件名',
                    'default' => 0,
                    'rule' => array('requiredSelect'),
                    'choices' => array(
                        '選択してください',
                        'ご意見',
                        'ご感想',
                        'その他',
                    ),
                ),
                'name' => array(
                    'data_type' => $this->COLUMN_TYPE_CHAR,
                    'label' => 'お名前',
                    'caption' => 'お名前',
                    'default' => '',
                    'rule' => array('required'),
                ),
                'email' => array(
                    'data_type' => $this->COLUMN_TYPE_CHAR,
                    'label' => 'メールアドレス',
                    'caption' => 'メールアドレス',
                    'default' => '',
                    'rule' => array('required', 'email'),
                ),
                'telephone_h' => array(
                    'data_type' => $this->COLUMN_TYPE_CHAR,
                    'label' => '電話番号(上桁)',
                    'caption' => '電話番号',
                    'default' => '',
                    'rule' => array('digit', 'requiredWith|telephone_h|telephone_m|telephone_l'),
                ),
                'telephone_m' => array(
                    'data_type' => $this->COLUMN_TYPE_CHAR,
                    'label' => '電話番号(中桁)',
                    'caption' => '電話番号',
                    'default' => '',
                    'rule' => array('digit', 'requiredWith|telephone_h|telephone_m|telephone_l'),
                ),
                'telephone_l' => array(
                    'data_type' => $this->COLUMN_TYPE_CHAR,
                    'label' => '電話番号(下桁)',
                    'caption' => '電話番号',
                    'default' => '',
                    'rule' => array('digit', 'requiredWith|telephone_h|telephone_m|telephone_l'),
                ),
                'content' => array(
                    'data_type' => $this->COLUMN_TYPE_CLOB,
                    'label' => 'お問い合わせ内容',
                    'caption' => 'お問い合わせ内容',
                    'default' => '',
                    'rule' => array('required'),
                ),
            );
        }
    
        function Model${upperCamelUrl}()
        {
            $this->__construct();
        }
    }`
}

export default urlPath