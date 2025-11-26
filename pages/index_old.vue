<template>
  <div>

    <TopNavbar />

    <div class="page-wrapper">
        <!-- Page header -->
        <div class="page-header d-print-none">
          <div class="container-xl">
            <div class="row g-2 align-items-center">
              <div class="col">
                <h2 class="page-title">
                  Visites
                </h2>
              </div>
            </div>
          </div>
        </div>
        <!-- Page body -->
        <div class="page-body">
          <div class="container-xl">
            <div class="row row-cards">
              <div class="col-sm-6">
                <a class="card card-link" href="#" @click.prevent="goToVisits">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-auto">
                        <span class="avatar rounded">V</span>
                      </div>
                      <div class="col">
                        <div class="font-weight-medium">Visites</div>
                        <div class="text-secondary">{{ countsVisits }}</div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
              
  </div>
</template>

<script setup>
import Axios from "axios";
import TopNavbar from '~/components/TopNavbar.vue'
const router = useRouter()
// ✅ Déclaration du middleware Nuxt 3
definePageMeta({
  middleware: ['auth']
})

const countsVisits = ref(0)

const fetchVisits = async () => {
    try {
      //const { data } = await Axios.get("/api/models/records/visit/save?per_page=100")
      const { data } = await Axios.get("/api/visits?per_page=100")
      
      countsVisits.value = data.pagination?.total

    } catch (err) {
      console.error(err)
    }
  }

  const goToVisits = () => {
    router.push("/visits")
  }

// Charger les provinces au montage
onMounted(() => {
  fetchVisits()
})
</script>


<style>

</style>
