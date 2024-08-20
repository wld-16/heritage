<template>
  <v-app>
    <v-layout>
      <v-app-bar
        color="primary"
        density="compact"
      >
        <template #prepend>
          <v-icon><LogoIcon /></v-icon>
          <v-app-bar-nav-icon @click="toggleNavigation" />
        </template>
      </v-app-bar>
      <v-navigation-drawer
        v-model="showNavigation"
        floating
        permanent
        expand-on-hover
        rail
      >
        <v-list
          density="compact"
        >
          <v-list-item
            prepend-icon="mdi-view-dashboard"
            value="home"
            name="Dashboard"
            @click="moveTo('home')"
          >
            Dashboard
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-family-tree"
            value="trees"
            name="Trees"
            @click="moveTo('trees')"
          >
            Trees
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-table"
            value="data"
            name="Data"
            @click="moveTo('data')"
          >
            Data
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-table-row-plus-after"
            value="forms"
            name="Forms"
            @click="moveTo('forms')"
          >
            Forms
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-forum"
            value="about"
            name="About"
            @click="moveTo('about')"
          >
            About
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <router-view></router-view>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>

import LogoIcon from "@/components/LogoIcon.vue";

export default {
  name: 'App',
  components: {LogoIcon},
  data: () => ({
    showNavigation: true
  }),
  methods: {
    moveTo(routeName) {
      this.$router.push({name: routeName})
    },
    toggleNavigation() {
      this.showNavigation = !this.showNavigation
    }
  }
}
</script>
