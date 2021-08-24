<template>
  <div id="app container">
    <div class="row">
      <div class="form col-lg-6 col-md-8 col-12 mx-auto p-4">
        <div class="row mb-3 form-group">
          <label class="col-5">既存の構成をインポート</label>
          <div class="custom-file col-7">
            <input type="file" class="custom-file-input" id="inputFile">
            <label class="custom-file-label" for="inputFile">Choose file</label>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-5">フォーム名</label>
          <div class="col-7 p-0">
              <input v-model="formName" :class="{ 'is-invalid': errMsgs.hasOwnProperty('formName') }" class="form-control" type="text">
              <span v-if="errMsgs.hasOwnProperty('formName')" class="invalid-feedback">{{ errMsgs.formName }}</span>
              <div class="form-text">※ 半角英数字・ハイフン・アンダースコアのみ</div>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-5">自動返信メール件名</label>
          <div class="col-7 p-0">
              <input v-model="subject" :class="{ 'is-invalid': errMsgs.hasOwnProperty('subject') }" class="form-control" type="text">
              <span v-if="errMsgs.hasOwnProperty('subject')" class="invalid-feedback">{{ errMsgs.subject }}</span>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-5">自動返信メールFROM</label>
          <div class="col-7 p-0">
              <input v-model="from" :class="{ 'is-invalid': errMsgs.hasOwnProperty('from') }" class="form-control" type="text">
              <span v-if="errMsgs.hasOwnProperty('from')" class="invalid-feedback">{{ errMsgs.from }}</span>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-5">自動返信メールBCC</label>
          <div class="col-7 p-0">
            <div v-for="bccObj,index in bcc" :key="bccObj.id" class="mb-3 input-group">
              <input v-model="bccObj.address" :class="{ 'is-invalid': errMsgs.hasOwnProperty(`bcc${index}`) }" class="form-control" type="text">
              <span @click="deleteBcc(index)" v-if="bcc.length!==1" class="btn btn-danger input-group-text">削除</span>
              <span v-if="errMsgs.hasOwnProperty(`bcc${index}`)" class="invalid-feedback">{{ errMsgs[`bcc${index}`] }}</span>
            </div>
            <div class="d-flex justify-content-end">
              <button @click="addBcc" class="btn btn-primary">追加</button>
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-5">ドキュメントルートディレクトリパス</label>
          <div class="col-7 p-0">
              <input v-model="publicPath" :class="{ 'is-invalid': errMsgs.hasOwnProperty('publicPath') }" class="form-control" type="text">
              <span v-if="errMsgs.hasOwnProperty('publicPath')" class="invalid-feedback">{{ errMsgs.publicPath }}</span>
              <div class="form-text">※ 絶対パス</div>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-5">ライブラリディレクトリパス</label>
          <div class="col-7 p-0">
              <input v-model="privatePath" :class="{ 'is-invalid': errMsgs.hasOwnProperty('privatePath') }" class="form-control" type="text">
              <span v-if="errMsgs.hasOwnProperty('privatePath')" class="invalid-feedback">{{ errMsgs.privatePath }}</span>
              <div class="form-text">※ 絶対パス</div>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-5">設置先</label>
          <div class="col-7 p-0">
              <input v-model="urlPath" :class="{ 'is-invalid': errMsgs.hasOwnProperty('urlPath') }" class="form-control" type="text">
              <span v-if="errMsgs.hasOwnProperty('urlPath')" class="invalid-feedback">{{ errMsgs.urlPath }}</span>
              <div class="form-text">※ URLの絶対パス</div>
          </div>
        </div>

        <div class="row mb-5">
          <label class="col-2">項目</label>
          <div class="col-10 p-0">

            <form-item
            v-for="item,index in items"
            :key="item.id"
            :delete-item="deleteItem"
            :item-index="index"
            :propsItems="items"
            :err-msgs="errMsgs"
            :change-heading="changeHeading"
            :change-typedform="changeTypedForm"
            ></form-item>
            {{ items }}

            <div class="d-flex justify-content-center "><button @click="addItem" class="btn btn-primary">項目を追加</button></div>
          </div>
        </div>
        <div class="row">
          <button @click="downLoad" class="btn btn-primary">ダウンロード</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormItem from "./components/FormItem.vue"

export default {
  name: 'App',
  components: {
    FormItem
  },
  data(){
    return {
      check: [],
      formName: null,
      subject: null,
      from: null,
      bcc: [
        { id: 1, address: null },
      ],
      publicPath: null,
      privatePath: null,
      urlPath: null,
      items: [
        {
          id: 1,
          types: [
              { label: "テキスト", value: 1 },
              { label: "メモ", value: 2 },
              { label: "ラジオボタン", value: 3 },
              { label: "チェックボタン", value: 4 },
          ],
          heading: null,
          itemId: null,
          rules: [],
          relatedIds: [],
          maxLength: null,
          minValue: null,
          maxValue: null,
          choices: [],
          to: false
        }
      ],
      errMsgs: {},
      typeValue: 1,
    }
  },
  methods: {
    changeTypedForm(typedForm, index){
      this.items[index].rules = typedForm.rules
      this.items[index].maxLength = typedForm.maxLength
      this.items[index].minValue = typedForm.minValue
      this.items[index].maxValue = typedForm.maxValue
      this.items[index].choices = typedForm.choices
      this.items[index].relatedIds = typedForm.relatedIds
      this.items[index].to = typedForm.to
    },
    changeHeading(index, heading, itemId){
      this.items[index].heading = heading
      this.items[index].itemId = itemId
    },
    addBcc(){
      const newId = this.bcc.slice(-1)[0].id+1
      this.bcc.push({
        id: newId,
        address: ""
      })
    },
    addItem(){
      const newId = this.items.slice(-1)[0].id + 1
      this.items.push({
        id: newId,
        types: [
              { label: "テキスト", value: 1 },
              { label: "メモ", value: 2 },
              { label: "ラジオボタン", value: 3 },
              { label: "チェックボタン", value: 4 },
          ],
          heading: "",
          itemId: "",
      })
    },
    deleteBcc(index){
      this.bcc.splice(index, 1)
    },
    deleteItem(index){
      this.items.splice(index, 1)
    },
    //未入力チェック
    unenteredCheck(checkForm, key){
      if(!checkForm) this.errMsgs[key] = "入力必須です"
    },
    //整数チェック
    integerCheck(checkForm, key){
      const pattern = new RegExp("^[0-9]+$")
      if(!pattern.test(checkForm) && checkForm){
        this.errMsgs[key] = "整数で入力してください"
      }
    },
    //自然数チェック
    naturalNumberCheck(checkForm, key){
      const pattern = new RegExp("^[1-9][0-9]*$")
      if(!pattern.test(checkForm) && checkForm){
        this.errMsgs[key] = "自然数で入力してください"
      }
    },
    //半角英数字チェック（ハイフン、アンダースコアあり）
    halfAlphanumericCheck(checkForm, key){
      const pattern = new RegExp("^[\\w\\-]+$", "g")
      if(!pattern.test(checkForm) && checkForm){
        this.errMsgs[key] = "半角英数字で入力してください"
      }
    },
    //メール形式チェック
    mailCheck(checkForm, key){
      const pattern = new RegExp("^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\\.)+[a-zA-Z]{2,}$", "g")
      if(!pattern.test(checkForm) && checkForm){
        this.errMsgs[key] = "mail形式で入力してください"
      }
    },
    //ディレクトリチェック（/から始まるか）
    directoryCheck(checkForm, key){
      const pattern = new RegExp("^\\/", "g")
      if(!pattern.test(checkForm) && checkForm){
        this.errMsgs[key] = "/から入力してください"
      }
    },
    downLoad(){
      //初期化
      this.errMsgs = {}

      //未入力チェック
      this.unenteredCheck(this.formName, "formName")
      this.unenteredCheck(this.subject, "subject")
      this.unenteredCheck(this.from, "from")
      this.unenteredCheck(this.publicPath, "publicPath")
      this.unenteredCheck(this.privatePath, "privatePath")
      this.unenteredCheck(this.urlPath, "urlPath")

      for(let i=0; i<this.bcc.length; i++){
        this.unenteredCheck(this.bcc[i].address, `bcc${i}`)
      }

      for(let i=0; i<this.items.length; i++){
        this.unenteredCheck(this.items[i].heading, `heading${i}`)
        this.unenteredCheck(this.items[i].itemId, `itemId${i}`)
      }

      //半角英数字チェック
      this.halfAlphanumericCheck(this.formName, "formName")
      for(let i=0; i<this.items.length; i++){
        this.halfAlphanumericCheck(this.items[i].itemId, `itemId${i}`)
      }

      //mail形式チェック
      this.mailCheck(this.subject, "subject")
      this.mailCheck(this.from, "from")
      for(let i=0; i<this.bcc.length; i++){
        this.mailCheck(this.bcc[i].address, `bcc${i}`)
      }

      //ディレクトリチェック
      this.directoryCheck(this.publicPath, "publicPath")
      this.directoryCheck(this.privatePath, "privatePath")
      this.directoryCheck(this.urlPath, "urlPath")

      //項目入力チェック
      for(let i=0; i<this.items.length; i++){
        if(this.items[i].rules.some(rule => rule==="maxLength")){
          this.naturalNumberCheck(this.items[i].maxLength, `maxLength${i}`)
        }

        if(this.items[i].rules.some(rule => rule==="minValue")){
          this.integerCheck(this.items[i].minValue, `minValue${i}`)
        }

        if(this.items[i].rules.some(rule => rule==="maxValue")){
          this.integerCheck(this.items[i].maxValue, `maxValue${i}`)
        }
      }

      if(!Object.keys(this.errMsgs).length){
        alert("download")
      }
    }
  }
}
</script>

<style>
.row, .row .row {
  --bs-gutter-x: 0;
}
</style>
