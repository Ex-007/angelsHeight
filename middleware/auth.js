export default defineNuxtRouteMiddleware(async(to, from) => {
    const user = ref(null)
    const client = useSupabaseClient()
    try {
        const {data, error} = await client.auth.getUser()
        if(error || !data.user){
            console.log('No authenticated user')
            return navigateTo('/Login')
        }
        user.value = data.user
    } catch (err) {
        return navigateTo('Login')
    }
})