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
          <div v-if="isFileChange" class="col-10 p-0">

            <form-item
            v-for="item,index in items"
            :key="index"
            :delete-item="deleteItem"
            :item-index="index"
            :props-items="items"
            :props-item="item"
            :err-msgs="errMsgs"
            :change-label="changeLabel"
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
      isFileChange: true
    }
  },
  computed: {
    defaultValue: function(){
      return function(array, element){
        if(array.length){
          return array.map((el, index) => {
            return { id: index+1, [element]: el }
          })
        }else{
          return [{ id: 1, [element]: null }]
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
          item.relatedIds = this.defaultValue(item.relatedIds, "relatedId")
          item.choices = this.defaultValue(item.choices, "choice")
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
    changeLabel(index, label, id){
      this.items[index].label = label
      this.items[index].id = id
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
    //フォルダー作成
    createFolder(zip, path){
      if(path.length === 1){
        return zip.folder(`${path[0]}`)
      }else{
        return this.createFolder(zip.folder(`${path[0]}`), path.splice(1))
      }
    },
    //ダウンロード動作
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
        this.unenteredCheck(this.items[i].label, `label${i}`)
        this.unenteredCheck(this.items[i].id, `id${i}`)
      }

      //半角英数字チェック
      this.halfAlphanumericCheck(this.formName, "formName")
      for(let i=0; i<this.items.length; i++){
        this.halfAlphanumericCheck(this.items[i].id, `id${i}`)
      }

      //mail形式チェック
      // this.mailCheck(this.subject, "subject")
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
        publicUrlFolder.file("index.php", publicIndex(upperCamelUrl))

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
