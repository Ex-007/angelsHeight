export default defineNuxtPlugin(() => {
    const user = useSupabaseUser()
    if(!user.value){
        return navigateTo('/')
    }
})