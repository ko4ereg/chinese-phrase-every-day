<script setup>
definePageMeta({
  layout: "not-main",
});

useSeoMeta({
  title: "О нас",
});
</script>
<template>
  <v-card width="90%">
    <v-card-text>
      <div class="big-text d-flex align-center justify-center">你好!</div>
      <div class="text">
        Это небольшое баловство было сделано на волне моего изучения китайского
        языка, как в помощь себе, так и в целях пополнения портфолио забавным
        пет-проектом :)
        <br />
        При рендере появляется рандомная фраза, а так же можно пополнять
        словарик своими!
      </div>
    </v-card-text></v-card
  >
</template>
<style lang="scss" scoped>
.big-text {
  line-height: 1.4;
  font-weight: 700;
  font-size: 2rem;
  letter-spacing: 10px;
}
.text {
  line-height: 1.2;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: -1px;
  text-align: justify;
}
</style>
