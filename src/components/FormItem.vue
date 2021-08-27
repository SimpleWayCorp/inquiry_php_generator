<template>
    <div v-if="propsItem.itemId===itemIndex+1" class="p-3 mb-3 pt-5 border rounded position-relative">
        <button v-if="propsItems.length!==1" @click="deleteI" class="btn btn-danger position-absolute top-0 end-0">削除</button>
        <div class="row mb-3">
            <label class="form-label">見出し</label>
            <input
            v-model="label"
            @input="parentChangeLabel"
            :class="{ 'is-invalid': errMsgs.hasOwnProperty(`label${itemIndex}`) }"
            class="w-100 form-control" type="text"
            >
            <span
            v-if="errMsgs.hasOwnProperty(`label${itemIndex}`)"
            class="invalid-feedback"
            >
                {{ errMsgs[`label${itemIndex}`] }}
            </span>
        </div>
        <div class="row mb-4">
            <label class="form-label">項目ID</label>
            <input v-model="id" @input="parentChangeLabel" :class="{ 'is-invalid': errMsgs.hasOwnProperty(`id${itemIndex}`) }" class="form-control" type="text">
            <span v-if="errMsgs.hasOwnProperty(`id${itemIndex}`)" class="invalid-feedback">{{ errMsgs[`id${itemIndex}`] }}</span>
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
                    <div v-if="rule.hasOwnProperty('length')">
                        <input
                        v-model="maxLength"
                        @input="parentChangeTypedform"
                        :disabled="!selectRules.some(rule => rule==='length')"
                        :class="{ 'is-invalid': errMsgs.hasOwnProperty(`length${itemIndex}`) }"
                        type="text"><span>文字</span>
                        <span v-if="errMsgs.hasOwnProperty(`length${itemIndex}`)" class="invalid-feedback">
                            {{ errMsgs[`length${itemIndex}`] }}
                        </span>
                    </div>
                    <div v-if="rule.hasOwnProperty('numberMin')">
                        <span>最小値</span>
                        <input
                        v-model="minValue"
                        @input="parentChangeTypedform"
                        :disabled="!selectRules.some(rule => rule==='numberMin')"
                        :class="{ 'is-invalid': errMsgs.hasOwnProperty(`numberMin${itemIndex}`) }"
                        type="text">
                        <span v-if="errMsgs.hasOwnProperty(`numberMin${itemIndex}`)" class="invalid-feedback">
                            {{ errMsgs[`numberMin${itemIndex}`] }}
                        </span>
                    </div>
                    <div v-if="rule.hasOwnProperty('numberMax')">
                        <span>最大値</span>
                        <input
                        v-model="maxValue"
                        @input="parentChangeTypedform"
                        :disabled="!selectRules.some(rule => rule==='numberMax')"
                        :class="{ 'is-invalid': errMsgs.hasOwnProperty(`numberMax${itemIndex}`) }"
                        type="text">
                        <span v-if="errMsgs.hasOwnProperty(`numberMax${itemIndex}`)" class="invalid-feedback">
                            {{ errMsgs[`numberMax${itemIndex}`] }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="typeValue==='text' || typeValue==='memo'" class="row mb-3">
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
                {{ (this.propsItem.relatedIds) ? true: false }}
            </div>
        </div>
        <div v-if="typeValue==='text' || typeValue==='memo'" class="row">
            <div class="col-4">自動返信メール宛先</div>
            <div class="col-8">
                <div class="form-check">
                    <label class="form-check-label">
                        自動返信メールの宛先にする
                        <input @change="parentChangeTypedform" v-model="to" class="form-check-input" type="checkbox">
                    </label>
                </div>
            </div>
        </div>
        <div v-if="typeValue==='select'" class="row">
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
        propsItem: { type: Object },
        errMsgs: { type: Object },
        value: { type: Array },
        changeLabel: { type: Function },
        changeTypedform: { type: Function },
    },
    data(){
        return {
            items: this.propsItems,
            id: this.propsItem.id,
            label: this.propsItem.label,
            maxLength: this.propsItem.maxLength,
            minValue: this.propsItem.minValue,
            maxValue: this.propsItem.maxValue,
            types: [
                { label: "テキスト", value: "text" },
                { label: "メモ", value: "memo" },
                { label: "ラジオボタン", value: "select" },
                { label: "チェックボタン", value: "checkbox" },
            ],
            typeValue: this.propsItem.type || "text",
            selectRules: this.propsItem.rules || [],
            relatedIds: this.propsItem.relatedIds || [{ id: 1, relatedId: null }],
            choices: this.propsItem.choices || [{ id: 1, choice: null }],
            to: this.propsItem.to || false
        }
    },
    computed: {
        typedRules(){
            if (this.typeValue==="text"){
                return [
                    { rule: "required", label: "必須入力" },
                    { rule: "length", label: "最大文字数制限",  length: true },
                    { rule: "email", label: "メールアドレスのみ可" },
                    { rule: "url", label: "URLのみ可" },
                    { rule: "digit", label: "数値のみ可" },
                    { rule: "integer", label: "整数のみ可" },
                    { rule: "numberMin", label: "数値の最小値を制限", numberMin: true },
                    { rule: "numberMax", label: "数値の最大値を制限", numberMax: true }
                ]
            }else if(this.typeValue==="memo"){
                return [
                    { rule: "required", label: "必須入力" },
                    { rule: "length", label: "最大文字数制限", length: true },
                ]
            }else{
                return [{ rule: "requiredSelect", label: "必須選択" },]
            }
        }
    },
    methods: {
        deleteI(){
            this.deleteItem(this.itemIndex)
        },
        //入力チェック初期化
        initialRules(){
            this.selectRules = []
            const typedForm = {
                // id: null,
                rules: [],
                maxLength: null,
                minValue: null,
                maxValue: null,
                choices: [{ id: 1, choice: null }],
                relatedIds: [{ id: 1, relatedId: null }],
                to: false,
                typeValue: this.typeValue
            }
            this.changeTypedform(typedForm, this.itemIndex);
        },
        //項目ごとのフォーム内容を変更
        parentChangeTypedform(){
            const typedForm = {
                // id: this.id,
                rules: [...this.selectRules],
                maxLength: this.maxLength,
                minValue: this.minValue,
                maxValue: this.maxValue,
                choices: [...this.choices],
                relatedIds: [...this.relatedIds],
                to: this.to,
                typeValue: this.typeValue
            }
            this.changeTypedform(typedForm, this.itemIndex);
        },
        parentChangeLabel(){
            this.changeLabel(this.itemIndex, this.label, this.id)
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
            this.parentChangeTypedform()
        },
        //項目ID
        addRelatedId(){
            const newId = this.relatedIds.slice(-1)[0].id + 1
            this.relatedIds.push({
                id: newId,
                relatedId: null
            })
            this.parentChangeTypedform()
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
    },
    mounted(){
    }
}
</script>
