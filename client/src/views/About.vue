<template>
  <div class="fixed-column prose font-serif my-4">
    <h1>The Official HPS Begumpet Blog</h1>
    <p>
      This site is a general purpose blog for posting news or announcements of
      upcoming events, writing articles about school related experiences, or
      sharing your creative work with your fellow students.
    </p>
    <h2>
      How it works
    </h2>
    <p>
      Posts are organised by categories, and users have different roles. By
      default, everyone is a <strong>Member</strong>, which means you can
      comment, reply and create posts, but posts will have to be approved by a
      <strong>Moderator</strong> (or <strong>Admin</strong>) before they're
      visible to others. If you're a regular writer, you can also contact an
      admin to be promoted to an <strong>Author</strong>, in which case all your
      posts are automatically verified and are immediately visible to everyone
      else.
    </p>
    <h2>Moderators</h2>
    <user-list :minLevel="3" :showListOptions="false" />
    <h2>Code</h2>
    <p>
      This project is completely open source to encourage learning and
      contribution. The code is hosted
      <a href="https://github.com/udbhav-s/schoolBlog">here on GitHub</a>, along
      with documentation on how to get started.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import UserList from "@/components/user/UserList.vue";

export default defineComponent({
  name: "About",
  components: {
    UserList
  }
});
</script>
