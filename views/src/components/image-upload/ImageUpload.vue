<template>
  <form enctype="multipart/form-data" novalidate>
    <div :class="{ dropbox: true, 'dropbox-active': !isReadOnly }">
      <input type="file" :multiple="isMultiple" :name="uploadFieldName" :disabled="isSaving || isReadOnly" @change="uploadImages" accept="image/*" class="input-file">
      <p v-if="uploadedImages.length === 0">
        Drag your photos here<br>or click to browse
      </p>
      <b-row>
        <div v-for="(image,i) in uploadedImages" :key="image+'_'+i">
          <b-col cols="2">
            <b-button v-if="!isReadOnly" class="btn-remove" variant="danger" size="sm" @click="removeImage(i)">X</b-button>
            <b-img rounded :src="image" width="75" height="75" blank-color="#777" :alt="'img'+i" class="m-1" />
          </b-col>
        </div>
      </b-row>
    </div>
  </form>
</template>

<script>
  const MAX_IMAGE_UPLOAD = 20;

  export default {
    data() {
      return {
        uploadedImages: [],
        uploadFieldName: "images",
        isSaving: false
      };
    },
    props: ["isMultiple", "isReadOnly", "images"],
    methods: {
      reset() {
        this.uploadedImages = this.images;
        this.isSaving = false;
      },

      uploadImages(e) {
        this.isSaving = true;

        const files = e.target.files;
        console.log(files);
        if (!files[0]) {
          return;
        }
        if (this.uploadedImages.length + files.length > MAX_IMAGE_UPLOAD) {
          alert(`Too many images. Max is ${MAX_IMAGE_UPLOAD}`);
        }

        Array.from(files).forEach(file => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = e => {
            this.uploadedImages.push(e.target.result);
          };
        });
        this.$emit("imagesSelected", this.uploadedImages);

        this.isSaving = false;
      },

      removeImage(index) {
        this.uploadedImages.splice(index, 1);
      }
    },

    mounted() {
      if(!this.images){
        this.images = [];
      }
      this.reset();
    }
  };
</script>

<style>
  .dropbox {
    outline: 3px dashed #f1c40f;
    outline-offset: -5px;
    background: #f8f8f6;
    color: #777;
    padding: 10px 10px;
    min-height: 200px;
    height: 100%;
    width: auto;
    position: relative;
    cursor: pointer;
  }

  .dropbox-active {
    transition: background-color 0.5s;
  }

  .input-file {
    opacity: 0;
    width: 100%;
    height: 200px;
    top: 0;
    left: 0;
    position: absolute;
    cursor: pointer;
  }

  .input-file:disabled {
    cursor: default;
  }

  .dropbox-active:hover {
    background: #eee; /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
    font-weight: 300;
  }

  .btn-remove {
    cursor: pointer;
    position: absolute;
    font-size: 10px;
  }
</style>
