<template>
  <div class="background-noise"></div>
  <div class="background-image"></div>
  <div class="poster" title="Великий Китай, слава тебе в веках!">
    <span>伟大的中国，</span>
    <span>荣耀万岁！</span>
  </div>

  <header>
    <NuxtLink to="/about"><div class="link">О нас</div></NuxtLink>
    <NuxtLink to="/new"><div class="link">Создать фразу</div></NuxtLink>
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
  position: absolute;
  width: 100%;

  background-color: transparent;
  padding: 15px;
  display: flex;
  gap: 10px;
  .link {
    z-index: 3;
    @include linkButton;
  }
}
.background-image {
  background: center top / contain url("@/assets/images/lanterns1920.png")
    no-repeat scroll;
  position: fixed;
  top: 0%;
  height: 100%;
  width: 100%;
  pointer-events: none;
  @include adaptiveBackground;
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

.poster {
  background-color: yellow;
  position: fixed;
  right: 5%;
  top: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 15px;
  border: 0px solid red;
  transform: rotateZ(-5deg);
  height: auto;
  font-size: 2rem;
  z-index: 0;
  /* Неоновая пульсирующая граница */
  box-shadow: 0 0 30px 8px red;
  animation: pulseRegular 2s ease 0s infinite normal forwards;

  @keyframes pulseRegular {
    0% {
      transform: scale(1), rotateZ(-5deg);
    }

    50% {
      transform: scale(1.1);
    }

    100% {
      transform: scale(1), rotateZ(5deg);
    }
  }
}

@media (max-width: 500px) {
  .poster {
    height: auto;
    font-size: 0.7rem;
  }
}
@media (max-width: 424px) {
  .poster {
    height: auto;
    font-size: 0.7rem;
    top: 2%;
  }
}
</style>
