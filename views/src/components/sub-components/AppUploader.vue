<template>
    <div>
        <v-container fluid>
            <v-layout justify-center>
                <input type="file" v-show="false" ref="fileInput" @change="addFiles" :accept="fileType" :multiple="multipleFiles">
                <v-btn block color="primary" @click="selectFiles">{{ buttonText }}
                    <v-icon right>file_upload</v-icon>
                </v-btn>
            </v-layout>
        </v-container>
        <v-container fluid grid-list-lg text-xs-center>
            <transition-group name="scale-transition" tag="v-layout" class="wrap row">
                <v-flex xs12 :md6="!singleLine" v-for="(file, i) in files" :key="file.key" my-2>
                    <v-card>
                        <v-layout row wrap align-center align-start>
                            <v-flex xs4>
                                <img :src="file.imageURL" height="80" width="auto" style="max-width:90%">
                                <v-progress-circular v-if="!file.finished" :size="60" :width="7" :value="file.progress" :color="getProgressColor(file.progress)">
                                    {{ Math.round(file.progress) }}%
                                </v-progress-circular>
                                <v-progress-circular v-if="loading" indeterminate color="green"></v-progress-circular>
                            </v-flex>
                            <v-flex xs8>
                                <v-text-field append-icon="close" readonly v-model="file.name" :label="`${getSizeInKB(file.size)}KB`" :append-icon-cb="() => cancelUpload(i)" class="input-group--focused" />
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>
            </transition-group>
        </v-container>
    </div>
</template>

<script>
    export default {
      props: {
        fileType: {
          type: String,
          default: '*' // image/*
        },
        multipleFiles: {
          type: Boolean,
          default: true
        },
        value: {
          type: Array,
          required: true
        },
        singleLine: {
          type: Boolean,
          default: false
        },
        buttonText: {
          type: String,
          default: 'Upload'
        }
      },
      data() {
        return {
          files: [],
          keys: 0,
          loading: false
        };
      },
      methods: {
        isBadFile(file) {
          // dont add files with invalid extendsion
          return file.name.lastIndexOf('.') <= 0;
        },
        selectFiles() {
          this.$refs.fileInput.click();
        },
        addFiles(event) {
          const files = this.multipleFiles
            ? event.target.files
            : [event.target.files[0]];
          for (let i = 0; i < files.length; i += 1) {
            if (this.isBadFile(files[i])) {
              // eslint-disable-next-line
              continue;
            }
            const fileReader = new FileReader();
            const file = {
              key: this.keys,
              name: files[i].name,
              image: files[i],
              size: files[i].size,
              finished: false,
              progress: 0,
              abort: false
            };
            this.keys += 1;
            if(!this.multipleFiles && this.files.length !== 0) {
              this.cancelUpload(0);
            }
            this.files.push(file);
            this.$emit('input', this.files);

            fileReader.addEventListener('progress', (e) => {
              if (file.abort) fileReader.abort();
              file.progress = 100 * (e.loaded / file.size);
            });
            fileReader.addEventListener('load', () => {
              setTimeout(() => {
                file.imageURL = fileReader.result;
                file.finished = true;
              }, 800);
            });
            fileReader.readAsDataURL(files[i]);
          }
        },
        getSizeInKB(size) {
          return Math.round(size / 8192);
        },
        cancelUpload(index) {
          // files[index].fileReader.abort();
          this.files[index].abort = true;
          this.files.splice(index, 1);
          this.$emit('input', this.files);
        },
        getProgressColor(progress) {
          return [
            'green lighten-4',
            'green lighten-3',
            'green lighten-2',
            'green lighten-1',
            'green',
            'green'
          ][Math.round(progress / 20)];
        }
      },
      created() {
        this.files = this.value.map(f => ({
          key: this.keys++,
          imageURL: f,
          name: f,
          progress: 100,
          finished: true,
          size: 0
        }));
      }
    };
</script>

<style>

</style>
