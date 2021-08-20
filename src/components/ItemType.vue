<template>
        <div class="p-3 mb-3 pt-5 border rounded position-relative">
            <button v-if="propsItems.length!==1" @click="deleteItem" class="btn btn-danger position-absolute top-0 end-0">削除</button>
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
            <div class="row">
                <div v-for="type in types" :key="type.value" class="form-check">
                    <label class="form-check-label">
                        {{ type.label }}
                        <input class="form-check-input" v-model="typeValue" type="radio" :value="type.value" :id="type.value">
                    </label>
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
            type: Array
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
            heading: this.value[0],
            itemId: "",
            types: [
                { label: "テキスト", value: 1 },
                { label: "メモ", value: 2 },
                { label: "ラジオボタン", value: 3 },
                { label: "チェックボタン", value: 4 },
            ],
            typeValue: 1,
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
