const urlPath = (upperCamelUrl, path) => {
    return `
    <?php
    
    require_once(APP_DIR.'Controller/Base.php');
    require_once(APP_DIR.'Model/${upperCamelUrl}.php');
    require_once(APP_DIR.'Helper/Csrf.php');
    require_once(APP_DIR.'Helper/Sanitize.php');
    require_once(APP_DIR.'Helper/Validation.php');
    require_once(APP_DIR.'Helper/Mail.php');
    require_once(APP_DIR.'Helper/Template.php');
    class Controller${upperCamelUrl} extends ControllerBase
    {
        function action_default()
        {
            $contact = new Model${upperCamelUrl}();
            $csrf = new HelperCsrf();
            $sanitize = new HelperSanitize();
            $render = array(
                'action' => '',
                'token' => '',
                'contact' => &$contact,
                'errors' => array(),
                'choices' => $contact->choices(),
            );
            $contact->setDefault();
            $contact->assign($this->params);
            $contact->trim();
            $render['token'] = $csrf->generate();
            $render += $contact->toArray();
            $sanitize->html($render);
            $this->render('contact.php', $render);
        }
    
        function action_confirm()
        {
            $contact = new Model${upperCamelUrl}();
            $csrf = new HelperCsrf();
            $sanitize = new HelperSanitize();
            $render = array(
                'action' => '',
                'token' => '',
                'contact' => &$contact,
                'errors' => array(),
                'choices' => $contact->choices(),
            );
            $contact->setDefault();
            $contact->assign($this->params);
            $contact->trim();
            $render['errors'] = $contact->validate();
            if (empty($render['errors'])) {
                $render['action'] = 'confirm';
            }
            $render['token'] = $csrf->generate();
            $render += $contact->toArray();
            $sanitize->html($render);
            $this->render('contact.php', $render);
        }
    
        function action_complete()
        {
            global $config;
            $contact = new Model${upperCamelUrl}();
            $csrf = new HelperCsrf();
            $sanitize = new HelperSanitize();
            $validation = new HelperValidation();
            $mail = new HelperMail();
            $template = new HelperTemplate();
            $render = array(
                'action' => '',
                'token' => '',
                'contact' => &$contact,
                'errors' => array(),
                'choices' => $contact->choices(),
            );
            $contact->setDefault();
            $contact->assign($this->params);
            $contact->trim();
            $render['errors'] = $contact->validate();
            if (empty($this->params['token']) || !$csrf->validate($this->params['token'])) {
                $render['errors']['token'] = array($validation->getMessage('retry'));
            }
            if (empty($render['errors'])) {
                $mail->send(
                    $config['mail_from'],
                    $contact->email,
                    $template->render(APP_DIR.'View${path}mail/subject.php', $render),
                    $template->render(APP_DIR.'View${path}mail/body.php', $render),
                    $config['mail_bcc']
                );
                $csrf->clear();
                $render['action'] = 'complete';
            }
            $render['token'] = $csrf->generate();
            $render += $contact->toArray();
            $sanitize->html($render);
            $this->render('${upperCamelUrl}.php', $render);
        }
    }
    `
}

export default urlPath
