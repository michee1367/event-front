<template>
    <div>
    </div>
</template>
<script setup lang="ts">
//import axios from "axios";
import { useUserConnectStore } from "@/stores/user";
definePageMeta({
    
  middleware: [
    'auth',
    async function  (to, from) {
        
      if (process.server) return
        // Custom inline middleware
        const userStore = useUserConnectStore(
        )
        console.log("############OK##############")
        await userStore.logout()
        return navigateTo('/login')
    },
  ],
});

</script>