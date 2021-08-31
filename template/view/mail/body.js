const body = `
------------------------------------------------------------
このメールはプログラムから自動送信されています。
------------------------------------------------------------


この度はお問い合わせをいただき、誠にありがとうございます。
以下はフォームから送信した内容です。

------------------------------------------------------------
●<?php echo $contact->caption('subject'); ?>

<?php echo $contact->choice('subject', $contact->subject); ?>


●<?php echo $contact->caption('name'); ?>

<?php echo $contact->name; ?>


●<?php echo $contact->caption('email'); ?>

<?php echo $contact->email; ?>


●<?php echo $contact->caption('telephone_h'); ?>

<?php echo $contact->telephone_h; ?>-<?php echo $contact->telephone_m; ?>-<?php echo $contact->telephone_l; ?>


●<?php echo $contact->caption('content'); ?>

<?php echo $contact->content; ?>


-- 
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
http://contact.ti.dev.com.simple-way.jp/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`

export default body