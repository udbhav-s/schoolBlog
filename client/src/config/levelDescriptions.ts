export default [
  // Reader
  `
  Can see verified posts and comments. <br>
  Cannot submit posts and comments.
  `,
  // Member
  `
  Can see verified posts and comments. <br>
  Can submit posts for verification. <br>
  Can submit comments on verified posts.
  `,
  // Author
  `
  Can see verified posts and comments. <br>
  Submitted posts are automatically verified. <br>
  Can submit comments on verified posts.
  `,
  // Moderator
  `
  Can see all posts and comments. <br>
  Submitted posts are automatically verified. <br>
  Can delete any post or comment.
  `,
  // Admin - disabled
  // `
  // All the permissions of moderator. <br>
  // Can change the permission level of other user. <br>
  // (Such as setting new moderators or authors, or demoting them).
  // `
];
