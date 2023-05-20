// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    routeRules: {
        // Static page generated on-demand, revalidates in background (ISG)   
        // '/blog/**': { swr: true },

        // Static page generated on-demand once (SSG - or at least mighty close)    
        // '/articles/**': { static: true },

        // Render these routes on the client (SPA)
        // '/r/**': { ssr: true },
        '/f/**': { ssr: true },
        '/logins/**': { ssr: false },
        '/dashboard/**': { ssr: false },
        '/users/**': { ssr: false },
        '/category-items/**': { ssr: false },
        '/information-items/**': { ssr: false },
        '/tasks/**': { ssr: false },
        '/tracking-url/**': { ssr: false },
        '/emails/**': { ssr: false },
        '/click-list/**': { ssr: false },
        '/user-groups/**': { ssr: false },
        '/redirecting/**': { ssr: false },
        '/**': { ssr: false },
    },
    modules: [
        '@nuxtjs/tailwindcss',
        '@cssninja/nuxt-toaster',
        // 'floating-vue/nuxt',
    ],
    app: {
        head: {
            title: 'SomeTraffic Global',
            meta: [
                {
                    name: 'description',
                    content: 'SomeTraffic Nuxt App,  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi vero, rem dolorem voluptatem sapiente veritatis perspiciatis architecto iusto iste delectus natus ad ut a quisquam. Ad qui et debitis sequi.'
                },
                { property: "fb:app_id", content: "1477435389326991" }
                // { property: "og:title", content: 'SomeTraffic App' },
                // { property: "og:description", content: 'SomeTraffic Nuxt App,  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi vero, rem dolorem voluptatem sapiente veritatis perspiciatis architecto iusto iste delectus natus ad ut a quisquam. Ad qui et debitis sequi.' },
                // { property: "og:image", content: 'https://www.rem0tework.com/wp-content/uploads/2022/10/we-work-remotely.webp' },
                // { property: "og:url", content: 'https://remotehub.ai' },
                // { property: "og:type", content: 'Web Application Site' },
            ],
        },
    },
    runtimeConfig: {
        public: {
            BASE_URL: process.env.BASE_URL,
            // API_BASE_URL: 'http://localhost:1212/api/',
            // API_BASE_URL: 'https://backend.sometraffic.com/api/'
            API_BASE_URL: 'https://backend.remotehub.ai/api/',
        },

    },
    plugins: [
        { src: '~/plugins/awn.js', ssr: false, mode: "client" }
    ],
    css: ['awesome-notifications/dist/style.css', 'assets/css/custom.css']
})
