<template>
  <div>
    <editor :id="tinymceId" v-model="content" :init="editorInit"></editor>
  </div>
</template>

<script>
// import tinymce from 'tinymce/tinymce'
// import 'tinymce/themes/silver/theme'
// import 'tinymce/icons/default'
// import Editor from '@tinymce/tinymce-vue'
// 引入编辑器插件plugins
// import 'tinymce/plugins/advlist'
// import 'tinymce/plugins/autolink'
// import 'tinymce/plugins/lists'
// import 'tinymce/plugins/link'
// import 'tinymce/plugins/image'
// import 'tinymce/plugins/charmap'
// import 'tinymce/plugins/print'
// import 'tinymce/plugins/preview'
// import 'tinymce/plugins/anchor'
// import 'tinymce/plugins/searchreplace'
// import 'tinymce/plugins/visualblocks'
// import 'tinymce/plugins/fullscreen'
// import 'tinymce/plugins/insertdatetime'
// import 'tinymce/plugins/media'
// import 'tinymce/plugins/table'
//引入工具栏图标
// import 'tinymce/icons/default'

export default {
  name: "tinyEditor",
  props:{
    id:{
      type:String,
      default:function () {
        return (
          "vue-tinymce-" +
          +new Date() +
          ((Math.random() * 1000).toFixed(0) + "")
        );
      }
    },
    value: {
      type: String,
      default: ''
    },
    plugins: {
      type: [String, Array],
      default: function () {
        return ['advlist autolink lists link image charmap print preview anchor', 'searchreplace visualblocks fullscreen', 'insertdatetime table']
      }
    },
    toolbar: {
      type: [String, Array],
      default:'undo redo | insert | styleselect | fontsizeselect |alignleft aligncenter alignright alignjustify | bold italic forecolor backcolor |  outdent indent | link image | fullscreen | removeformat'
    }
  },
  data() {
    return {
      tinymceId:this.id,
      content:this.value,
      editorInit:{
        language_url: '/static/tinymce/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/static/tinymce/skins/ui/oxide',
        content_css: `/static/tinymce/skins/content/default/content.css`,
        height: 280,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        images_upload_handler: (blobInfo, success, failure) => {
          console.log(blobInfo)
          console.log(success)
          console.log(failure)
          this.handleImageAdded(blobInfo, success, failure)
        },
      },
    }
  },
  components: {
    Editor
  },
  computed: {},
  created() {
  },
  mounted() {
    tinymce.init({
      selector:`#${this.tinymceId}`,
      plugins: this.plugins,
      toolbar: this.toolbar,

      setup: function (editor) {
        editor.on('init', function (e) {
          editor.setContent(this.value);
        });
      },

    })
  },
  watch:{
    value(newValue) {
      this.$nextTick(() =>
        this.content = newValue
      );
    },
    content(newValue) {
      this.$emit('input', newValue)
    }
  },
  methods: {
    handleImageAdded(blobInfo, success, failure){
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value);
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent();
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId);
      if (this.status) tinymce.destroy();
      if (tinymce) {
        tinymce.destroy();
      }
    },
  }
}
</script>

<style scoped>

</style>
