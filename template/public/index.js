const index = (upperCamelUrl) => {
    return  `
    <?php
    define('APP_DIR', dirname(__FILE__).'/../private/App/');

    require_once(APP_DIR.'config.php');
    require_once(APP_DIR.'Controller/${upperCamelUrl}.php');

    $controller = new Controller${upperCamelUrl}();
    $controller->run();
    `
}

export default index