<template>
    <div class="p-3 mb-3 pt-5 border rounded position-relative">
        <button v-if="items.length!==1" @click="deleteItem(itemIndex)" class="btn btn-danger position-absolute top-0 end-0">削除</button>
        <div class="row mb-3">
            <label class="form-label">見出し</label>
            <input v-model="heading" @input="parentChangeHeading" :class="{ 'is-invalid': errMsgs.hasOwnProperty(`heading${itemIndex}`) }" class="w-100 form-control" type="text">
            <span v-if="errMsgs.hasOwnProperty(`heading${itemIndex}`)" class="invalid-feedback">{{ errMsgs[`heading${itemIndex}`] }}</span>
        </div>
        <div class="row mb-4">
            <label class="form-label">項目ID</label>
            <input v-model="itemId" @input="parentChangeHeading" :class="{ 'is-invalid': errMsgs.hasOwnProperty(`itemId${itemIndex}`) }" class="form-control" type="text">
            <span v-if="errMsgs.hasOwnProperty(`itemId${itemIndex}`)" class="invalid-feedback">{{ errMsgs[`itemId${itemIndex}`] }}</span>
        </div>
        <div class="row mb-3">
            <div class="col-4">タイプ</div>
            <div class="col-8">
                <div v-for="type in types" :key="type.value" class="form-check">
                    <label class="form-check-label">
                        {{ type.label }}
                        <input class="form-check-input" @change="initialRules" v-model="typeValue" type="radio" :value="type.value" :id="type.value">
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
                        <input class="form-check-input" :value="rule.rule" @change="parentChangeTypedform" v-model="selectRules" type="checkbox">
                    </label>
                    <div v-if="rule.hasOwnProperty('maxLength')">
                        <input
                        v-model="maxLength"
                        @input="parentChangeTypedform"
                        :disabled="!selectRules.some(rule => rule==='maxLength')"
                        :class="{ 'is-invalid': errMsgs.hasOwnProperty(`maxLength${itemIndex}`) }"
                        type="text"><span>文字</span>
                        <span v-if="errMsgs.hasOwnProperty(`maxLength${itemIndex}`)" class="invalid-feedback">
                            {{ errMsgs[`maxLength${itemIndex}`] }}
                        </span>
                    </div>
                    <div v-if="rule.hasOwnProperty('minValue')">
                        <span>最小値</span>
                        <input
                        v-model="minValue"
                        @input="parentChangeTypedform"
                        :disabled="!selectRules.some(rule => rule==='minValue')"
                        :class="{ 'is-invalid': errMsgs.hasOwnProperty(`minValue${itemIndex}`) }"
                        type="text">
                        <span v-if="errMsgs.hasOwnProperty(`minValue${itemIndex}`)" class="invalid-feedback">
                            {{ errMsgs[`minValue${itemIndex}`] }}
                        </span>
                    </div>
                    <div v-if="rule.hasOwnProperty('maxValue')">
                        <span>最大値</span>
                        <input
                        v-model="maxValue"
                        @input="parentChangeTypedform"
                        :disabled="!selectRules.some(rule => rule==='maxValue')"
                        :class="{ 'is-invalid': errMsgs.hasOwnProperty(`maxValue${itemIndex}`) }"
                        type="text">
                        <span v-if="errMsgs.hasOwnProperty(`maxValue${itemIndex}`)" class="invalid-feedback">
                            {{ errMsgs[`maxValue${itemIndex}`] }}
                        </span>
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
                        <div v-for="relatedId, index in relatedIds" :key="relatedId.id" class="mb-3 input-group">
                            <input @input="parentChangeTypedform" v-model="relatedId.relatedId" class="form-control" type="text">
                            <span @click="deleteRelatedId(index)" v-if="relatedIds.length!==1" class="btn btn-danger input-group-text">削除</span>
                        </div>
                        <div class="d-flex justify-content-end">
                            <button @click="addRelatedId" class="btn btn-primary">追加</button>
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
                        <input @change="parentChangeTypedform" v-model="to" class="form-check-input" type="checkbox">
                    </label>
                    {{ to }}
                </div>
            </div>
        </div>
        <div v-if="typeValue===3" class="row">
            <label class="col-4">選択肢</label>
            <div class="col-8 p-0">
                <div v-for="choice, index in choices" :key="choice.id" class="mb-3 input-group">
                    <input @input="parentChangeTypedform" v-model="choice.choice" class="form-control" type="text">
                    <span @click="deleteChoice(index)" v-if="choices.length!==1" class="btn btn-danger input-group-text">削除</span>
                    <!-- <span class="invalid-feedback"></span> -->
                </div>
                <div class="d-flex justify-content-end">
                    <button @click="addChoice" class="btn btn-primary">追加</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        itemIndex: { type: Number },
        deleteItem: { type: Function },
        propsItems: { type: Array },
        errMsgs: { type: Object },
        propsHeading: { type: String },
        propsItemId: { type: String },
        value: { type: Array },
        changeHeading: { type: Function },
        changeTypedform: { type: Function }
    },
    data(){
        return {
            items: this.propsItems,
            itemId: null,
            heading: null,
            maxLength: null,
            minValue: null,
            maxValue: null,
            types: [
                { label: "テキスト", value: 1 },
                { label: "メモ", value: 2 },
                { label: "ラジオボタン", value: 3 },
                { label: "チェックボタン", value: 4 },
            ],
            typeValue: 1,
            selectRules: [],
            relatedIds: [
                { id: 1, relatedId: null }
            ],
            choices: [
                { id: 1, choice: null }
            ],
            to: false
        }
    },
    computed: {
        typedRules(){
            if (this.typeValue===1){
                return [
                    { rule: "required", label: "必須入力" },
                    { rule: "maxLength", label: "最大文字数制限",  maxLength: true },
                    { rule: "mailOnly", label: "メールアドレスのみ可" },
                    { rule: "urlOnly", label: "URLのみ可" },
                    { rule: "numericOnly", label: "数値のみ可" },
                    { rule: "integer", label: "整数のみ可" },
                    { rule: "minValue", label: "数値の最小値を制限", minValue: true },
                    { rule: "maxValue", label: "数値の最大値を制限", maxValue: true }
                ]
            }else if(this.typeValue===2){
                return [
                    { rule: "required", label: "必須入力" },
                    { rule: "maxLength", label: "最大文字数制限", maxLength: true },
                ]
            }else{
                return [{ rule: "requiredSelect", label: "必須選択" },]
            }
        }
    },
    methods: {
        //入力チェック初期化
        initialRules(){
            this.selectRules = []
            const typedForm = {
                rules: [],
                maxLength: null,
                minValue: null,
                maxValue: null,
                choices: [{ id: 1, choice: null }],
                relatedIds: [{ id: 1, relatedId: null }],
                to: false
            }
            this.changeTypedform(typedForm, this.itemIndex);
        },
        //項目ごとのフォーム内容を変更
        parentChangeTypedform(){
            const typedForm = {
                rules: [...this.selectRules],
                maxLength: this.maxLength,
                minValue: this.minValue,
                maxValue: this.maxValue,
                choices: [...this.choices],
                relatedIds: [...this.relatedIds],
                to: this.to
            }
            this.changeTypedform(typedForm, this.itemIndex);
        },
        parentChangeHeading(){
            this.changeHeading(this.itemIndex, this.heading, this.itemId)
        },
        //==========================
        //追加処理
        //==========================
        addChoice(){
            const newId = this.choices.slice(-1)[0].id + 1
            this.choices.push({
                id: newId,
                choice: null
            })
        },
        //項目ID
        addRelatedId(){
            const newId = this.relatedIds.slice(-1)[0].id + 1
            this.relatedIds.push({
                id: newId,
                relatedId: null
            })
        },
        //==========================
        //削除処理
        //==========================
        //選択肢
        deleteChoice(index){
            this.choices.splice(index, 1)
            this.parentChangeTypedform()
        },
        //項目ID
        deleteRelatedId(index){
            this.relatedIds.splice(index, 1)
            this.parentChangeTypedform()
        }
    }
}
</script>
