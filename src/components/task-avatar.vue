<!--头像-->
<template>
  <span class="task-avatar"
        v-avatar="avatar.sex"
        :title="avatarTitle"
        :style="style"
        :head="avatar.head">
  </span>
</template>

<script>
  export default {
    name: 'taskAvatar',
    props : {
      avatar : {
        type : Object,
        default() { return {} }
      },
      avatarTitle : {
        type : String,
        default : ''
      },
      width : {
        type : String,
        default : '30px'
      },
      height : {
        type : String,
        default : '30px'
      }
    },
    computed : {
      style() {
        return `width:${this.width};height:${this.height}`;
      }
    }
  }
</script>
