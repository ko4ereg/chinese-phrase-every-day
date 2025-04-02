<script setup>
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const { $db } = useNuxtApp();
const phrases = ref([]);
const phrase = ref({});
const {} = useDisplay();

const getPhrases = async () => {
  error.value = false;
  loading.value = true;
  try {
    const querySnapshot = await getDocs(collection($db, "phrases"));
    if (querySnapshot) {
      phrases.value = querySnapshot.docs.map((doc) => doc.data());
    }
  } catch (err) {
    error.value = true;
    errorMessage.value = err;
  } finally {
    loading.value = false;
  }
};

const { mobile } = useDisplay();

const getRandomPhrase = () => {
  if (phrases.value.length === 0) {
    return {};
  }
  return phrases.value[Math.floor(Math.random() * phrases.value.length)];
};

const nextPhrase = async () => {
  if (phrases.value.length == 0) {
    await getPhrases();
  }
  phrase.value = getRandomPhrase();
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
  nextPhrase();
});
const loading = ref(false);

const error = ref(false);

const errorMessage = ref("");
</script>

<template>
  <v-container class="d-flex align-center justify-center flex-column ga-2">
    <v-card-title style="font-size: 1.5rem; letter-spacing: 2px"
      >🏮 Учить фразу 🏮</v-card-title
    >
    <v-card
      min-height="200"
      rounded="l"
      :width="mobile ? '90%' : '500px'"
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
    <div>
      <v-btn color="primary" @click="nextPhrase">Следующая фраза</v-btn>
      <v-btn color="secondary" @click="speakPhrase(phrase.chinese)" class="ml-2"
        >Произносить!</v-btn
      >
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
</style>
