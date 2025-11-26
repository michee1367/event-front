<template>

<div  class=" d-flex flex-column">
    <div class="page page-center">
      <div class="container container-normal py-4">
        <div class="row align-items-center g-4">
          <div class="col-lg">
            <div class="container-tight my-5">
              <div class="text-center mb-4">
                <!---a href="." class="navbar-brand navbar-brand-autodark" v-if="false"><img src="./static/logo.svg" height="36" alt=""></a-->
              </div>
              <div class="card card-md my-5">
                <div class="card-body my-5">
                  <h2 class="h2 text-center mb-4">Connexion</h2>
                  <div ref="googleButton"></div>

                  <div v-if="user">
                    <p>Connecté en tant que : <strong>{{ user.name }}</strong></p>
                    <img :src="user.picture" alt="Avatar" width="50">
                    <button @click="logout">Se déconnecter</button>
                  </div>
                </div>
              </div>
              <div class="text-center text-secondary mt-3">
              </div>
            </div>
          </div>
          <div class="col-lg d-none d-lg-block">
            <img src="/undraw_secure_login_pdn4.svg" height="300" class="d-block mx-auto" alt="">
          </div>
        </div>
      </div>
    </div>
   </div>
</template>
<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useUserConnectStore } from "@/stores/user";
definePageMeta({
    
    middleware: [
      'guest'
    ],
  });

const config = useRuntimeConfig()

const userStore = useUserConnectStore()

const clientId = config.public.goole_client_id;
console.log(clientId)
const user = ref(null);
const googleButton = ref(null);
const token = ref(null); // Stocke le token JWT


const handleCredentialResponse = (response) => {
  token.value = response.credential; // Stocke le token JWT
  const userInfo = parseJwt(response.credential);
  user.value = userInfo;
  console.log("Utilisateur connecté :", userInfo);

  sendTokenToBackend(response.credential); // Envoyer au backend
};

// Déconnexion
const logout = () => {
  window.google.accounts.id.disableAutoSelect(); // Empêcher la reconnexion automatique
  user.value = null;
  token.value = null;
  console.log("Utilisateur déconnecté");
};

// Initialiser Google Sign-In
onMounted(() => {
  if (window.google) {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse
    });

    window.google.accounts.id.renderButton(googleButton.value, {
      theme: "outline",
      size: "large"
    });

    window.google.accounts.id.prompt(); // Afficher automatiquement le pop-up
  }
});

// Envoyer le token au backend
const sendTokenToBackend = async (token) => {
  try {
    //console.log(token)
    let url = config.public.google_url
    let auth_redirect = config.public.auth_redirect + "?token=" + token
    const router = useRouter()
    userStore.login(token)
    //const {data} = await axios.post("/api/login", { token })

    /*const response = await fetch("http://145.223.33.161/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    });*/
    //console.log("OKKK")
    console.log("Réponse du serveur :", data);
    //navigateTo(auth_redirect, { external: true })

    //const data = await response.json();
  } catch (error) {
    console.error("Erreur lors de l'envoi du token :", error);
  }
};

// Fonction pour décoder le JWT
const parseJwt = (token) => {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  let jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));

  return JSON.parse(jsonPayload);
};
</script>
