<template>
  <div class="post-edit-container" v-if="post">
    <modal :class="{ 'is-active': imageUploading }">
      <div class="card">
        <h1 class="title is-3">Uploading image</h1>
      </div>
    </modal>

    <div class="section fixed-column">
      <div class="field">
        <div class="control">
          <input
            class="input title-input"
            type="text"
            name="title"
            v-model="post.title"
            placeholder="Title"
          />
        </div>
      </div>

      <div class="field">
        <!-- <label class="label">
          Content
        </label> -->
        <div class="editor">
          <quill-editor
            v-model="post.body"
            :options="quillOptions"
            @ready="editorReady"
          />
        </div>
      </div>

      <div class="field" v-if="categories">
        <div class="control">
          <span class="select">
            <select v-model="post.categoryId">
              <option :value="null" selected>Category</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </span>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control file">
          <label class="file-label">
            <input
              class="file-input"
              type="file"
              @change="uploadThumbnail"
              name="thumbnail"
              ref="thumbnail"
              accept=".png, .jpg, .jpeg, .gif"
            />
            <span class="file-cta">
              Upload Thumbnail
            </span>
          </label>
        </div>
        <div class="control" v-if="post.thumbnail">
          <button @click="removeThumbnail" class="button is-danger">
            Remove
          </button>
        </div>
      </div>
      <div class="field">
        <div class="image">
          <img v-if="post.thumbnail" :src="`/api/file/${post.thumbnail}`" />
        </div>
      </div>

      <div class="field">
        <file-pond
          name="file"
          ref="pond"
          label-idle="Attachments: Drop files here or <span class='filepond--label-action'>Browse</span>"
          allow-multiple="true"
          allow-paste="false"
          :files="attachedFiles"
          :server="filePondOptions"
        />
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button class="button is-small is-info" @click="savePost">
            Save Draft
          </button>
        </div>
        <div class="control">
          <button
            v-if="post.published"
            class="button is-small is-danger"
            @click="unpublishPost"
          >
            Unpublish
          </button>
          <button
            v-else
            class="button is-small is-primary"
            @click="publishPost"
          >
            Publish
          </button>
        </div>
        <div class="control">
          <button class="button is-small is-danger" @click="deletePost">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import HeroSection from "@/components/HeroSection.vue";
import Modal from "@/components/Modal.vue";
import { postService, categoryService, fileService } from "@/services";
import { defineComponent, ref, computed, watch } from "@vue/composition-api";
import { PostCreate, Category, ImageDropData } from "@/types";

// quill
import Quill from "quill";
import { quillEditor } from "vue-quill-editor";
import quillConfig from "@/config/quillOptions";
import QuillImageDropAndPaste from "quill-image-drop-and-paste";
Quill.register("modules/imageDropAndPaste", QuillImageDropAndPaste);
import "quill/dist/quill.snow.css";

// file uploader
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import { FilePondOptionProps } from "filepond";
const FilePond = vueFilePond();

export default defineComponent({
  name: "PostEdit",
  components: {
    HeroSection,
    quillEditor,
    FilePond,
    Modal
  },
  props: {
    postId: {
      type: Number as () => number
    }
  },

  setup(props, { root }) {
    const post = ref<PostCreate>(null);
    const categories = ref<Category[]>(null);
    const quillOptions = ref(quillConfig);
    const thumbnail = ref<HTMLInputElement>(null);
    const imageUploading = ref<boolean>(false);

    // mock files which show up as attachments (not actually loaded from server)
    const attachedFiles = computed(() => {
      return post.value?.attachments?.map(filename => {
        return {
          source: filename,
          options: {
            type: "limbo",
            file: {
              name: filename
            }
          }
        };
      });
    });

    // FilePond config
    const filePondOptions = ref<FilePondOptionProps["server"]>({
      process: {
        url: "/api/file/upload",
        method: "POST",
        onload: (data: string) => JSON.parse(data).data,
        ondata: (formData: FormData) => {
          if (!post.value?.id) return;
          // upload type - attachment
          formData.append("type", "attachment");
          formData.append("postId", post.value.id.toString());
          return formData;
        }
      },
      revert: (filename: string, load: Function, error: Function) => {
        fileService
          .deleteFile(filename)
          .then(() => load())
          .catch(() => {
            error();
          });
      },
      // revert: null,
      fetch: null,
      restore: null
    });

    // load the post
    const loadPost = async (id: number) => {
      const result = await postService.getById(id);
      if ("error" in result) {
        root.$toasted.error("Error loading post");
        throw result.message;
      } else {
        // set post
        post.value = result.data;
      }
    };
    watch(
      () => props.postId,
      id => {
        if (id) loadPost(id);
      }
    );

    // load categories
    const loadCategories = async () => {
      const result = await categoryService.getAll();
      if ("error" in result) {
        root.$toasted.error("Error loading categories");
        throw result.message;
      } else {
        categories.value = result.data;
      }
    };
    loadCategories();

    const uploadAndInsertImage = async (file: File, editor: Quill) => {
      if (!post.value?.id) return;

      imageUploading.value = true;

      const result = await fileService.uploadFile(post.value.id, file, "image");

      imageUploading.value = false;

      if ("error" in result) {
        root.$toasted.error("Error uploading file");
        throw result.message;
      }
      const filename = result.data;

      // insert the image in the editor
      const range = editor.getSelection();
      if (range === null) return;
      editor.insertEmbed(range.index, "image", `/api/file/${filename}`);
    };

    // add handlers
    const editorReady = (editor: Quill) => {
      // handler for image drop and paste
      editor.getModule("imageDropAndPaste").options.handler = (
        dataUrl: string,
        type: string,
        data: ImageDropData
      ) => {
        let filename = "";
        const match = /image\/(.*)/.exec(type);
        if (!match) return;
        else filename = "image." + match[1];
        const file = data.toFile(filename);
        uploadAndInsertImage(file, editor);
      };
      // add image upload handler
      editor.getModule("toolbar").addHandler("image", () => {
        // create an element for file input
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
          if (input === null) return;
          if (input.files === null) return;

          const file = input.files[0];
          await uploadAndInsertImage(file, editor);
        };
      });
    };

    const uploadThumbnail = async () => {
      if (!post.value?.id) return;

      if (thumbnail.value?.files?.[0]) {
        const file = thumbnail.value.files[0];
        const result = await fileService.uploadFile(
          post.value.id,
          file,
          "thumbnail"
        );
        if ("error" in result) {
          root.$toasted.error("Error uploading thumbnail");
          throw result.message;
        } else {
          post.value.thumbnail = result.data;
        }
      }
    };

    const removeThumbnail = async () => {
      if (!post.value?.thumbnail) return;

      const result = await fileService.deleteFile(post.value.thumbnail);
      if ("error" in result) {
        root.$toasted.error("Error deleting file");
        throw result.message;
      } else {
        post.value.thumbnail = "";
      }
    };

    const savePost = async () => {
      if (!post.value?.id) return;

      const result = await postService.update(post.value.id, post.value);
      if ("error" in result) {
        root.$toasted.error("Error saving result");
        throw result.message;
      } else {
        root.$toasted.success("Saved!");
      }
    };

    const publishPost = async () => {
      if (!post.value?.id) return;

      await savePost();

      const result = await postService.publish(post.value.id);
      if ("error" in result) {
        root.$toasted.error("Error publishing post");
        throw result.message;
      } else {
        root.$toasted.success("Post published!");
        root.$router.push({
          name: "Post",
          params: {
            id: post.value.id.toString()
          }
        });
      }
    };

    const unpublishPost = async () => {
      if (!post.value?.id) return;

      await savePost();

      const result = await postService.unpublish(post.value.id);
      if ("error" in result) {
        root.$toasted.error("An error occured");
        throw result.message;
      } else {
        root.$toasted.success("Post unpublished!");
        post.value.published = false;
      }
    };

    const deletePost = async () => {
      if (!post.value?.id) return;

      const result = await postService.delete(post.value.id);
      if ("error" in result) {
        root.$toasted.error("Error deleting post");
        throw result.message;
      } else {
        root.$toasted.success("Post deleted");
        root.$router.push("/");
      }
    };

    return {
      post,
      categories,
      quillOptions,
      savePost,
      publishPost,
      unpublishPost,
      deletePost,
      editorReady,
      thumbnail,
      uploadThumbnail,
      removeThumbnail,
      filePondOptions,
      attachedFiles,
      imageUploading
    };
  }
});
</script>
