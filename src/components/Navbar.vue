<template>
  <b-navbar>
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img class="logo" src="../assets/images/majinbuu.png" alt="Ma bư"/>
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item>
        <b-field>
          <b-input placeholder="Tìm kiếm" type="search" icon="magnify" rounded></b-input>
        </b-field>
      </b-navbar-item>
    </template>

    <template slot="end">
      <b-navbar-item tag="div">
        <div class="buttons">

        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
  export default {
    name: "Navbar"
  };
</script>

<style scoped>
  .logo {
    max-height: 2.5rem;
  }
</style>
