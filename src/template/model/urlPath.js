const urlPath = (upperCamelUrl, items) => {
    const columns = items.reduce((acc, curr) => {
        let dataType = '$this->COLUMN_TYPE_SMALLINT'
        let defaultVal = "''"
        let choices = ''
        let relatedRule = ''
        const relatedIds = curr.relatedIds.map((relatedId) => relatedId)

        if (curr.type === 'select') {
            dataType = '$this->COLUMN_TYPE_SMALLINT'
            defaultVal = '0'
            choices = `'choices' => array(${curr.choices.map(
                (choice) => `'${choice}'`
            )}),`
        }
        if (curr.type === 'text') {
            dataType = '$this->COLUMN_TYPE_CHAR'
        }
        if (curr.type === 'memo') {
            dataType = '$this->COLUMN_TYPE_CLOB'
        }

        if (relatedIds[0]) {
            relatedRule = `, 'requiredWith|${relatedIds.join('|')}'`
        }

        acc += `
        '${curr.id}' => array(
            'data_type' => ${dataType},
            'label' => '${curr.label}',
            'caption' => '${curr.label}',
            'default' => ${defaultVal},
            'rule' => array(${curr.rules.map(
                (rule) => `'${rule}'`
            )}${relatedRule}),
            ${choices}
        ),\n`

        return acc
    }, '')

    return `
    <?php
    
    require_once(APP_DIR.'Model/Base.php');
    
    class Model${upperCamelUrl} extends ModelBase
    {
        function __construct()
        {
            $this->columns = array(
                ${columns}
            );
        }
    
        function Model${upperCamelUrl}()
        {
            $this->__construct();
        }
    }`
}

export default urlPath
