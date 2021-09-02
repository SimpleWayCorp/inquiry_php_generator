const app_dir = (urlArray, privatePath) => {

    return urlArray.reduce((acc) => {
        acc = `../${acc}`
        return acc
    }, `../${privatePath.split("/").splice(3).join("/")}/App`)
}

export default app_dir