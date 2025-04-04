<script setup>
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const { $db } = useNuxtApp();
const phrases = ref([]);
const phrase = ref({});
const {} = useDisplay();

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const hasChineseTTS = ref(false);
let intervalId = null;
const failCount = ref(0);
const checkChineseTTS = () => {
  const synth = window.speechSynthesis;
  if (!synth) {
    hasChineseTTS.value = false;
    return;
  }

  const voices = synth.getVoices();
  hasChineseTTS.value = voices.some((voice) => voice.lang.includes("zh"));

  if (hasChineseTTS.value) {
    clearInterval(intervalId); // Если нашли китайский TTS, отключаем таймер
  } else {
    failCount.value++;
    if (failCount.value >= 10) {
      clearInterval(intervalId); // Если 10 раз подряд нет - останавливаем проверки
    }
  }
};

const getPhrases = async () => {
  error.value = false;
  loading.value = true;
  try {
    const querySnapshot = await getDocs(collection($db, "phrases"));
    if (querySnapshot) {
      if (querySnapshot.docs.length === 0) {
        error.value = true;
        errorMessage.value = "Нет доступных фраз";
        return;
      }
      phrases.value = shuffleArray(querySnapshot.docs.map((doc) => doc.data()));
      phraseIndex.value = 0;
      phrase.value = phrases.value[phraseIndex.value];
    }
  } catch (err) {
    error.value = true;
    errorMessage.value = err;
  } finally {
    loading.value = false;
  }
};

const { mobile } = useDisplay();

const phraseIndex = ref(0);
const nextPhrase = async () => {
  if (phrases.value.length == 0) {
    await getPhrases();
  } else {
    phraseIndex.value = (phraseIndex.value + 1) % phrases.value.length;
    phrase.value = phrases.value[phraseIndex.value];
  }
};

const prevPhrase = () => {
  if (phraseIndex.value > 0) {
    phraseIndex.value--;
    phrase.value = phrases.value[phraseIndex.value];
  }
};

const speakPhrase = (text) => {
  if (!window.speechSynthesis) {
    console.error("Speech synthesis не поддерживается");
    return;
  }

  window.speechSynthesis.cancel(); //На всякий случай стопаем предыдущий голос

  const voices = window.speechSynthesis.getVoices();

  const chineseVoice = voices.find((voice) => voice.lang.includes("zh"));

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = chineseVoice || voices[0]; // Если китайского голоса нет, используем первый доступный
  utterance.lang = "zh-CN";

  if (voices.length === 0) {
    setTimeout(() => window.speechSynthesis.speak(utterance), 500); //Задержка если голос не подгрузился
  } else {
    window.speechSynthesis.speak(utterance);
  }
};

onMounted(async () => {
  await getPhrases();
  checkChineseTTS();
  intervalId = setInterval(checkChineseTTS, 2000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

const loading = ref(false);

const error = ref(false);

const errorMessage = ref("");
</script>

<template>
  <v-container class="d-flex align-center justify-center flex-column ga-2">
    <v-card-title>🏮 Учить фразу 🏮</v-card-title>
    <v-card
      min-height="300"
      rounded="l"
      :width="mobile ? '90%' : '600px'"
      class="pa-5 text-center d-flex align-center justify-center"
      elevation="4"
    >
      <template v-if="loading">
        <v-progress-circular indeterminate></v-progress-circular>
      </template>
      <template v-else>
        <template v-if="Object.keys(phrase).length !== 0">
          <v-card-text>
            <h1 class="chinese-text">{{ phrase.chinese }}</h1>
            <p class="pinyin">{{ phrase.pinyin }}</p>
            <p class="translation">{{ phrase.translation }}</p>
          </v-card-text>
        </template>
        <template v-else>
          <div class="d-flex ga-2 flex-column flex-wrap">
            <h1 class="chinese-text">Что-то пошло не так!</h1>
            <p class="pinyin">Возможно, стоит кликнуть "Следующая фраза"</p>
          </div>
        </template>
      </template>
    </v-card>
    <div class="buttons">
      <v-btn
        v-if="phraseIndex !== phrases.length - 1"
        color="primary"
        @click="nextPhrase"
        >Следующая фраза</v-btn
      >
      <v-btn
        v-if="hasChineseTTS"
        id="speakButton"
        color="secondary"
        @click="speakPhrase(phrase.chinese)"
        class="ml-2"
        >Произносить!</v-btn
      >
      <a
        v-if="!hasChineseTTS"
        :href="`https://www.dong-chinese.com/dictionary/search/${phrase.chinese}`"
        target="_blank"
      >
        <v-btn class="ml-2" color="secondary">Узнавать звук в словаре</v-btn>
      </a>
      <v-btn
        v-if="phraseIndex > 0"
        color="primary"
        @click="prevPhrase"
        :disabled="phraseIndex <= 0"
      >
        Назад
      </v-btn>
    </div>

    <div v-if="!hasChineseTTS" class="hasNoTTS">
      Грустить! Ваш браузер не поддерживает синтезатор китайской речи :(
      Смотреть произношение в словаре!
    </div>
  </v-container>

  <v-snackbar timeout="3000" color="error" v-model="error">
    {{ errorMessage }}

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="error = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped lang="scss">
.v-card {
  background: url("@/assets/images/background.jpg");

  .v-card-text {
    border-radius: 15px;
    background-color: rgba(0, 0, 0, 0.15);
    -webkit-box-shadow: 0px 8px 37px 14px rgba(66, 68, 90, 1);
    -moz-box-shadow: 0px 8px 37px 14px rgba(66, 68, 90, 1);
    box-shadow: 0px 8px 37px 14px rgba(66, 68, 90, 1);

    .chinese-text {
      font-size: 2rem;
      font-weight: bold;
    }
    .pinyin {
      padding: 0.2rem;
      justify-self: center;
      font-size: 1.2rem;
      color: #777;
    }
    .translation {
      font-size: 1.5rem;
      margin-bottom: 10px;
    }
  }
}

.v-card-title {
  font-size: 1.5rem;
  letter-spacing: 2px;
  z-index: 2;
}
.hasNoTTS {
  max-width: 90%;
  text-align: justify;
  font-size: 1.5rem;
  letter-spacing: 2px;
  z-index: 2;
}
.buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  .v-btn {
    width: max-content;
  }
}

@media (max-width: 1023px) {
  .v-card-title {
    font-size: 1.1rem;
    letter-spacing: 2px;
    z-index: 2;
  }
  .v-card {
    background: center center / cover url("@/assets/images/background.jpg")
      no-repeat scroll;

    .v-card-text {
      .chinese-text {
        font-size: 1.5rem;
        font-weight: bold;
      }
      .pinyin {
        padding: 0.2rem;
        justify-self: center;
        font-size: 1rem;
        color: #777;
      }
      .translation {
        font-size: 1.1rem;
        margin-bottom: 10px;
      }
    }
  }
  .buttons {
    flex-direction: column;
    .v-btn {
      height: 25px;
    }
  }

  .hasNoTTS {
    font-size: 1rem;
  }
}
</style>
