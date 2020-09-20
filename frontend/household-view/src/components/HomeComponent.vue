<template>
  <div class="container">
    <div class="devices-container">
      <div
        class="device"
        v-for="(device, index) in devices"
        v-bind:item="device"
        v-bind:index="index"
        v-bind:key="device.id"
      >
        {{ `${device.id}: ${device.deltat}` }}
      </div>
    </div>
    <button @click="getData">Get predictions</button>
  </div>
</template>

<script>
import StatusRetriever from '../services/StatusRetriever'
export default {
  data() {
    return {
      devices: []
    }
  },
  methods: {
    goAbout() {
      this.$router.push('/about');
    },
    goHome() {
      this.$router.push('/');
    },
    async getData() {
      const req = await StatusRetriever.getStatus();
      const data = req.data;
      this.devices = data;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
