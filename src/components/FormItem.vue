<template>
    <div class="p-3 mb-3 pt-5 border rounded position-relative">
        <button v-if="items.length!==1" @click="deleteItem" class="btn btn-danger position-absolute top-0 end-0">削除</button>
        <div class="row mb-3">
            <label class="form-label">見出し</label>
            <input v-model="heading" @input="changeHeading" :class="{ 'is-invalid': propsErrMsgs.hasOwnProperty(`heading${propsIndex}`) }" class="w-100 form-control" type="text">
            <span v-if="propsErrMsgs.hasOwnProperty(`heading${propsIndex}`)" class="invalid-feedback">{{ propsErrMsgs[`heading${propsIndex}`] }}</span>
        </div>
        <div class="row mb-4">
            <label class="form-label">項目ID</label>
            <input v-model="itemId" @input="changeHeading"  :class="{ 'is-invalid': propsErrMsgs.hasOwnProperty(`itemId${propsIndex}`) }" class="form-control" type="text">
            <span v-if="propsErrMsgs.hasOwnProperty(`itemId${propsIndex}`)" class="invalid-feedback">{{ propsErrMsgs[`itemId${propsIndex}`] }}</span>
        </div>
        <div class="row mb-3">
            <div class="col-4">タイプ</div>
            <div class="col-8">
                <div v-for="type in types" :key="type.value" class="form-check">
                    <label class="form-check-label">
                        {{ type.label }}
                        <input class="form-check-input" v-model="typeValue" type="radio" :value="type.value" :id="type.value">
                    </label>
                </div>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-4">入力チェック</div>
            <div class="col-8">
                <div class="form-check" v-for="rule,index in typedRules" :key="index">
                    <label class="form-check-label">
                        {{ rule.label }}
                        <input class="form-check-input" :value="rule.rule" v-model="selectRules" type="checkbox">
                    </label>
                    <div v-if="rule.hasOwnProperty('countLimit')">
                        <input class="" type="text"><span>文字</span>
                    </div>
                    <div v-if="rule.hasOwnProperty('minLimit')">
                        <span>最小値</span><input type="text">
                    </div>
                    <div v-if="rule.hasOwnProperty('maxLimit')">
                        <span>最大値</span><input type="text">
                    </div>
                </div>
            </div>
        </div>
        <div v-if="typeValue===1 || typeValue===2" class="row mb-3">
            <div class="col-4">入力チェックの発動条件</div>
            <div class="row mt-2">
                <div class="text-center mb-2">以下の項目が入力されている場合にチェックを行う</div>
                <div class="row mb-3 px-5">
                    <label class="col-5 text-center">項目ID</label>
                    <div class="col-7">
                        <div class="mb-3 input-group">
                            <input class="form-control" type="text">
                        </div>
                        <div class="d-flex justify-content-end">
                            <button  class="btn btn-primary">追加</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="typeValue===1 || typeValue===2" class="row">
            <div class="col-4">自動返信メール宛先</div>
            <div class="col-8">
                <div class="form-check">
                    <label class="form-check-label">
                        自動返信メールの宛先にする
                        <input class="form-check-input" type="checkbox">
                    </label>
                </div>
            </div>
        </div>
        <div v-if="typeValue===3" class="row">
            <label class="col-4">選択肢</label>
            <div class="col-8 p-0">
                <div v-for="choice in choices" :key="choice.id" class="mb-3 input-group">
                    <input v-model="choice.choice" class="form-control" type="text">
                    <span class="btn btn-danger input-group-text">削除</span>
                    <!-- <span class="invalid-feedback"></span> -->
                </div>
                <div class="d-flex justify-content-end">
                    <button class="btn btn-primary">追加</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        propsIndex: {
            type: Number
        },
        propsDeleteItem: {
            type: Function
        },
        propsItems: {
            type: Array
        },
        propsErrMsgs: {
            type: Object
        },
        propsHeading: {
            type: String
        },
        propsItemId: {
            type: String
        },
        value: {
            type: Array
        },
        propsChange: {
            type: Function
        }
    },
    data(){
        return {
            items: this.propsItems,
            itemId: "",
            heading: "",
            types: [
                { label: "テキスト", value: 1 },
                { label: "メモ", value: 2 },
                { label: "ラジオボタン", value: 3 },
                { label: "チェックボタン", value: 4 },
            ],
            typeValue: 1,
            selectRules: [],
            choices: [
                { id: 1, choice: null }
            ]
        }
    },
    computed: {
        typedRules(){
            if (this.typeValue===1){
                return [
                    { rule: "required", label: "必須入力" },
                    { rule: "countLimit", label: "最大文字数制限", countLimit: null },
                    { rule: "mailOnly", label: "メールアドレスのみ可" },
                    { rule: "urlOnly", label: "URLのみ可" },
                    { rule: "numericOnly", label: "数値のみ可" },
                    { rule: "integer", label: "整数のみ可" },
                    { rule: "minLimit", label: "数値の最小値を制限", minLimit: null },
                    { rule: "maxLimit", label: "数値の最大値を制限", maxLimit: null }
                ]
            }else if(this.typeValue===2){
                return [
                    { rule: "required", label: "必須入力" },
                    { rule: "countLimit", label: "最大文字数制限", countLimit: null },
                ]
            }else{
                return [{ rule: "requiredSelect", label: "必須選択" },]
            }
        }
    },
    methods: {
        deleteItem(){
            this.propsDeleteItem(this.index)
        },
        changeHeading(){
            this.propsChange(this.propsIndex, this.heading, this.itemId)
        }
    }
}
</script>
