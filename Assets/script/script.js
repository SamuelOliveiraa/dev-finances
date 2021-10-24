var arr = []

let arrString = JSON.stringify(arr)
if(localStorage.getItem('arr') == null ){
    localStorage.setItem('arr', arrString) 
}else{
    arr = JSON.parse(localStorage.getItem('arr'))
}

let nums = {total: 0, exits: 0, prohibiteds: 0}

let numString = JSON.stringify(nums)
if(localStorage.getItem('nums') == null ){
    localStorage.setItem('nums', numString) 
}else{
    nums = JSON.parse(localStorage.getItem('nums'))
}

totalHTML.innerHTML = nums.total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
exitsHTML.innerHTML = nums.exits.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
prohibitedsHTML.innerHTML = nums.prohibiteds.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
let exits = nums.exits, prohibiteds = nums.prohibiteds

let modal = document.querySelector('.modal-wrapper')
let table = document.querySelector('.little-table')

onload = () => {
    let numsParse = JSON.parse(localStorage.getItem('nums'))

    if(numsParse.total < 0){
        document.querySelector('.card3').style.background = '#E92929'
    }else{
        document.querySelector('.card3').style.background = '#49AA26'
    }
    let arrParse = JSON.parse(localStorage.getItem('arr'))

    for(let i = 0; i < arrParse.length; i++){
        makeTransation(arrParse[i].description, arrParse[i].value, arrParse[i].date)
    }
}
/* ACIONADO QUANDO O BOTAO SAVE FOR APERTADO */
function save() {
    let description = document.querySelector('#description')
    let data = document.querySelector('#date')
    let value = document.querySelector('#valor')

    if(description.value == '' || value.value == '' || data.value == '' || description.value == null || value.value == 0 || data.value.length < 10){
        msgError(description, 1)
        msgError(data, 2)
        msgError(value, 3)
    }else{
        let dateString = ((new Date(data.value).getDate() + 1 )) + "/" + ((new Date(data.value).getMonth() + 1)) + "/" + new Date(data.value).getFullYear() 
        let ob = makeTransation(description.value, Number(value.value), dateString)

        arr.push(ob)

        calc(Number(value.value), '')

        description.value = '',value.value = '',date.value  = ''

        let arrString = JSON.stringify(arr)
        if(localStorage.getItem('arr') == null ){
            localStorage.setItem('arr', arrString) 
        }else{
            localStorage.setItem('arr', arrString) 
        }

        toggleModal()
    }
}
/* MOSTRA A MENSAGEM DE ERRO DE QUALQUER INPUT DO MODAL */
function msgError(elemento, base){
    let msgError = ""
    if(base == 1){
        msgError = descriptionError
        error(elemento, msgError, 'none', '#E92929', 'Adicione uma descrição para a transação', '')
    }else if(base == 2){
        msgError = dateError 
        error(elemento, msgError, 'none', '#E92929', 'Adicione uma data para a transação', '')
    }else if(base == 3){
        msgError = valueError
        error(elemento, msgError, 'block', '#000', 'Adicione um valor para a transação', 'Use o sinal - (negativo) para despesas e , (vírgula) para casas decimais')    
    }
}
function error(elemento, msgError, noDisplay,styleColor,htmlError, html) {
    if(elemento.value == "" || elemento.value == null ){
        msgError.style.display = 'block'
        msgError.style.color = '#E92929'
        msgError.innerHTML =  htmlError 
        elemento.style.border = '1px solid #E92929'
    }else{
        msgError.style.display = noDisplay
        msgError.style.color = styleColor
        msgError.innerHTML = html
        elemento.style.border = '0'
    } 
}
/* CRIA O ELEMENTO */
function makeTransation(transation, value, date) {
    var tr = document.createElement('div')
    tr.setAttribute("class", "tr")
    let color = ''
    value < 0 ? color = 'exit' : color = 'prohibited'
    
    tr.innerHTML = 
        `<div class="td">
            <span>
                <i class='bx bx-minus-circle' onclick="removeTransation(this.parentNode)"></i>
            </span>
    
            <span class="date">
                ${date}
            </span>
            
            <span class="value ${color}">
                ${value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
            </span>
            
            <span class="transation">
                ${transation}
            </span>
        </div>`
        
    table.append(tr)

    return {description: transation, value: value, date: date}
}
/* FAZ O CALCULO */
function calc(value, state) {
    if(value < 0 && state == 'saida'){
        exits -= value
    }else if(value > 0 && state == 'entrada'){
        prohibiteds -= value
    }else if(value < 0 && state == ''){
        exits += value
    }else if(value > 0 && state == ''){
        prohibiteds += value
    }

    let total = Number((prohibiteds + (exits)).toFixed(2))
    total === -0 ? parseInt(total) : false
    
    console.log(total)

    total < 0 ? document.querySelector('.card3').style.background = '#E92929': document.querySelector('.card3').style.background = '#49AA26'

    totalHTML.innerHTML = total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    exitsHTML.innerHTML = exits.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    prohibitedsHTML.innerHTML = prohibiteds.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})

    nums.total = total
    nums.exits = exits
    nums.prohibiteds = prohibiteds
    
    let numString = JSON.stringify(nums)

    if(localStorage.getItem('nums') == null){
        localStorage.setItem('nums', numString)
    }else{
        localStorage.setItem('nums', numString)
    }
}
/* ABRE E FECHA A MODAL */
function toggleModal(){
    modal.style.display == 'grid' ? modal.style.display = 'none' : modal.style.display = 'grid'
}
/* REMOVE O ITEM DA LISTA */
function removeTransation(e) {
    let dad = e.parentNode
    let grandpa = dad.parentNode
    
    var replaceString = dad.children[2].innerText.replace(/[.]/g, '')
    replaceString = replaceString.replace(/[,]/g, '.')
    replaceString = parseFloat(replaceString.replace(/\s|[R$]/g, ""))

    /* REMOVE O ITEM CLICADO DO HTML */
    for(let i = 0; i < arr.length; i++){
        if(table.children[i] == grandpa){
            replaceString < 0 ? calc(replaceString, 'saida') : calc(replaceString, 'entrada')
            grandpa.style.display = 'none'
            grandpa.parentNode.removeChild(grandpa)
        }
    }
    /* REMOVE O ITEM CLICADO DO LOCAL STORAGE E ELMINA OS ESPAÇOS DA STRING COM TRIM() */
    for(let i = 0; i < arr.length; i++){
        if(arr[i].description == dad.children[3].innerText.trim() && arr[i].value == replaceString && arr[i].date == dad.children[1].innerText.trim()){
            arr.splice(i,1)
            let arrString = JSON.stringify(arr)
            localStorage.setItem('arr', arrString)
        }
    }
}