# The HPS Blog
A simple blog made with NestJS and Vue in typescript.

## Features
* HTML editing with image upload
* Attachments / File upload to S3 (or store locally)
* Role based access (5 levels)
* Login based on Google OAuth or SAML for organisations
* Verification system for posts
* Comments with linear replies
* Dark mode!
* Progressive web app support

## Stack
### Backend 

[NestJS](https://github.com/nestjs/nest) with [Objection.js](https://github.com/Vincit/objection.js/)

Database - Postgres

### Frontend

[Vue 2](https://github.com/vuejs/vue) + [Composition API](https://composition-api.vuejs.org/#summary) with typescript (plans to move to Vue 3 on release)

[Tailwind](https://github.com/tailwindlabs/tailwindcss) for styles

[Quill](https://github.com/quilljs/quill) rich text editor

## Getting started
Node.js and Postgres need to be installed. After pulling the repo create a .env file in /server and add the connection details of the database, Google OAuth credentials and optionally the credentials for AWS (refer to .env.example)

To get the server running, run:

```
cd schoolBlog
cd client
npm install
npm run build
cd ../server
npm install
npm run start:dev
```