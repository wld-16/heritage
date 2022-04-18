<template>
	<v-app>
		<v-layout>
			<v-app-bar
				color="primary"
				density="compact"
			>
				<template v-slot:prepend>
					<v-app-bar-nav-icon @click="toggleNavigation"></v-app-bar-nav-icon>
				</template>

				<template v-slot:append>
					<v-btn icon="mdi-dots-vertical"></v-btn>
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
					<v-list-item prepend-icon="mdi-view-dashboard" value="home" name="Dashboard" @click="moveTo('home')">Dashboard</v-list-item>
					<v-list-item prepend-icon="mdi-view-dashboard" value="trees" name="Trees" @click="moveTo('trees')">Trees</v-list-item>
					<v-list-item prepend-icon="mdi-view-dashboard" value="data" name="Data" @click="moveTo('data')">Data</v-list-item>
					<v-list-item prepend-icon="mdi-view-dashboard" value="forms" name="Forms" @click="moveTo('forms')">Forms</v-list-item>
					<v-list-item prepend-icon="mdi-view-dashboard" value="branches" name="Branches" @click="moveTo('branches')">Branches</v-list-item>
					<v-list-item prepend-icon="mdi-forum" value="about" name="About" @click="moveTo('about')">About</v-list-item>
				</v-list>
			</v-navigation-drawer>
			<v-main>
				<router-view></router-view>
			</v-main>
		</v-layout>
	</v-app>
</template>

<script>
import HomePage from './components/HomePage.vue'

export default {
	name: 'App',
	components: {
		HomePage
	},
	data: () => ({
		showNavigation: true
	}),
	methods: {
		moveTo(routeName) {
			console.log(routeName)
			console.log(this.$router)
			this.$router.push({ name: routeName})
		},
		toggleNavigation() {
			this.showNavigation = !this.showNavigation
		}
	}
}
</script>
