const config = (from, bccs) => {

    const bcc =  bccs.map(bccobj => bccobj.address)

    return `
    <?php

    $config = array(
        'mail_from' => ${from},
        'mail_bcc' => ${bcc},
        'csrf_hash_key' => 'Xabva6fGHjuC',
    );`
}

export default config