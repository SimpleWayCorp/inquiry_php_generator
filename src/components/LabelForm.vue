<template>
    <div class="row mb-3">
        <label class="col-5">{{ label }}</label>
        <div class="col-7 p-0">
            <input :value="subject" @input="$emit('input', subject = $event.target.value)
            unenteredCheck(subject)" :class="{ 'is-invalid': isErr }" class="form-control" type="text">
            {{ subject }}
            {{ isErr }}
            <span v-if="isErr" class="invalid-feedback">error</span>
            <div v-if="isFormText" class="form-text">{{ formText }}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            require: true
        },
        propsLabel: {
            type: String,
            require: true
        },
        propsIsFormText: {
            type: Boolean,
            default: false
        },
        propsFormText: {
            type: String
        },

    },
    data(){
        return {
            subject: this.value,
            label: this.propsLabel,
            isFormText: this.propsIsFormText,
            formText: this.propsFormText,
            isErr: this.propsIsErr
        }
    },
    methods: {
        inputProcess(){
            this.$emit('input', this.subject = this.$event.target.value)
            this.unenteredCheck(this.subject)
        },
        unenteredCheck(){
            this.propsUnenteredCheck(this.subject)
        }
    }
}
</script>
