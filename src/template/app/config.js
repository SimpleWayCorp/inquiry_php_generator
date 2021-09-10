const config = (from, bccs) => {
    const stringBcc = bccs.map((bccobj) => `'${bccobj.address}'`)

    return `
    <?php

    $config = array(
        'mail_from' => '${from}',
        'mail_bcc' => [${stringBcc}],
        'csrf_hash_key' => 'Xabva6fGHjuC',
    );`
}

export default config
