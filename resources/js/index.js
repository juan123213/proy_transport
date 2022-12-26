
'use strict'

document.addEventListener('DOMContentLoaded', async () => {
    
    await cargarPagina('./resources/html/inicio.html', '#panel')
    
    const menu = document.querySelector('#toggle-menu + ul')
    document.querySelector('#toggle-menu')?.addEventListener('click', e => {
        menu.classList.toggle('flex-column')
    })

    const login = document.querySelector('.form-register')
    document.querySelector('.form-register')?.addEventListener('click', e => {
        login.classList.toggle('flex-column')
    })
    document.body.addEventListener('click',e =>{
        if(e.target.className== 'buttonlogin'){
            localStorage.setItem('login',"1")
            cargarOpcionLogin(e)
        }
         
    })

    const opciones = document.querySelectorAll('#toggle-menu + ul > li')
    opciones.forEach(opcion => {
        opcion.addEventListener('click', e => cargarOpcion(e))
    })

})

async function cargarOpcion(e) {
    e.preventDefault() // anulr el evento por defecto
    let empresas=null;
    let modelos=null;
    let destinos=null;
    let conductores=null;
    let vehiculos=null;
    let servicios=null;
    let destinosempresa=null;
    switch (e.target.textContent.toLowerCase()) {
        
        case 'conductor':
             empresas = await fetchData('./data/empresas.json')
            
            await cargarPagina('./resources/html/conductor.html', '#panel')
            llenarLista('#nameempresa', empresas, 'nit', 'nombre')
            break;    
        case 'terminal':
            await cargarPagina('./resources/html/terminal.html', '#panel')
            break;
        case 'salidas':
            vehiculos = await fetchData('./data/vehiculos.json')
            conductores = await fetchData('./data/conductores.json')
            destinos = await fetchData('./data/destinos.json')
            await cargarPagina('./resources/html/salidas.html', '#panel')
            llenarLista('#conductor', conductores, 'nit', 'nombre')
            llenarLista('#vehiculo', vehiculos, 'id', 'placa')
            llenarLista('#terminal', destinos, 'nombre', 'nombre')
            
            break; 
        case 'empresa':
            await cargarPagina('./resources/html/empresa.html', '#panel')
            break; 
        case 'destinoempresa':
            empresas = await fetchData('./data/empresas.json')
            destinos = await fetchData('./data/destinos.json')
            servicios = await fetchData('./data/servicios.json')
            await cargarPagina('./resources/html/destinoempresa.html', '#panel')
            llenarLista('#destino', destinos, 'nombre', 'nombre')
            llenarLista('#empresa', empresas, 'nit', 'nombre')
            llenarLista('#servicio', servicios, 'nombre', 'nombre')
            break;
        case 'tabla':
            let table = {
                id: 'tablatransportes', // el id que se dará a la tabla
                content: 'panel', // el id del contenedor donde se creará acá será en el panel
                class: 'table-style', // clase o clases CSS, ver index.css
                caption: 'Tabla sobre Transportes', // título de la tabla
                thead: ['FECHA','VEHICULO','EMPRESA', 'VALOR','SERVICIO','SILLAS'] // cabecera
            }
            
            // se agregan las filas de datos al objeto
            table.data = await fetchData('./data/tabla.json')
        
            console.log(table) 
            createTable(table)
            break;      
                   
        // ...
        case 'vehiculo':
             empresas = await fetchData('./data/empresas.json')
             modelos = await fetchData('./data/modelos.json')
            
            await cargarPagina('./resources/html/vehiculo.html', '#panel')

            llenarLista('#empresa', empresas, 'nit', 'nombre')
            llenarLista('#distribucion', modelos, 'id', 'modelo')
            llenarDistribucion(modelos[0].asientos,'casillas_botones')
           
            
            break; 
        
        case 'comprar':
            destinos = await fetchData('./data/destinos.json')
            destinosempresa = await fetchData('./data/destinoempresa.json')
            modelos = await fetchData('./data/modelos.json')
        
            await cargarPagina('./resources/html/comprar.html', '#panel')

            llenarLista('#destino', destinos, 'nombre', 'nombre')
            llenarLista('#hora', destinosempresa, 'servicio', 'hora')
            llenarDistribucion(modelos[0].asientos,'casillas_botones')
        
        
        break;     

        default:
            await cargarPagina('./resources/html/inicio.html', '#panel')
            break;

         
    }
}

async function cargarOpcionLogin(e) {
    e.preventDefault() // anular el evento por defecto
    console.log();
    switch (e.target.textContent.toLowerCase()) {
        
        case 'registrar':
            await cargarPagina('./resources/html/ingreso.html', '#panel')
            break;    
        case 'cancelar':
            await cargarPagina('./resources/html/login.html', '#panel')
            break;         
        // ...
    
        default:
            await cargarPagina('./resources/html/login.html', '#panel')
            break;
    }
}



async function fetchData(url, data = {}) {

    if (!('headers' in data)) {
        data.headers = {
            'Content-Type' : 'application/json'
        }
    }

    if ('body' in data) {
        data.body = JSON.stringify(data.body)
    }

    const respuesta = await fetch(url, data)

    if (!respuesta.ok) {
        throw new Error(`error ${respuesta.status} - ${respuesta.statusText}`)
    }

    return await respuesta.json()

}

async function cargarPagina(url, contenedor) {
    if(isLogin()){
        const respuesta = await fetch(url)

        if (respuesta.ok) {
            const html = await respuesta.text()
            document.querySelector(contenedor).innerHTML = html
            return
        }
    }
    else{
        const respuesta = await fetch('./resources/html/login.html')

        if (respuesta.ok) {
            const html = await respuesta.text()
            document.querySelector(contenedor).innerHTML = html
            return
        }
    }
    /*throw new Error `error ${respuesta.status} - ${respuesta.statusText}`*/
}

function isLogin(){
    if(localStorage.getItem('login')=="1"){
        return true;
    }

    return false;
}

function llenarLista(selector, items = [], valor = '', texto = '') {
    let lista = document.querySelector(selector)
    lista.options.length = 0
    items.forEach(item => lista.add(new Option(item[texto], item[valor])))
}

//metodo para hacer tabla

function createTable(table = {}) {
    // ver: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody
    // existen muchas formas de generar tablas. Esta es la menos elegante pero la más eficiente
    // *** faltan validaciones ***

    // se crea la cabecera de la tabla
    let htmlColsHeader = ''
    table.thead.forEach(column => htmlColsHeader += `<th>${column}</th>`)

    // se crea el cuerpo de la tabla
    let htmlRows = ''
    table.data.forEach(row => {
        // definir una fila
        let htmlRow = ''
        // agregar las columnas de cada fila
        for (const col in row) {
            htmlRow += `<td>${row[col]}</td>`
        }
        // agregar cada fila a las filas
        htmlRows += `<tr>${htmlRow}</tr>`
    })

    // crear el html de la tabla
    let htmlTable = `
      <div class="tabla_respo">
            <table id="${table.id}" class="${table.class}">
                <caption>${table.caption}</caption>
                <thead>
                    <tr>${htmlColsHeader}</tr>
                </thead>
                <tbody>
                    ${htmlRows}
                </tbody>
            </table>
       </div> 
    `

    // inyectar el html en el contenedor
    document.querySelector(`#${table.content}`).innerHTML = htmlTable
    
}
function llenarDistribucion(lista,contenedor){
 
 let rowDist=null;
 lista.forEach(fila => {
  rowDist+=`<div class="fila">`
    fila.forEach(columna => {
         if(columna==-1){
             rowDist+= `<span class="vacio"></span>`
         }
         else if(columna==1){
            rowDist+= `<button class="disponible"></button>`
         }
         else if(columna==2){
            rowDist+= `<button class="reservado"></button>`
         }
         else{
            rowDist+= `<button class="ocupado"></button>`
         }
     });
  rowDist+= `</div>`
 });

 document.querySelector(`#${contenedor}`).innerHTML = rowDist;

}




