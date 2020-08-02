<template>
  <div class="post-edit-container" v-if="post">
    <modal :class="{ 'is-active': imageUploading }">
      <div class="p-8 bg-clr-bg-secondary rounded">
        <spinner />
        <h1 class="text-4xl">Uploading image</h1>
      </div>
    </modal>

    <div class="fixed-column space-y-2 mb-10">
      <input
        class="input text-2xl md:text-5xl font-bold focus:outline-none"
        type="text"
        name="title"
        v-model="post.title"
        placeholder="Title"
      />

      <div id="editor">
        <quill-editor
          v-model="post.body"
          :options="quillOptions"
          @ready="editorReady"
          class="prose prose-lg font-serif"
        />
      </div>

      <div class="bg-clr-bg-secondary p-2">
        <div class="my-4" v-if="categories">
          <select v-model="post.categoryId" class="input">
            <option :value="null" selected>Category</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="flex flex-row space-x-4 items-stretch">
          <div>
            <label class="file-label">
              <input
                class="hidden"
                type="file"
                @change="uploadThumbnail"
                name="thumbnail"
                ref="thumbnail"
                accept=".png, .jpg, .jpeg, .gif"
              />
              <span class="button p-3 text-base inline-block cursor-pointer">
                Upload Thumbnail
              </span>
            </label>
          </div>
          <button
            v-if="post.thumbnail"
            @click="removeThumbnail"
            class="button button-danger text-base"
          >
            Remove
          </button>
        </div>
        <div class="my-2">
          <img v-if="post.thumbnail" :src="`/api/file/${post.thumbnail}`" />
        </div>
      </div>

      <div class="py-4">
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

      <div class="flex flex-row flex-wrap justify-end space-x-2">
        <div>
          <button class="button button-success" @click="savePost">
            <template v-if="post.published">Save Changes</template>
            <template v-else>Save Draft</template>
          </button>
        </div>
        <div>
          <button
            v-if="!post.published"
            class="button button-success"
            @click="publishPost"
          >
            Publish
          </button>
        </div>
        <div>
          <button class="button button-danger" @click="deletePost">
            Delete
          </button>
        </div>
      </div>

      <div v-if="!isModOrAbove" class="text-clr-text-light">
        <font-awesome-icon icon="info-circle" />
        Once you publish the post, it will be submitted for verification. It
        will be visible to other users when a moderator approves it.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Modal from "@/components/Modal.vue";
import Spinner from "@/components/Spinner.vue";
import { postService, fileService } from "@/services";
import { defineComponent, ref, computed, watch } from "@vue/composition-api";
import { PostCreate, Category, ImageDropData } from "@/types";
import { categoryStore, userStore } from "@/store";

// quill
import Quill from "quill";
import { quillEditor } from "vue-quill-editor";
import quillConfig from "@/config/quillOptions";
import QuillImageDropAndPaste from "quill-image-drop-and-paste";
Quill.register("modules/imageDropAndPaste", QuillImageDropAndPaste);
import "@/assets/styles/quill.snow.css";

// file uploader
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import { FilePondOptionProps } from "filepond";
const FilePond = vueFilePond();

export default defineComponent({
  name: "PostEdit",
  components: {
    quillEditor,
    FilePond,
    Modal,
    Spinner
  },
  props: {
    postId: {
      type: Number as () => number
    }
  },

  setup(props, { root }) {
    const post = ref<PostCreate>(null);
    const categories = computed<Category[]>(categoryStore.getters.categories);
    const quillOptions = ref(quillConfig);
    const thumbnail = ref<HTMLInputElement>(null);
    const imageUploading = ref<boolean>(false);
    const isModOrAbove = ref<boolean>(userStore.getters.isModOrAbove);

    // reload categories
    categoryStore.mutations.loadCategories();

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
      try {
        const result = await postService.getById(id);
        // set post
        post.value = result;
      } catch (err) {
        if (err.statusCode === 403 || err.statusCode === 404) {
          root.$router.push({ name: "NotFound" });
        } else {
          root.$toasted.error("Error loading post");
        }
      }
    };
    watch(
      () => props.postId,
      id => {
        if (id) loadPost(id);
      }
    );

    const uploadAndInsertImage = async (file: File, editor: Quill) => {
      if (!post.value?.id) return;

      imageUploading.value = true;

      let filename;
      try {
        filename = await fileService.uploadFile(post.value.id, file, "image");
      } catch (err) {
        root.$toasted.error("Error uploading file");
        if (err.status === 413) {
          // 413 request entitiy too large
          root.$toasted.error("File too large\nLimit is 100MB");
        }
        throw err.message;
      }

      imageUploading.value = false;

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

        imageUploading.value = true;

        try {
          const result = await fileService.uploadFile(
            post.value.id,
            file,
            "thumbnail"
          );
          // assign thumbnail
          post.value = Object.assign({}, post.value, {
            thumbnail: result
          });
        } catch (err) {
          if (err.status === 413) {
            // 413 request entitiy too large
            root.$toasted.error("File too large\nLimit is 100MB");
          } else {
            root.$toasted.error("Error uploading thumbnail");
            throw err.message;
          }
        }

        imageUploading.value = false;
      }
    };

    const removeThumbnail = async () => {
      if (!post.value?.thumbnail) return;

      const result = await fileService.deleteFile(post.value.thumbnail);
      if ("success" in result) {
        post.value.thumbnail = "";
      } else {
        root.$toasted.error("Error deleting file");
        throw result.message;
      }
    };

    const savePost = async () => {
      if (!post.value?.id) return;

      try {
        await postService.update(post.value.id, post.value);
        root.$toasted.success("Saved!");
      } catch {
        root.$toasted.error("Error saving result");
      }
    };

    const publishPost = async () => {
      if (!post.value?.id) return;

      try {
        await savePost();
        await postService.publish(post.value.id);
        root.$toasted.success("Post published!");
        root.$router.push({
          name: "Post",
          params: {
            id: post.value.id.toString()
          }
        });
      } catch {
        root.$toasted.error("Error publishing post");
      }
    };

    const deletePost = async () => {
      if (!post.value?.id) return;
      if (!confirm("Are you sure you want to permanently delete this post?"))
        return;

      try {
        await postService.delete(post.value.id);
        root.$toasted.success("Post deleted");
        // redirect
        if (post.value.published) root.$router.push("/");
        else root.$router.push({ name: "CurrentUser" });
      } catch {
        root.$toasted.error("Error deleting post");
      }
    };

    return {
      post,
      categories,
      quillOptions,
      savePost,
      publishPost,
      deletePost,
      editorReady,
      thumbnail,
      uploadThumbnail,
      removeThumbnail,
      filePondOptions,
      attachedFiles,
      imageUploading,
      isModOrAbove
    };
  }
});
</script>
