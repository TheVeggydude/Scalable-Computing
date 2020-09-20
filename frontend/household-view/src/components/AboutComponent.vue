<template>
    <div class="container">
        <b-navbar>
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <img
                    src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
                    alt="Lightweight UI components for Vue.js based on Bulma"
                >
            </b-navbar-item>
        </template>
        <template slot="start">
            <b-navbar-item @click="goHome">
                Home
            </b-navbar-item>
            <b-navbar-item @click="goAbout">
                About
            </b-navbar-item>
        </template>

        <template slot="end">
            <b-navbar-item tag="div">
                <div class="buttons">
                    <a class="button is-primary">
                        <strong>Sign up</strong>
                    </a>
                    <a class="button is-light">
                        Log in
                    </a>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
        <h1>About</h1>
    </div>
</template>

<script>
export default {
    methods: {
    goAbout() {
      this.$router.push('/about');
    },
    goHome() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>

</style>