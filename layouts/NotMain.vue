<template>
  <div class="background-noise"></div>
  <header>
    <NuxtLink to="/"> <div class="link">家 Дом</div></NuxtLink>
  </header>
  <v-main
    ><div class="main-content"><slot /></div
  ></v-main>
</template>

<style scoped lang="scss">
.main-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.v-main {
  background-color: rgba(214, 209, 199, 1);
}

header {
  background-color: rgba(214, 209, 199, 1);
  padding: 15px;

  .link {
    @include linkButton;
  }
}

.background-noise {
  background: url("https://static.tildacdn.com/tild3265-3261-4333-a361-353739633737/noise.gif");
  background-size: 70px;
  opacity: calc(15 / 100);
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  pointer-events: none;
}
</style>
