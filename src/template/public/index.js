import createAppDir from '../index_appdir.js'

const index = (upperCamelUrl, urlArray, privatePath) => {
    return `
    <?php
    define('APP_DIR', dirname(__FILE__).'${createAppDir(
        urlArray,
        privatePath
    )}');

    require_once(APP_DIR.'config.php');
    require_once(APP_DIR.'Controller/${upperCamelUrl}.php');

    $controller = new Controller${upperCamelUrl}();
    $controller->run();
    `
}

export default index
