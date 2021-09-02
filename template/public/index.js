import app_dir from "../index_appdir.js"

const index = (upperCamelUrl, urlArray, privatePath) => {
    return  `
    <?php
    define('APP_DIR', dirname(__FILE__).'${app_dir(urlArray, privatePath)}');

    require_once(APP_DIR.'config.php');
    require_once(APP_DIR.'Controller/${upperCamelUrl}.php');

    $controller = new Controller${upperCamelUrl}();
    $controller->run();
    `
}

export default index