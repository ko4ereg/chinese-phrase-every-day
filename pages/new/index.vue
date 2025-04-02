<script setup>
import { collection, addDoc, doc, setDoc, query, where, getDoc } from "firebase/firestore";

definePageMeta({
  layout: "not-main",
});

const { $db } = useNuxtApp();
const error = ref(false);
const errorMessage = ref("");
const form = ref({
  chinese: "",
  pinyin: "",
  translation: "",
});

const snackbar = ref(false);
const onSubmit = async () => {
  if (!form.value.chinese || !form.value.pinyin || !form.value.translation) {
    error.value = true;
    errorMessage.value = "Заполните все поля!";
    return;
  }
  try {
    //проверка на уникальность по иероглифам
    const phraseRef = doc($db, "phrases", form.value.chinese);
    const phraseSnap = await getDoc(phraseRef);

    if (phraseSnap.exists()) {
      error.value = true;
      errorMessage.value = "Такая фраза уже есть!";
      return;
    }

    await setDoc(phraseRef, {
      chinese: form.value.chinese,
      pinyin: form.value.pinyin,
      translation: form.value.translation,
      createdAt: new Date(),
    });

    form.value = { chinese: "", pinyin: "", translation: "" };
    snackbar.value = true;
    error.value = false;
  } catch (err) {
    console.error("Ошибка при добавлении:", err);
    errorMessage.value = "Ошибка при добавлении!";
    error.value = true;
  }
};
</script>

<template>
  <v-form @submit.prevent="onSubmit" class="form">
    <v-text-field
      variant="outlined"
      v-model="form.chinese"
      placeholder="Иероглифы"
      type="text"
    />
    <v-text-field
      variant="outlined"
      v-model="form.pinyin"
      placeholder="Пиньин"
      type="text"
    />
    <v-text-field
      variant="outlined"
      v-model="form.translation"
      placeholder="Перевод"
      type="text"
    />

    <v-btn type="submit" variant="outlined">добавить</v-btn>
    <span v-if="formError">Пользователь существует</span>
  </v-form>

  <v-snackbar timeout="3000" v-model="snackbar">
    Слово успешно добавлено, 谢谢! :)

    <template v-slot:actions>
      <v-btn color="pink" variant="text" @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>

  <v-snackbar timeout="3000" color="error" v-model="error">
    {{ errorMessage }}

    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<style lang="scss" scoped>
.form {
  width: 90%;
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .v-text-field {
    width: 100%;
  }
}
</style>
