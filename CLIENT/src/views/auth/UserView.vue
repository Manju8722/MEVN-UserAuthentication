<template>
  <div id="user">
    <div class="container">
      <Suspense>
        <template #default>
          <div v-if="user" class="card card-body mt-4">
            <h5 class="card-title">Username: {{ user.userName }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Email: {{ user.email }}</h6>
            <h6 class="card-subtitle mb-2 text-muted">First Name: {{ user.firstName }}</h6>
            <h6 class="card-subtitle mb-2 text-muted">Last Name: {{ user.lastName }}</h6>

          </div>
        </template>

        <template #fallback>
          <p>Loading...</p>
        </template>
      </Suspense>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();

const user = computed(() => authStore.userDetail);


</script>

<style scoped>
#user .card{
  max-width: 40vw;
  margin: auto;
}
</style>
  