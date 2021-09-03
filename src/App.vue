<template>
  <div id="app container">
    <div class="row">
      <div class="form col-lg-6 col-md-8 col-12 mx-auto p-4">
        <div class="row mb-3 form-group">
          <label class="col-5">既存の構成をインポート</label>
          <div class="custom-file col-7">
            <input name="configFile" type="file" @change="fileChange" id="inputFile">
            <label class="custom-file-label" for="inputFile">Choose file</label>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-5">フォーム名</label>
          <div class="col-7 p-0">
              <input
                v-model="formName"
                :class="{ 'is-invalid':
                  error.validation &&
                  error.validation.name
                  }"
                class="form-control"
                type="text">
              <span v-show="error.validation &&
                  error.validation.name &&
                  error.validation.name.require" class="invalid-feedback"
              >
              入力してください
              </span>
              <span v-show="error.validation &&
                  error.validation.name &&
                  error.validation.name.halfAlphaNumeric" class="invalid-feedback"
              >
              半角英数字で入力してください
              </span>
              {{ error }}
              <div class="form-text">※ 半角英数字・ハイフン・アンダースコアのみ</div>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-5">自動返信メール件名</label>
          <div class="col-7 p-0">
              <input
                v-model="subject"
                :class="{
                  'is-invalid':
                    error.validation &&
                    error.validation.subject
                  }" class="form-control" type="text"
              >
              <span
                v-show="
                  error.validation &&
                  error.validation.subject &&
                  error.validation.subject.require
                "
                class="invalid-feedback"
              >
              入力してください
              </span>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-5">自動返信メールFROM</label>
          <div class="col-7 p-0">
              <input
                v-model="from"
                :class="{
                  'is-invalid':
                    error.validation &&
                    error.validation.from
                  }" class="form-control" type="text"
              >
              <span
                v-show="
                  error.validation &&
                  error.validation.from &&
                  error.validation.from.require
                "
                class="invalid-feedback"
              >
              入力してください
              </span>
              <span
                v-show="
                  error.validation &&
                  error.validation.from &&
                  error.validation.from.mail
                "
                class="invalid-feedback"
              >
              mail形式で入力してください
              </span>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-5">自動返信メールBCC</label>
          <div class="col-7 p-0">
            <div v-for="bccObj,index in bcc" :key="bccObj.id" class="mb-3 input-group">
              <input
                v-model="bccObj.address"
                :class="{
                  'is-invalid':
                    error.validation &&
                    error.validation.bcc
                }"
                class="form-control"
                type="text">
              <span @click="deleteBcc(index)" v-if="bcc.length!==1" class="btn btn-danger input-group-text">削除</span>
              <span
                v-show="
                  error.validation &&
                  error.validation.bcc &&
                  error.validation.bcc[`require${index}`]
                "
                class="invalid-feedback"
              >
              入力してください
              </span>
              <span
                v-show="
                  error.validation &&
                  error.validation.bcc &&
                  error.validation.bcc[`mail${index}`]
                "
                class="invalid-feedback"
              >
              mail形式で入力してください
              </span>
            </div>
            <div class="d-flex justify-content-end">
              <button @click="addBcc" class="btn btn-primary">追加</button>
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-5">ドキュメントルートディレクトリパス</label>
          <div class="col-7 p-0">
              <input
                v-model="publicPath"
                :class="{
                  'is-invalid':
                    error.validation &&
                    error.validation.publicPath
                  }" class="form-control" type="text"
              >
              <span
                v-show="
                  error.validation &&
                  error.validation.publicPath &&
                  error.validation.publicPath.require
                "
                class="invalid-feedback"
              >
              入力してください
              </span>
              <span
                v-show="
                  error.validation &&
                  error.validation.publicPath &&
                  error.validation.publicPath.directory
                "
                class="invalid-feedback"
              >
              /から入力してください
              </span>
              <div class="form-text">※ 絶対パス</div>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-5">ライブラリディレクトリパス</label>
          <div class="col-7 p-0">
              <input
                v-model="privatePath"
                :class="{
                  'is-invalid':
                    error.validation &&
                    error.validation.privatePath
                  }" class="form-control" type="text"
              >
              <span
                v-show="
                  error.validation &&
                  error.validation.privatePath &&
                  error.validation.privatePath.require
                "
                class="invalid-feedback"
              >
              入力してください
              </span>
              <span
                v-show="
                  error.validation &&
                  error.validation.privatePath &&
                  error.validation.privatePath.directory
                "
                class="invalid-feedback"
              >
              /から入力してください
              </span>
              <div class="form-text">※ 絶対パス</div>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-5">設置先</label>
          <div class="col-7 p-0">
              <input
                v-model="urlPath"
                :class="{
                  'is-invalid':
                    error.validation &&
                    error.validation.urlPath
                  }" class="form-control" type="text"
              >
              <span
                v-show="
                  error.validation &&
                  error.validation.urlPath &&
                  error.validation.urlPath.require
                "
                class="invalid-feedback"
              >
              入力してください
              </span>
              <span
                v-show="
                  error.validation &&
                  error.validation.urlPath &&
                  error.validation.urlPath.directory
                "
                class="invalid-feedback"
              >
              /から入力してください
              </span>
              <div class="form-text">※ URLの絶対パス</div>
          </div>
        </div>

        <div class="row mb-5">
          <label class="col-2">項目</label>
          <div v-if="isFileChange" class="col-10 p-0">

            <form-item
            v-for="item,index in items"
            :key="index"
            :delete-item="deleteItem"
            :item-index="index"
            :props-items="items"
            :props-item="item"
            :err-msgs="errMsgs"
            :error="error"
            :change-label="changeLabelAndId"
            :change-typedform="changeTypedForm"
            :update-is-file-change="updateIsFileChange"
            ></form-item>
 
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
import { csrf, mail, sanitize, template, validation } from "../template/helper/helper.js"
import controllerBase from "../template/controller/base.js"
import controllerUrlPath from "../template/controller/urlPath.js"
import modelBase from "../template/model/base.js"
import modelUrlPath from "../template/model/urlPath.js"
import FormItem from "./components/FormItem.vue"
import publicIndex from "../template/public/index.js"
import config from "../template/app/config.js"
import body from "../template/view/mail/body.js"
import subject from "../template/view/mail/subject.js"
import index from "../template/view/index.js"

import { saveAs } from "file-saver"
import JSZip from "jszip"

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
          itemId: 1,
          label: null,
          id: null,
          rules: [],
          relatedIds: [{ id: 1, relatedId: null }],
          maxLength: null,
          minValue: null,
          maxValue: null,
          choices: [{ id: 1, choice: null }],
          to: false,
          type: "text"
        }
      ],
      errMsgs: {},
      typeValue: 1,
      isFileChange: true,
      error: {},
    }
  },
  computed: {
    //配列の要素をオブジェクトに変換
    changeElementToObject: function(){
      return function(array, value){
        if(array.length){
          return array.map((el, index) => {
            return { id: index+1, [value]: el }
          })
        }else{
          return [{ id: 1, [value]: null }]
        }
      }
    },
    //スラッシュを除いた配列に変換
    pathToArray: function(){
      return function(path){
        return path.split("/").filter(level => level)
      }
    },
    //アッパーキャメルに変換
    toUpperCamel: function(){
      return function(path){
        return this.pathToArray(path).map(path => {
          return path.toLowerCase().replace(/^[a-z]/, (upper) => {
            return upper.toUpperCase()
          })
        }).join("")
      }
    }
  },
  methods: {
    updateIsFileChange(){
      this.isFileChange = false
      this.$nextTick(() => (this.isFileChange = true))
    },
    fileChange(e){
      const files = e.target.files
      if(!files.length){
        return
      }
      this.createForm(files[0])
    },
    createForm(file){
      const reader = new FileReader()
      const that = this
      reader.readAsText(file)
      reader.onload = (e) => {
        const configFile = JSON.parse(e.target.result)
        that.formName = configFile.name
        that.subject = configFile.subject
        that.from = configFile.from
        that.bcc = configFile.bcc.map((bcc, index) => {
          return { id: index+1, address: bcc }
        })
        that.publicPath = configFile.publicPath
        that.privatePath = configFile.privatePath
        that.urlPath = configFile.urlPath
        that.items = configFile.items.map((item, index) => {
          item.itemId = index + 1
          item.relatedIds = this.changeElementToObject(item.relatedIds, "relatedId")
          item.choices = this.changeElementToObject(item.choices, "choice")
          return item
        })
        this.updateIsFileChange()
      }
    },
    changeTypedForm(typedForm, index){
      // this.items[index].id = typedForm.id
      this.items[index].rules = typedForm.rules
      this.items[index].maxLength = typedForm.maxLength
      this.items[index].minValue = typedForm.minValue
      this.items[index].maxValue = typedForm.maxValue
      this.items[index].choices = typedForm.choices
      this.items[index].relatedIds = typedForm.relatedIds
      this.items[index].to = typedForm.to
      this.items[index].type = typedForm.typeValue
    },
    changeLabelAndId(index, label, id){
      this.$set(this.items[index], "label", label)
      this.$set(this.items[index], "id", id)
      // this.items[index].label = label
      // this.items[index].id = id
    },
    addBcc(){
      const newId = this.bcc.slice(-1)[0].id+1
      this.bcc.push({
        id: newId,
        address: ""
      })
    },
    addItem(){
      const newId = this.items.slice(-1)[0].itemId + 1
      this.items.push({
        itemId: newId,
          label: "",
          id: "",
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
      if(!checkForm) this.$set(this.errMsgs, key, "入力必須です")
    },
    //整数チェック
    integerCheck(checkForm, key){
      const pattern = new RegExp("^[0-9]+$")
      if(!pattern.test(checkForm) && checkForm){
        this.$set(this.errMsgs, key, "整数で入力してください")
      }
    },
    //自然数チェック
    naturalNumberCheck(checkForm, key){
      const pattern = new RegExp("^[1-9][0-9]*$")
      if(!pattern.test(checkForm) && checkForm){
        this.$set(this.errMsgs, key, "自然数で入力してください")
      }
    },
    //半角英数字チェック（ハイフン、アンダースコアあり）
    halfAlphanumericCheck(checkForm, key){
      const pattern = new RegExp("^[\\w\\-]+$", "g")
      if(!pattern.test(checkForm) && checkForm){
        this.$set(this.errMsgs, key, "半角英数字で入力してください")
      }
    },
    //メール形式チェック
    mailCheck(checkForm, key){
      const pattern = new RegExp("^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\\.)+[a-zA-Z]{2,}$", "g")
      if(!pattern.test(checkForm) && checkForm){
        this.$set(this.errMsgs, key, "メール形式で入力してください")
      }
    },
    //ディレクトリチェック（/から始まるか）
    directoryCheck(checkForm, key){
      const pattern = new RegExp("^\\/", "g")
      if(!pattern.test(checkForm) && checkForm){
        this.$set(this.errMsgs, key, "/から入力してください")
      }
    },
    //フォルダー作成
    createFolder(zip, path){
      if(path.length === 1){
        return zip.folder(`${path[0]}`)
      }else{
        return this.createFolder(zip.folder(`${path[0]}`), path.splice(1))
      }
    },
    // フォーム名バリデーション
    validateName(){
      let e = {}
      const pattern = new RegExp("^[\\w\\-]+$", "g")
      //バリデーション動作
      if (!this.formName) e.require = true
      if (
        !pattern.test(this.formName) &&
        this.formName
      ) e.halfAlphaNumeric = true

      this.validationTemplate("name", e)
    },
    //メール件名バリデーション
    validateSubject(){
      let e = {}
      //バリデーション動作
      if (!this.subject) e.require = true

      this.validationTemplate("subject", e)
    },
    //メールfromバリデーション
    validateFrom(){
      let e = {}
      const pattern = new RegExp("^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\\.)+[a-zA-Z]{2,}$", "g")
      if (!this.from) e.require = true
      if (
        !pattern.test(this.from) &&
        this.from
      ) e.mail = true

      this.validationTemplate("from", e)
    },
    //publicPathバリデーション
    validatePublicPath(){
      let e = {}
      const pattern = new RegExp("^\\/", "g")
      //バリデーション動作
      if (!this.publicPath) e.require = true
      if (
        !pattern.test(this.publicPath) &&
        this.publicPath
      ) e.directory = true

      this.validationTemplate("publicPath", e)
    },
    //privatePathバリデーション
    validatePrivatePath(){
      let e = {}
      const pattern = new RegExp("^\\/", "g")
      //バリデーション動作
      if (!this.privatePath) e.require = true
      if (
        !pattern.test(this.privatePath) &&
        this.privatePath
      ) e.directory = true

      this.validationTemplate("privatePath", e)
    },
    //urlPathバリデーション
    validateUrlPath(){
      let e = {}
      const pattern = new RegExp("^\\/", "g")
      //バリデーション動作
      if (!this.urlPath) e.require = true
      if (
        !pattern.test(this.urlPath) &&
        this.urlPath
      ) e.directory = true

      this.validationTemplate("urlPath", e)
    },
    //bccバリデーション
    validateBcc(){
      let e = {}
      const pattern = new RegExp("^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\\.)+[a-zA-Z]{2,}$", "g")
      for (let i = 0; i < this.bcc.length; i++){
        if (!this.bcc[i].address) e[`require${i}`] = true
        if (
          !pattern.test(this.bcc[i].address) &&
          this.bcc[i].address
        ) e[`mail${i}`] = true
      }

      this.validationTemplate("bcc", e)
    },
    //itemの見出しバリデーション
    validateItemLabel(e, index){
      if (!this.items[index].label) e.require = true
      this.validationItemTemplate("label", e, index)
    },
    //itemの項目IDバリデーション
    validateItemId(e, index){
      const pattern = new RegExp("^[\\w\\-]+$", "g")
      if (!this.items[index].id) e.require = true
      if (
        !pattern.test(this.items[index].id) &&
        this.items[index].id
      ) e.halfAlphaNumeric = true
      this.validationItemTemplate("id", e, index)
    },
    //itemsバリデーション
    validateItems(){
      let e = {}
      for (let i = 0; i < this.items.length; i++){
        this.validateItemLabel(e, i)
        this.validateItemId(e, i)
      }
    },
    validationItemTemplate(inputName, e, index){
      if(Object.keys(e).length){
        if (!this.error[`item${index}`]) {
          this.$set(this.error, `item${index}`, {})
        }
        if (!this.error[`item${index}`].validation){
          this.$set(this.error[`item${index}`], "validation", {})
        }
        this.$set(this.error[`item${index}`].validation, inputName, e)
      } else if (this.error[`item${index}`].validation && this.error[`item${index}`].validation[inputName]) {
          delete this.error[`item${index}`].validation[inputName]
      }
      if (this.error[`item${index}`].validation &&
        Object.keys(this.error[`item${index}`].validation).length === 0)
      {
        delete this.error[`item${index}`].validation
      }
    },
    validationTemplate(inputName, e){
      if (Object.keys(e).length){
        if (!this.error.validation){
          this.$set(this.error, "validation", {})
        }
        this.$set(this.error.validation, inputName, e)
      } else if (this.error.validation && this.error.validation[inputName]){
        delete this.error.validation[inputName]
      }

      if (this.error.validation &&
          Object.keys(this.error.validation).length === 0)
      {
        delete this.error.validation
      }
    },
    validation(){
      this.validateName()
      this.validateSubject()
      this.validateFrom()
      this.validateBcc()
      this.validatePublicPath()
      this.validatePrivatePath()
      this.validateUrlPath()
      this.validateItems()
    },
    //ダウンロード動作
    downLoad(){
      //エラー初期化
      this.errMsgs = {}

      //formName validation
      this.validation()

      //未入力チェック
      // this.unenteredCheck(this.formName, "formName")
      // this.unenteredCheck(this.subject, "subject")
      // this.unenteredCheck(this.from, "from")
      // this.unenteredCheck(this.publicPath, "publicPath")
      // this.unenteredCheck(this.privatePath, "privatePath")
      // this.unenteredCheck(this.urlPath, "urlPath")

      // for(let i=0; i<this.bcc.length; i++){
      //   this.unenteredCheck(this.bcc[i].address, `bcc${i}`)
      // }

      for(let i=0; i<this.items.length; i++){
        this.unenteredCheck(this.items[i].label, `label${i}`)
        this.unenteredCheck(this.items[i].id, `id${i}`)
      }

      //半角英数字チェック
      this.halfAlphanumericCheck(this.formName, "formName")
      for(let i=0; i<this.items.length; i++){
        this.halfAlphanumericCheck(this.items[i].id, `id${i}`)
      }

      //mail形式チェック
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
        if(this.items[i].rules.some(rule => rule==="length")){
          this.naturalNumberCheck(this.items[i].maxLength, `length${i}`)
        }

        if(this.items[i].rules.some(rule => rule==="numberMin")){
          this.integerCheck(this.items[i].minValue, `numberMin${i}`)
        }

        if(this.items[i].rules.some(rule => rule==="numberMax")){
          this.integerCheck(this.items[i].maxValue, `numberMax${i}`)
        }
      }

      if(!Object.keys(this.errMsgs).length){
        const zip = new JSZip()
        const upperCamelUrl = this.toUpperCamel(this.urlPath)

        //=============publicフォルダー作成==============
        const publicFolder = this.createFolder(zip, this.pathToArray(this.publicPath))
        const publicUrlFolder = this.createFolder(publicFolder, this.pathToArray(this.urlPath))
        publicUrlFolder.file("index.php", publicIndex(upperCamelUrl, this.pathToArray(this.urlPath), this.privatePath))

        //=============privateフォルダー作成==============
        const privateFolder = this.createFolder(zip, this.pathToArray(this.privatePath))

        //Buildフォルダー作成
        const BuildFolder = privateFolder.folder("Build")
        const privateUrlFolder = this.createFolder(BuildFolder, this.pathToArray(this.urlPath))
        privateUrlFolder.file("build_config.json", '{ "message": "hello" }')

        //Appフォルダー作成
        const AppFolder = privateFolder.folder("App")
        const controller = AppFolder.folder("Controller")
        const model =  AppFolder.folder("Model")
        const helper = AppFolder.folder("Helper")
        const view =  AppFolder.folder("View")
        const viewUrlFolder = this.createFolder(view, this.pathToArray(this.urlPath))
        const mail = viewUrlFolder.folder("mail")

        //ファイル作成
        AppFolder.file("config.php", config(this.from, this.bcc))
        viewUrlFolder.file("index.php", index(this.items))
        mail.file("body.php", body)
        mail.file("subject.php", subject)
        controller.file(`${upperCamelUrl}.php`, controllerUrlPath(upperCamelUrl, this.urlPath))
        controller.file("Base.php", controllerBase)
        model.file(`${upperCamelUrl}.php`, modelUrlPath(upperCamelUrl, this.items))
        model.file("Base.php", modelBase)

        //helper作成
        this.createHelper(helper)

        zip.generateAsync({type:"blob"}).then(function(content) {
            // see FileSaver.js
            saveAs(content, "example.zip");
        });
      }
    },
    createHelper(helper){
      helper.file("Csrf.php", csrf)
      helper.file("Mail.php", mail)
      helper.file("Sanitize.php", sanitize)
      helper.file("Template.php", template)
      helper.file("Validation.php", validation)
    },
  }
}
</script>

<style>
.row, .row .row {
  --bs-gutter-x: 0;
}
</style>
