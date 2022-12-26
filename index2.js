    'use strict'


    dayjs.locale('es')

    document.addEventListener('DOMContentLoaded', event => {
        
        const initialIndex= 2
        const initialIndexCountry= 10

        const categories = [
            { value :'business', text :'Negocios'},
            { value:'entertainment', text:'Entretenimiento'},
            { value:'general',text:'General'},
            { value:'health',text:'Salud'},
            { value:'science',text:'Ciencia'},
            { value:'sports',text:'Deportes'},
            { value:'technology',text:'Tecnologia'}

        ]

        let countries = new Request('./data/countries.json')

        
        fetch(countries)
            .then(response => response.json())
            .then(countries => {
                populateSelectList('#categories', categories, 'value','text')
                const categoryList = document.querySelector('#categories')
                categoryList.selectedIndex= initialIndex

                populateSelectList('#countries', countries, 'code','name')
                const countryList = document.querySelector('#countries')
                countryList.selectedIndex= initialIndexCountry

                filterNews(categories[initialIndex].value,countries[initialIndexCountry].code)

                categoryList.addEventListener('change', e=>{
                    const list = e.target;
                    const item = list.options[list.selectedIndex]
                    filterNews(categories[list.selectedIndex].value,countryList.value)
                    console.log(`Seleccionó el elemento [${list.selectedIndex}] - (${item.value})`)
                })
                countryList.addEventListener('change', e=>{
                    const list = e.target;
                    const item = list.options[list.selectedIndex]
                    filterNews(categoryList.value,countries[list.selectedIndex].code)
                    console.log(`Seleccionó el elemento [${list.selectedIndex}] - (${item.value})`)
                })
               
            })
        
    })

    
    function filterNews(category,country){
        console.log(category);
        const apikey = 'b9429342c3a5431c9fa5833a930c51ba' //APIKEY ENTRE COMILLAS SIMPLES PREFERIBLEMENTE
        const language = 'es'
        const from = dayjs().format('YYYY-MM-DD')

        const url =`https://newsapi.org/v2/top-headlines?country=${country}&language=${language}&category=${category}&from=${from}&sortBy=popularity&apiKey=${apikey}`
        const request = new Request(url)

        fetch(request)
            .then(response => response.json())
            .then(news => showNews(news))
                       
    }

    function populateSelectList(selector, items = [], value = '', text = '') {
        let lista = document.querySelector(selector)
        lista.options.length = 0
        items.forEach(item => lista.add(new Option(item[text], item[value])))
    }
    function showNews(news) {
        if(news.status === 'ok') {
            document.querySelector('#news').innerHTML = ''
            news.articles.forEach(articulo => createArticle(articulo))
        } else{
            console.log('Tenemos problemas')
        }        
    
    }

    function createArticle(article= {}) {
        console.log(article);
        const date = dayjs(article.publishedAt).format('YYYY-MM-DD hh:mm A')
        const news=`      
        
            <article class="rounded overflow-hidden shadow-lg">
                <a href="${article.urlToImage}" target="_blank" rel="noopener noreferrer" onerror="this.src='./resources/assets/images/emojiserio.jpg'">
                    <div class="relative">
                        <img class="w-full" src="${article.urlToImage}?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="Falta la foto" onerror="this.src='./resources/assets/images/emojiserio.jpg'" >
                        <div class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25"></div>
                    </div>
                </a>

                <div class=" px-1.5 py-4">
                    <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="font-semibold text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out">
                        ${article.title}
                    </a>
                    <p class="text-gray-500 text-sm">
                        ${article.author ? article.author: "Autor Desconocido"}
                    </p>
                </div>

                <div class="px-6 py-4 flex flex-row items-center">
                    <span href="#" class="py-1 text-sm font-regular text-gray-900 mr-1 flex flex-row items-center">
                        <a class="open-treact-popup" href="#"> 
                            <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path></svg>
                        </a>   
                        <svg height="13px" width="13px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
                            <g>
                                <g>
                                    <path d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z M277.333,256
                                        c0,11.797-9.536,21.333-21.333,21.333h-85.333c-11.797,0-21.333-9.536-21.333-21.333s9.536-21.333,21.333-21.333h64v-128
                                        c0-11.797,9.536-21.333,21.333-21.333s21.333,9.536,21.333,21.333V256z"
                                    />
                                </g>
                            </g>
                        </svg>
                        <span class="ml-1">${date}</span>
                    </span>
                </div>
            </article>
        `
        document.querySelector('#news').insertAdjacentHTML('beforeend', news)
    }

    function closeTreactPopup(){ 
        document.querySelector(".treact-popup").classList.add("hidden");
    }
    function openTreactPopup(){ 
        document.querySelector(".treact-popup").classList.remove("hidden");
    }
    document.querySelector(".close-treact-popup").addEventListener("click", closeTreactPopup); 
    window.onclick = function(e){
        console.log(e)
        openTreactPopup()
        //element.addEventListener("click", openTreactPopup)
    }
   
    
    

    