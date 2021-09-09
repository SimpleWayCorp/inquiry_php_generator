const buildConfig = (
    name,
    subject,
    from,
    bcc,
    publicPath,
    privatePath,
    urlPath,
    items
) => {
    const stringBcc = bcc.map((bccobj) => `"${bccobj.address}"`)

    return `{
    "name": "${name}",
    "subject": "${subject}",
    "from": "${from}",
    "bcc": [${stringBcc}],
    "publicPath": "${publicPath}",
    "privatePath": "${privatePath}",
    "urlPath": "${urlPath}",
    "items": ${JSON.stringify(items)}
    }`
}

export default buildConfig
