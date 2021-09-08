const convertItems = (items) => {
    return items.map(item => {
        item.relatedIds = item.relatedIds.map(relatedId => {
            return relatedId.relatedId
        })
        item.choices = item.choices.map(choice => {
            return choice.choice
        })
        return item
    })
}

const buildConfig = (
    name, subject, from, bcc, publicPath,
    privatePath, urlPath, items
) => {

    const stringBcc = bcc.map(bccobj => `"${bccobj.address}"`)

    return `{
    "name": "${name}",
    "subject": "${subject}",
    "from": "${from}",
    "bcc": [${stringBcc}],
    "publicPath": "${publicPath}",
    "privatePath": "${privatePath}",
    "urlPath": "${urlPath}",
    "items": ${JSON.stringify(convertItems([...items]))}
    }`
}

export default buildConfig