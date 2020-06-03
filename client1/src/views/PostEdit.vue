<template>
  <div class="post-edit-container" v-if="post">
    <!-- <hero-section>
      <h1 class="title" v-if="editMode">Edit Post</h1>
      <h1 class="title" v-else>Create Post</h1>
    </hero-section> -->

    <div class="section fixed-column">
      <div class="field">
        <div class="label">
          Title
        </div>
        <div class="control">
          <input
            class="input"
            type="text"
            name="title"
            v-model="post.title"
            placeholder="Title"
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
        <label class="label">
          Content
        </label>
        <div class="editor">
          <quill-editor
            v-model="post.body"
            :options="quillOptions"
            @ready="editorReady"
          />
        </div>
      </div>

      <file-pond
        name="file"
        ref="pond"
        label-idle="Drop files here or <span class='filepond--label-action'>Browse</span>"
        allow-multiple="true"
        :files="attachedFiles"
        :server="filePondOptions"
      />

      <div class="field is-grouped">
        <div class="control">
          <button class="button is-small is-info" @click="savePost">
            Save Draft
          </button>
        </div>
        <div class="control">
          <button
            v-if="post.published"
            class="button is-small is-primary"
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import HeroSection from "@/components/HeroSection.vue";
import { postService, categoryService, fileService } from "@/services";
import { defineComponent, ref, computed } from "@vue/composition-api";
import { PostCreate, Category } from "@/types";

// quill
import Quill from "quill";
import { quillEditor } from "vue-quill-editor";
import quillConfig from "@/config/quillOptions";
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
    FilePond
  },
  props: {
    create: {
      type: Boolean as () => boolean
    },
    postId: {
      type: Number as () => number
    }
  },

  setup(props, { root }) {
    const post = ref<PostCreate>(null);
    const categories = ref<Category[]>(null);
    const quillOptions = ref(quillConfig);
    const thumbnail = ref<HTMLInputElement>(null);

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

    // create a new post and then load it
    const createPost = async () => {
      const result = await postService.create();
      if ("error" in result) {
        root.$toasted.error("Error creating post");
        throw result.message;
      } else {
        post.value = result.data;
      }
    };

    if (props.postId) {
      loadPost(props.postId);
    } else if (props.create) {
      createPost();
    }

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

    const editorReady = (editor: Quill) => {
      //add image upload handler
      editor.getModule("toolbar").addHandler("image", () => {
        // create an element for file input
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
          if (input === null) return;
          if (input.files === null) return;
          if (!post.value?.id) return;

          const file = input.files[0];
          const result = await fileService.uploadFile(
            post.value.id,
            file,
            "image"
          );
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

    return {
      post,
      categories,
      quillOptions,
      savePost,
      publishPost,
      unpublishPost,
      editorReady,
      thumbnail,
      uploadThumbnail,
      removeThumbnail,
      filePondOptions,
      attachedFiles
    };
  }
});
</script>
