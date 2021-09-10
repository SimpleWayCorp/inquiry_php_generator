//確認画面部分のhtml作成
const createConfirmForm = (items, relatedIdsItems) => {
    return items.reduce((acc, curr) => {
        let typedInput = ''
        if (curr.type === 'select') {
            typedInput = `<?php echo $contact->choice('${curr.id}', $${curr.id}); ?>`
        } else if (curr.type === 'memo') {
            typedInput = `<?php echo nl2br($${curr.id}); ?>`
        } else if (curr.type === 'checkbox') {
            typedInput = `<?php echo $${curr.id}; ?>`
        } else if (curr.relatedIds[0]) {
            typedInput = relatedIdsItems.reduce((acc, curr, currIndex) => {
                if (relatedIdsItems.length - 1 === currIndex) {
                    acc += `<?php echo $${curr.id}; ?>`
                } else {
                    acc += `<?php echo $${curr.id}; ?> - `
                }
                return acc
            }, '')
        } else {
            typedInput = `<?php echo $${curr.id}; ?>`
        }

        acc += `
		<div class="form-group row">
			<label class="col-sm-2 col-form-label">${curr.label}</label>
			<div class="col-sm-10">
				<div class="my-2">${typedInput}</div>
			</div>
		</div>\n`
        return acc
    }, '')
}

//入力画面部分のhtml作成
const createEnteredForm = (items, relatedIdsItems) => {
    return items.reduce((acc, curr) => {
        let typedInput = ''
        let textMuted = ''
        let requiredVal = curr.rules[0]
            ? curr.rules.find(
                  (rule) => rule === 'required' || rule === 'requiredSelect'
              )
            : '' || ''
        if (requiredVal) textMuted = '<small class="text-muted">(必須)</small>'

        if (curr.type === 'select') {
            typedInput = `
			<select id="${curr.id}" name="${curr.id}" class="form-control">
				<?php foreach ($choices['${curr.id}'] as $key => $value) { ?>
					<option value="<?php echo $key; ?>"<?php if ($key == $${curr.id}) { ?>selected<?php } ?>><?php echo $value; ?></option>
				<?php } ?>
			</select>
			`
        } else if (curr.type === 'memo') {
            typedInput = `<textarea id="${curr.id}" name="${curr.id}" class="form-control" rows="5" ${requiredVal}><?php echo $${curr.id}; ?></textarea>`
        } else if (curr.type === 'checkbox') {
            typedInput = `
			<div class="form-check">
				<input type="checkbox" id="${curr.id}" name="${curr.id}" ${
                curr.to ? 'checked' : ''
            }>
			</div>
			`
        } else if (curr.relatedIds[0]) {
            typedInput = relatedIdsItems.reduce((acc, curr, currIndex) => {
                if (relatedIdsItems.length - 1 !== currIndex) {
                    acc += `
					<input type="text" id="${curr.id}" name="${curr.id}" value="<?php echo $${curr.id}; ?>" class="form-control" placeholder="090" ${requiredVal}>
					<div class="input-group-prepend input-group-apend">
						<div class="input-group-text">-</div>
					</div>
					`
                } else {
                    acc += `
					<input type="text" id="${curr.id}" name="${curr.id}" value="<?php echo $${curr.id}; ?>" class="form-control" placeholder="090" ${requiredVal}>
					</div>`
                }
                return acc
            }, '<div class="input-group">')
        } else if (curr.type === 'text') {
            typedInput = `<input type="text" id="${curr.id}" name="${curr.id}" value="<?php echo $${curr.id}; ?>" class="form-control" placeholder="" ${requiredVal}>`
        }

        acc += `
		<div class="form-group row">
			<label for="name" class="col-sm-3 col-form-label">
				${curr.label}
				${textMuted}
			</label>
			<div class="col-sm-9">
				${typedInput}
			</div>
		</div>\n`
        return acc
    }, '')
}

//relatedIdsが空でない要素を配列で返す
const findIndexes = (items) => {
    let indexes = []
    items.map((item) => {
        if (item.relatedIds[0]) indexes.push(item.id)
    })
    return indexes.length !== 0 ? indexes.splice(1) : []
}

const index = (items) => {
    //relatedIdsが空でないもの
    const relatedIdsItems = items.filter((item) => item.relatedIds[0])

    //itemsのrelatedIdsが空でないものを一つにまとめる
    const formItems = items.filter((item) => {
        const pattern = new RegExp(`${findIndexes(items).join('|')}`)
        return !pattern.test(item.id)
    })

    const hiddenInput = items.reduce((acc, curr) => {
        acc += `<input type="hidden" name="action" value="<?php echo $${curr.id}; ?>">\n`
        return acc
    }, '')
    const confirmForm = createConfirmForm(formItems, relatedIdsItems)
    const enteredForm = createEnteredForm(formItems, relatedIdsItems)

    return `
	<!doctype html>
	<html lang="ja">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
		<title>お問い合わせ</title>
	</head>
	<body>
		<div class="container">
			<h1 class="my-3">お問い合わせ</h1>
	<?php if (!empty($errors)) { ?>
			<div class="alert alert-danger">
				<ul class="mb-0">
	<?php 	foreach ($errors as $messages) { ?>
	<?php 		foreach ($messages as $message) { ?>
					<li><?php echo $message; ?></li>
	<?php 		} ?>
	<?php 	} ?>
				</ul>
			</div>
	<?php } ?>
	
	<?php if ($action == 'complete') { ?>
			<p>
				お問い合わせの送信が完了しました。<br>
				入力されたメールアドレス宛に確認メールを送信いたしましたので、ご確認ください。
			</p>
			<p class="text-center"><a href="/" class="btn btn-primary">ホームに戻る</a></p>
	<?php } else if ($action == 'confirm') { ?>
			<p>下記の内容をご確認の上、送信してください。</p>
			<form action="./" method="post">
				${confirmForm}
				<input type="hidden" name="action" value="complete">
				<input type="hidden" name="token" value="<?php echo $token; ?>">
				${hiddenInput}
				<p class="text-center"><input type="submit" value="送信する" class="btn btn-primary"></p>
			</form>
	<?php } else { ?>
			<p>必要事項をご記入のうえ、「確認画面」ボタンをクリックしてください。</p>
			<form action="./" method="post">
				<input type="hidden" name="action" id="action" value="confirm">
				${enteredForm}
				<p class="text-center"><input type="submit" value="確認画面" class="btn btn-primary"></p>
			</form>
	<?php } ?>
		</div>
	</body>
	</html>
	`
}

export default index
