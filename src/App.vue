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
            <input v-model="formName" class="col-12 form-control" type="text">
            <div class="form-text">※ 半角英数字・ハイフン・アンダースコアのみ</div>
          </div>
        </div>
        <label-form v-model="subject"></label-form>
        {{ subject }}
        <!-- <div class="row mb-3">
          <label class="col-5">自動返信メール件名</label>
          <div class="col-7 p-0"><input v-model="subject" class="form-control" type="text"></div>
        </div> -->
        <div class="row mb-3">
          <label class="col-5">自動返信メールFROM</label>
          <div class="col-7 p-0"><input class="form-control" type="text"></div>
        </div>
        <div class="row mb-3">
          <label class="col-5">自動返信メールBCC</label>
          <div class="col-7 p-0">
            <div v-for="bccObj,index in bcc" :key="bccObj.id" class="mb-3 input-group">
              <input class="form-control" type="text">
              <span @click="deleteBcc(index)" v-if="bcc.length!==1" class="btn btn-danger input-group-text">削除</span>
            </div>
            <div class="d-flex justify-content-end">
              <button @click="addBcc" class="btn btn-primary">追加</button>
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-5">ドキュメントルートディレクトリパス</label>
          <div class="col-7 p-0">
            <input class="form-control" type="text">
            <div class="form-text">※ 絶対パス</div>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-5">ライブラリディレクトリパス</label>
          <div class="col-7 p-0">
            <input class="form-control" type="text">
            <div class="form-text">※ 絶対パス</div>
          </div>
        </div>
        <div class="row mb-4">
          <label class="col-5">設置先</label>
          <div class="col-7 p-0">
            <input class="form-control" type="text">
            <div class="form-text">※ URLの絶対パス</div>
          </div>
        </div>
        <div class="row mb-5">
          <label class="col-3">項目</label>
          <div class="col-9 p-0">
            <div v-for="item,index in items" :key="item.id" class="p-3 mb-3 pt-5 border rounded position-relative">
              <button v-if="items.length!==1" @click="deleteItem(index)" class="btn btn-danger position-absolute top-0 end-0">削除</button>
              <div class="row mb-3">
                  <label class="form-label">見出し</label>
                  <input class="w-100 form-control" type="text">
              </div>
              <div class="row mb-4">
                  <label class="form-label">項目ID</label>
                  <input class="form-control" type="text">
              </div>
              <div class="row">
                      <div class="form-check">
                        <label class="form-check-label" for="text">
                          テキスト
                        </label>
                        <input class="form-check-input" type="radio" name="itemtype" id="text">
                      </div>
                      <div class="form-check">
                        <label class="form-check-label" for="memo">
                          メモ
                        </label>
                        <input class="form-check-input" type="radio" name="itemtype" id="memo" checked>
                      </div>
                      <div class="form-check">
                        <label class="form-check-label" for="radio">
                          ラジオボタン
                        </label>
                        <input class="form-check-input" type="radio" name="itemtype" id="radio">
                      </div>
                      <div class="form-check">
                        <label class="form-check-label" for="check">
                          チェックボタン
                        </label>
                        <input class="form-check-input" type="radio" name="itemtype" id="check">
                      </div>
              </div>
            </div>
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
import LabelForm from "./components/LabelForm.vue"

export default {
  name: 'App',
  data(){
    return {
      formName: "",
      subject: "",
      from: "",
      bcc: [
        { id: 1, address: "" },
        { id: 2, address: "" },
        { id: 3, address: "" }
      ],
      publicPath: "",
      privatePath: "",
      urlPath: "",
      items: [
        {
          id: 1
        }
      ]
    }
  },
  methods: {
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
        id: newId
      })
    },
    deleteBcc(index){
      this.bcc.splice(index, 1)
    },
    deleteItem(index){
      this.items.splice(index, 1)
    },
    downLoad(){

    }
  },
  components: {
    LabelForm
  }
}
</script>

<style>
.row, .row .row {
  --bs-gutter-x: 0;
}
</style>
