const subject = `
お問い合わせを受け付けました (<?php echo $contact->choice('subject', $contact->subject); ?>)
`

export default subject
