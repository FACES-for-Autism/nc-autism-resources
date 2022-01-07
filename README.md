# FACES for Autism Resource Repository

A web page that allows users to easily search, explore, and obtain useful information from the FACES repository.

The [FACES (Fostering Advocacy, Communication, Empowerment, and Support) program](https://sites.google.com/ncsu.edu/facesprogram/home) is an advocacy and empowerment program for black families raising autistic children based in the NC State University College of Education.

## Components

### ResourceListing.vue

This component provides a formatted view of the data fields for a resource.

### SelectInput.vue

This component provides a base configuration for a select element (and label) with two-way data binding.

### TheDataTable.vue

This component provides a simple table view of the data loaded into the application. This component is only relevant for testing purposes.

## Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm run serve
```

### Compiles and minifies for production

```bash
npm run build
```

### Lints and fixes files

```bash
npm run lint
```

### Builds and deploys to GitHub Pages

*Note: deployment is specific to repository referenced in `deploy.sh` script. See the Vue CLI reference for [deploying to GitHub Pages](https://cli.vuejs.org/guide/deployment.html#github-pages)*

```bash
npm run deploy
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
