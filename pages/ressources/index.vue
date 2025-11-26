<template>
    <div class="page-wrapper">
          <!-- Page header -->
            <TopNavbar />
          <div class="page-header d-print-none">
            <div class="container-xl">
              <div class="row g-2 align-items-center">
                <div class="col">
                    <h1 class="text-2xl font-bold mb-4 capitalize">Ressources</h1>
                </div>
              </div>
            </div>
          </div>
    </div>
        <div class="page-body">
            <div class="container-xl">
              <div class="row row-cards">
                <div class="col-md-4" v-for="resource in ressources" :key="resource.name">
                  <a class="card card-link" href="#" @click.prevent="goto(resource.name)">
                        <div class="card-body">
                          <div class="row">
                            <div class="col-auto">
                              <span class="avatar rounded">{{ getNormalNameTable(resource)[0] }}</span>
                            </div>
                            <div class="col">
                              <div class="font-weight-medium">{{ getNormalNameTable(resource) }}</div>
                            </div>
                          </div>
                        </div>
                  </a>

                </div>
                
              </div>
            </div>
        </div>

</template>
<script setup>
  import  axios from "axios"
import { useRoute, useRouter } from "vue-router"
  //const route = useRoute()
  const router = useRouter()
  //const table = route.params.table
  const { getAll } = useApi()
  const ressources = ref([])

  definePageMeta({
      middleware: ['auth']
    })

  onMounted(async () => {
    await load()
  })

  const goto = (tablename) => {
    router.push(`/ressources/${tablename}`)
  }

  const load = async () => {
    
    let {data} = await axios.get("/api/models/all")
    ressources.value = Object.keys(data).map(
      (key) => {
        return {"name":key, ...data[key]}
      }
    ) 
  }
  const getNormalNameTable = (resource) => {
    if(resource.legend?.label) {
      return resource.legend?.label
    }
    return resource?.normalName

  }
</script>