<template>
  <v-app-bar>
    <v-toolbar-title>
      <img src="@/assets/logo.svg" alt="Logo" height="50" />
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn to="/settings">Настройки</v-btn>
    <v-btn to="/order-book">Order Book</v-btn>
  </v-app-bar>
</template>

<script setup lang="ts"></script>

<style scoped></style>
