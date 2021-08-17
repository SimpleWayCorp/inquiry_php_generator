<template>
    <div class="row mb-3">
        <label class="col-5">自動返信メール件名</label>
        <div class="col-7 p-0"><input :value="subject" @input="$emit('input', $event.target.value)" class="form-control" type="text"></div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
        }
    },
    data(){
        return {
            subject: this.value
        }
    }
}
</script>
