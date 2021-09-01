const index = (items) => {
	console.log(items)

	//type=hiddenのinput
	const hiddenInput = items.reduce((acc, curr) => {
		acc += `<input type="hidden" name="action" value="<?php echo $${curr.id}; ?>">\n`
		return acc
	}, "")

	//relatedIdsが空でないもの
	const relatedIdsItems = items.filter(item => {
		return item.relatedIds.length
	})

	//relatedIdsが空でない要素を配列で返す
	const findIndexes = (items) => {
		let indexes = []
		items.map((item) => {
			if(item.relatedIds[0]) indexes.push(item.id)
		})
		return indexes.splice(1)
	}
	console.log(findIndexes(items))

	//itemsのrelatedIdsが空でないものを一つにまとめる
	const formItems = items.filter(item => {
		const pattern = new RegExp(findIndexes(items).join("|"))
		return !pattern.test(item.id)
	})
	console.log(formItems)


	const formGroup = formItems.reduce((acc, curr) => {
		let typedInput = ""
		if(curr.type==="select"){
			typedInput += `<?php echo $contact->choice('${curr.id}', $${curr.id}); ?>`
		}else if(curr.type==="memo"){
			typedInput += `<?php echo nl2br($${curr.id}); ?>`
		}else if(curr.type==="checkbox"){
			typedInput += `<?php echo $${curr.id}; ?>`
		}else if(curr.relatedIds.length!==0){
			typedInput += relatedIdsItems.reduce((acc, curr, currIndex) => {
				if(relatedIdsItems.length-1 === currIndex){
					acc += `<?php echo $${curr.id}; ?>`
				}else{
					acc += `<?php echo $${curr.id}; ?> - `
				}
				return acc
			}, "")
		}else{
			typedInput += `<?php echo $${curr.id}; ?>`
		}

		acc += `
		<div class="form-group row">
			<label class="col-sm-2 col-form-label">${curr.label}</label>
			<div class="col-sm-10">
				<div class="my-2">${typedInput}</div>
			</div>
		</div>\n`
		return acc
	}, "")
	console.log(formGroup)

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
				${formGroup}
				<input type="hidden" name="action" value="complete">
				<input type="hidden" name="token" value="<?php echo $token; ?>">
				${hiddenInput}
				<p class="text-center"><input type="submit" value="送信する" class="btn btn-primary"></p>
			</form>
	<?php } else { ?>
			<p>必要事項をご記入のうえ、「確認画面」ボタンをクリックしてください。</p>
			<form action="./" method="post">
				<input type="hidden" name="action" id="action" value="confirm">
				<div class="form-group row">
					<label for="subject" class="col-sm-3 col-form-label">
						件名
						<small class="text-muted">
							(必須)
						</small>
					</label>
					<div class="col-sm-9">
						<select id="subject" name="subject" class="form-control">
	<?php 	foreach ($choices['subject'] as $key => $value) { ?>
							<option value="<?php echo $key; ?>"<?php if ($key == $subject) { ?>selected<?php } ?>><?php echo $value; ?></option>
	<?php 	} ?>
						</select>
					</div>
				</div>
				<div class="form-group row">
					<label for="name" class="col-sm-3 col-form-label">
						名前
						<small class="text-muted">
							(必須)
						</small>
					</label>
					<div class="col-sm-9">
						<input type="text" id="name" name="name" value="<?php echo $name; ?>" class="form-control" placeholder="山田 太郎" required>
					</div>
				</div>
				<div class="form-group row">
					<label for="email" class="col-sm-3 col-form-label">
						メールアドレス
						<small class="text-muted">
							(必須)
						</small>
					</label>
					<div class="col-sm-9">
						<input type="text" id="email" name="email" value="<?php echo $email; ?>" class="form-control" placeholder="info@example.com" required>
					</div>
				</div>
				<div class="form-group row">
					<label for="telephone_h" class="col-sm-3 col-form-label">
						電話番号
						<small class="text-muted">
							(必須)
						</small>
					</label>
					<div class="col-sm-9">
						<div class="input-group">
							<input type="text" id="telephone_h" name="telephone_h" value="<?php echo $telephone_h; ?>" class="form-control" placeholder="090" required>
							<div class="input-group-prepend input-group-apend">
								<div class="input-group-text">-</div>
							</div>
							<input type="text" id="telephone_m" name="telephone_m" value="<?php echo $telephone_m; ?>" class="form-control" placeholder="0012" required>
							<div class="input-group-prepend input-group-apend">
								<div class="input-group-text">-</div>
							</div>
							<input type="text" id="telephone_l" name="telephone_l" value="<?php echo $telephone_l; ?>" class="form-control" placeholder="3456" required>
						</div>
					</div>
				</div>
				<div class="form-group row">
					<label for="content" class="col-sm-3 col-form-label">
						お問い合わせ内容
						<small class="text-muted">
							(必須)
						</small>
					</label>
					<div class="col-sm-9">
						<textarea id="content" name="content" class="form-control" rows="5" required><?php echo $content; ?></textarea>
					</div>
				</div>
				<p class="text-center"><input type="submit" value="確認画面" class="btn btn-primary"></p>
			</form>
	<?php } ?>
		</div>
	</body>
	</html>
	`
}

export default index