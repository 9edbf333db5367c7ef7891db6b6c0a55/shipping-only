<template lang="pug">
.container
  .row.justify-content-center
    .col-12.col-xl-12
      .card.jumbotron
        .card-body.text-center
          .row.justify-content-center
            .col-12.col-xl-10
              img.img-fluid.mt-n5.mb-4(
                v-bind:src='jumbotronImage' alt='' style='max-width: 272px;'
              )
              h1 {{ header }}
              p.text-muted
                | {{ paragraph }}
              a.btn.btn-primary.btn-lg.mt-3.text-white(
                @click='$emit("method-to-invoke", buttonConfig.methodToInvoke);'
              )
                | {{ buttonConfig.text }}
</template>

<script>
/* eslint-disable vue/require-default-prop */
export default {
  name: 'CallToActionJumbotron',
  props: {
    jumbotronImage: {
      type: String,
      default: 'https://res.cloudinary.com/raise/image/upload/v1551084537/scale.svg',
    },
    header: {
      type: String,
      required: true,
    },
    paragraph: {
      type: String,
      required: true,
    },
    buttonConfig: {
      type: Object,
      required: true,
    },
  },
};
</script>
