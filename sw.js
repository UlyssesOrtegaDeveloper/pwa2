self.addEventListener("install", e => {
    /* console.log("SW Instalado con exito"); */
    e.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll(["./", "./assets/css/style.css", "./assets/img/pwa-icons/logo192.png"]);
        })
    )
});
 
self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request)
        .then(response => {
            
            /* console.log(`Intercepting fetch request for: ${e.request.url}`); */

            if (response) {
                //recupera de cache
                return response;
            }
            // recuperar de la peticion a la url
            return fetch(e.request);
        })
        )
    })