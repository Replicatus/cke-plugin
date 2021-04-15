<template>
  <div>
    <vue-ckeditor
        v-if="!loading && !isNpa"
        v-model="editData"
        :editor="editor"
        :config="editorConfig"
        @ready="onEditorReady"
    />
    <vue-ckeditor
        v-else-if="!loading && isNpa"
        :value="newDataForEditor"
        @input="inputNpaFunction"
        :editor="editor"
        :config="editorConfig"
        @ready="onEditorReady"
    />
    <div v-text="loading" v-else/>
    <div v-if="!flagReady">
      <p>Подготовка текста</p>
      <div v-text="loading" />
    </div>
    <button v-if="isNpa"
           :loading="loading"
           class=""
           @click="sendData()">
      Применить данные ckeditor
    </button>
  </div>

  <!--@ready="prefill" -->
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue2'
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// import '@ckeditor/ckeditor5-build-classic/build/translations/ru';

import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapterPlugin from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import AutoformatPlugin from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Font from '@ckeditor/ckeditor5-font/src/font';
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
import UnderlinePlugin from '@ckeditor/ckeditor5-basic-styles/src/underline';
import StrikethroughPlugin from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import HighlightPlugin from '@ckeditor/ckeditor5-highlight/src/highlight';
import HorizontalLinePlugin from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';
import IndentPlugin from '@ckeditor/ckeditor5-indent/src/indent';
import ToDoListPlugin from '@ckeditor/ckeditor5-list/src/todolist';
import InsertTablePlugin from '@ckeditor/ckeditor5-table/src/table';
import MediaEmbedPlugin from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import CodePlugin from '@ckeditor/ckeditor5-basic-styles/src/code';
import BlockQuotePlugin from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading';
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
import ListPlugin from '@ckeditor/ckeditor5-list/src/list';
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Image from '@ckeditor/ckeditor5-image/src/image'
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert'
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
// import MathType from '@wiris/mathtype-ckeditor5'
import InsertRouterLink from './customPlaginsCKEditor'
import CustomElementPlugin from "./customElement/customelement";
// import InsertIcon from '@/assets/icons/insert.svg'
// import "./customElement/translations/ru"
// import '@ckeditor/ckedit'
export default {
  name: "vue-editor",
  components: {
    'vue-ckeditor': CKEditor.component,
  },
  props: {
    editDataProp: {
      type: String,
      default: '0'
    },
    isNpa: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    editData: {
      get() {
        return this.editDataProp
      },
      set(value) {
        this.$emit('update:edit-data-prop', value
        )
      }
    }
  },
  data() {
    return {
      newDataForEditor: '',
      flagReady: false,
      editor: ClassicEditor,
      editorConfig: {
        plugins: [
          EssentialsPlugin,
          UploadAdapterPlugin,
          AutoformatPlugin,
          BoldPlugin,
          UnderlinePlugin,
          ItalicPlugin,
          BlockQuotePlugin,
          HighlightPlugin,
          HorizontalLinePlugin,
          IndentPlugin,
          ToDoListPlugin,
          CodePlugin,
          MediaEmbedPlugin,
          StrikethroughPlugin,
          Font,
          Image,
          ImageInsert,
          InsertTablePlugin,
          HeadingPlugin,
          LinkPlugin,
          ListPlugin,
          ParagraphPlugin,
          Alignment,
          InsertRouterLink,
          CustomElementPlugin
          // MathType
        ],
        CustomElement:{
          items:[
            {
              tag: 'router-link',/* placeholder: 'some text',*/
              attributes:{class: 'artikle-link', to:'/admin'},/* icon:InsertIcon,*/
              inline:false, editable:false
            },
            // {tag: 'tagname2'},
          ]
        },
        // extraPlugins: [InsertRouterLink,],
        toolbar: {
          items: [
            'heading',//+
            '|',
            'custom-element-router-link',
            '|',
            // 'custom-element-tagname2',
            'fontSize',//+
            'fontFamily',//+
            '|',
            'bold',//+
            'italic',//+
            'underline',//+
            'strikethrough',//+
            'highlight',//+
            '|',
            // 'MathType',//-
            'alignment',//+
            'horizontalLine',//-
            '|',
            'numberedList',//+
            'bulletedList',//+
            '|',
            'addRouterLink',
            'indent',//-
            'outdent',//-
            '|',
            'todoList',//-
            'link',//+
            'blockQuote',//+
            'imageInsert',
            // 'imageUpload',//++
            'insertTable',//-
            'mediaEmbed',//-
            '|',
            'undo',//+
            'redo',//+
            'code'//-
          ]
        },
        language: 'ru',
        // image: {
        //   toolbar: [
        //     'imageTextAlternative',
        //     'imageStyle:full',
        //     'imageStyle:side'
        //   ]
        // },
        link: {
          decorators: {
            toggleDownloadable: {
              mode: 'manual',
              label: 'Dialogs',
              attributes: {
                click: "dialogs[0].showDialog = true"
              }
            },
            openInNewTab: {
              mode: 'manual',
              label: 'Открыть в новом окне',
              defaultValue: false,			// This option will be selected by default.
              attributes: {
                target: '_blank',
              }
            }
          }
        },
        table: {
          contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells'
          ]
        },
      },
    }
  },
  methods: {
    prefill(b) {
      console.log("a", b)
    },
    onEditorReady: function(editor)  {
      this.newDataForEditor = this.editDataProp;
      CKEditorInspector.attach(editor)
      this.flagReady = true
    },
    inputNpaFunction(value) {
      this.newDataForEditor = value
    },
    sendData() {
      this.$emit('update:edit-data-prop', '<div>' + this.newDataForEditor + '</div>')
    }
  },
}
</script>

<style scoped>

</style>