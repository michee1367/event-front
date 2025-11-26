<template>
    
    <div class="p-6 max-w-3xl mx-auto">
        <h1 class="text-2xl font-bold mb-4">Assistant de gestion d'événements</h1>

        <div class="mt-6">
            <h3>Historique</h3>
                <ul>
                    <li v-for="(h, idx) in history" :key="idx">{{ h.client }} → {{ h.assistant || '—' }}</li>
                </ul>
        </div>
        
        <div v-if="assistant" class="mt-4 p-4 bg-gray-50">
            <h2 class="font-semibold">Réponse de l'assistant</h2>
            <div class="p-3 bg-assistant border rounded-4" style="white-space: pre-wrap; word-break: break-word;">
                {{ assistant }}
            </div>
    
    
            <div v-if="services && services.length" class="mt-3">
                <h3 class="font-medium">Services suggérés</h3>
                <ul>
                    <li v-for="s in services" :key="s.id">{{ s.nom }} — {{ s.description || '—' }} (prix: {{ s.prix || '—' }})</li>
                </ul>
            </div>
        </div>
    
        <div class="mb-4">

            <textarea v-if="!finalResponse" v-model="message" rows="4" class="w-full p-2 border rounded-4" placeholder="Décris la demande du client..."></textarea>
            <p v-else class="w-full p-2 border rounded">
                {{genererMessageClient(finalResponse)}}
            </p>
        </div>
    
        <div v-if="loading">En cours...</div>
    
        <div class="flex gap-2 mb-4">
            <form action="" @submit.prevent="send" ref="inputRef">
                <input v-if="false" v-model="clientPhone" placeholder="Téléphone du client (optionnel)" class="p-2 border rounded" />
                <input v-if="false" v-model="clientLieu" placeholder="Lieu (optionnel)" class="p-2 border rounded" />
                <button type="submit" class="px-4 py-2 bg-primary text-white rounded">Envoyer</button>
            </form>
        </div>    
    
    </div>
</template>
    
<script setup>
    import { ref } from 'vue'
    
    
    const message = ref('')
    const clientPhone = ref('')
    const clientLieu = ref('')
    const loading = ref(false)
    const assistant = ref(null)
    const services = ref([])
    const history = ref([])
    const isFirst = ref(true)
    const finalResponse = ref(null)

    const inputRef = ref(null)
    
    
    async function send () {
        if (!message.value) return

        loading.value = true
        let customMessage = ""
        if (isFirst.value) {
            customMessage = `${message.value} Lieu: ${clientLieu.value || 'Inconnu'}. Tel: ${clientPhone.value || 'Inconnu'}`
            isFirst.value = false
        }else {
            customMessage = message.value
        }


        try {
            const res = await fetch('/api/gimini/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: customMessage, 
                    historique:history.value
                })
            })
            const data = await res.json()
            /**return {
                    "type": "final",
                    "data": result_json
                }
            except:
                # Sinon, c’est une réponse normale de chat
                return {
                    "type": "message",
                    "response": ai_text
                } */
            if (res.ok) {
                //assistant.value = data.assistant
                //services.value = data.services || []
                if (data.type == "message") {
                    history.value.unshift({ client: message.value, assistant: data.response })
                    assistant.value = data.response
                }else if(data.type == "final") {
                    finalResponse.value = data.data

                    let dataResponse = {... finalResponse.value}
                    dataResponse.historique = history.value

                    const resService = await fetch('/api/gimini/services', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dataResponse)
                    })
                    //const data = await resService.json()
                    
                }
                message.value = ""
                inputRef.value?.focus()

            } else {
                assistant.value = "Nous rencontrons un problème veuillez nous laisser un message sur notre whatsapp +243 824029836"
            }
        } catch (e) {
            assistant.value = { error: String(e) }
        } finally {
            loading.value = false
        }
    }
    function genererMessageClient(data) {
        return `
        Merci beaucoup pour votre demande ! 🎉 \n

        Voici les informations que nous avons bien reçues : \n\n

        • 🎈 Type de service : ${data.type_service}\n
        • 📍 Lieu : ${data.lieu}\n
        • 📞 Téléphone : ${data.telephone}\n
        • 📅 Date souhaitée : ${data.date}\n
        • ❤️ Description : ${data.description}\n
        • 💰 Budget estimé : ${data.budget_estime}\n
        • 📝 Autres informations : ${data.autres_infos || "Aucune"}\n

        Nous vous recontactons très rapidement pour finaliser les détails et vous proposer la meilleure expérience possible. Merci pour votre confiance ! 🙏
        `.trim();
    }
</script>
    
    
<style scoped>
    textarea { min-height: 120px }
    .pre-wrap-responsive {
        white-space: pre-wrap !important;
        word-break: break-word !important;
        font-size: 0.95rem; /* lecture mobile */
    }
    .bg-assistant {
        background-color: #F5F5F5;

        color: #333333; 
    }
    .bg-utilisateur {
        background-color: #E7F1FF;

        color: #0A4DA3;
    }
</style>