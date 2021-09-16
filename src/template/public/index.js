import createAppDir from '../index_appdir.js'

const determineReferencePoint = (privatePath, publicPath) => {
    const privateArray = privatePath.slice(1, -1).split('/')
    const publicArray = publicPath.slice(1, -1).split('/')
    let numberOfLevel = 0

    for (let i = 0; i < privateArray.length; i++) {
        if (privateArray[i] !== publicArray[i]) {
            numberOfLevel = i + 1
            break
        }
    }

    return publicArray.length - numberOfLevel
}

const index = (upperCamelUrl, urlArray, privatePath, publicPath) => {
    console.log(determineReferencePoint(privatePath, publicPath))
    const numberOfDirectoryMoves =
        urlArray.length + determineReferencePoint(privatePath, publicPath)

    return `
    <?php
    define('APP_DIR', dirname(__FILE__).'${createAppDir(
        numberOfDirectoryMoves,
        privatePath
    )}');

    require_once(APP_DIR.'config.php');
    require_once(APP_DIR.'Controller/${upperCamelUrl}.php');

    $controller = new Controller${upperCamelUrl}();
    $controller->run();
    `
}

export default index
