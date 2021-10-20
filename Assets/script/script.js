var arr = [], nums = []

let exits = 0, prohibiteds = 0

let modal = document.querySelector('.modal-wrapper')
let table = document.querySelector('.little-table')
/* ACIONADO QUANDO O BOTAO SAVE FOR APERTADO */
function save() {
    let description = document.querySelector('#description')
    let value = document.querySelector('#valor')
    let data = ((new Date(document.querySelector('#date').value).getDate() + 1 )) + "/" + ((new Date(document.querySelector('#date').value).getMonth() + 1)) + "/" + new Date(document.querySelector('#date').value).getFullYear()

    if(description.value == '' || value.value == '' || data == '' || description.value == 0 || value.value == 0 || data == 0){
        msgError(description, 1)
        msgError(data, 2)
        msgError(value, 3)
    }else{
        let ob = makeTransation(description.value, value.value, data)

        arr.push(ob)

        calc(value.value, '')

        description.value = '',value.value = '',date.value  = ''

        let arrString = JSON.stringify(arr)

        if(localStorage.getItem('arr') == null){
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
    }else if(base == 2){
        msgError = dateError
        if(elemento == "" || elemento == null){
            msgError.style.display = 'block'
            elemento.style.border = '1px solid #E92929'
        }else if(base != 3){
            msgError.style.display = 'none'
            elemento.style.border = '0'
        }  
    }else if(base == 3){
        msgError = valueError
        if(elemento.value == "" || elemento == null){
            msgError.style.color = '#E92929'
            msgError.innerHTML = 'Adicione um valor para a transação'
            elemento.style.border = '1px solid #E92929'
        }else{
            msgError.style.color = '#000'
            msgError.innerHTML = 'Use o sinal - (negativo) para despesas e , (vírgula) para casas decimais'
            elemento.style.border = '0'
        }    
    }
    if(elemento.value == "" || elemento == null){
        msgError.style.display = 'block'
        elemento.style.border = '1px solid #E92929'
    }else if(base != 3){
        msgError.style.display = 'none'
        elemento.style.border = '0'
    }  
}
/* ABRE E FECHA A MODAL */
function toggleModal(){
    if(modal.style.display == 'grid'){
        modal.style.display = 'none'
    }else{
        modal.style.display = 'grid'
    }
}
/* FAZ O CALCULO */
function calc(value, state) {
    if(value < 0 && state == 'saida'){
        exits -= Number(value)
    }else if(value > 0 && state == 'entrada'){
        prohibiteds -= value
    }else if(value < 0 && state == ''){
        exits += value
    }else if(value > 0 && state == ''){
        prohibiteds += value
    }

    let total = prohibiteds - exits

    exitsHTML.innerHTML = exits
    prohibitedsHTML.innerHTML = prohibiteds
    totalHTML.innerHTML = total

    let numbers = {total: total, exits: exits, prohibiteds: prohibiteds}
    nums.push(numbers)
}
/* CRIA O ELEMENTO */
function makeTransation(transation, value, date) {
    var tr = document.createElement('div')
    tr.setAttribute("class", "tr")
   
    tr.innerHTML = 
        `<div class="td">
            <span>
                <i class='bx bx-minus-circle' onclick="removeTransation(this.parentNode)"></i>
            </span>
    
            <span class="date">
                ${date}
            </span>
            
            <span class="value prohibited">
                R$ ${value}
            </span>
            
            <span class="transation">
                ${transation}
            </span>
        </div>`
        if(value < 0){
            document.querySelector('.value').classList.add('exit')
        }else{
            document.querySelector('.value').classList.add('prohibited')
        }
    table.append(tr)

    return {description: transation, value: value, date: date}
}
/* REMOVE O ITEM DA LISTA */
function removeTransation(e) {
    let dad = e.parentNode
    let grandpa = dad.parentNode

    let arrParse = JSON.parse(localStorage.getItem('arr'))

    /* REMOVE O ITEM CLICADO DO HTML */
    for(let i = 0; i < arrParse.length; i++){
        if(table.children[i] == grandpa){
            grandpa.style.display = 'none'
            grandpa.parentNode.removeChild(grandpa)
        }
    }
    
    if(dad.children[2].innerText.replace(/.+\$/g, "") < 0){
        calc(dad.children[2].innerText.replace(/.+\$/g, ""), 'saida')
    }else{
        calc(dad.children[2].innerText.replace(/.+\$/g, ""), 'entrada')
    }

    /* REMOVE O ITEM CLICADO DO LOCAL STORAGE E ELMINA OS ESPAÇOS DA STRING COM TRIM() */
    for(let i = 0; i < arrParse.length; i++){
        if(arrParse[i].description == dad.children[3].innerText.trim() && arrParse[i].value == dad.children[2].innerText.replace(/.+\$/g, "").trim() && arrParse[i].date == dad.children[1].innerText.trim()){
            arrParse.splice(i,1)
            
            let arrString = JSON.stringify(arrParse)
            
            localStorage.setItem('arr', arrString)
        }
    }
}

onload = () => {
    let numString = JSON.stringify(nums)
    let numeros = JSON.stringify({total: 0, exits: 0, prohibiteds: 0})

    if(localStorage.getItem('nums') == null){
        nums.push(numeros)
        localStorage.setItem('nums', numString)

    }else{
        localStorage.setItem('nums', numString)
    }
    let arrParse = JSON.parse(localStorage.getItem('arr'))

    for(let i = 0; i < arrParse.length; i++){
        makeTransation(arrParse[i].description, arrParse[i].value, arrParse[i].date)
    }
    let numsParse = JSON.parse(localStorage.getItem('nums'))

    totalHTML.innerHTML = numsParse.total == undefined ? numsParse.total = 0 : numsParse.total = numsParse.total 
    exitsHTML.innerHTML = numsParse.exit == undefined ? numsParse.exit = 0 : numsParse.exit = numsParse.exit 
    prohibitedsHTML.innerHTML = numsParse.prohibiteds == undefined ? numsParse.prohibiteds = 0 : numsParse.prohibiteds = numsParse.prohibiteds 
}
function formatarMoeda() {
    var elemento = document.querySelector('#valor')
    var valor = elemento.value;

    valor = valor + '';
    valor = parseInt(valor.replace(/[\D]+/g, ''));
    valor = valor + '';
    valor = valor.replace(/([0-9]{2})$/g, ",$1");

    if (valor.length > 6) {
        valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    }

    elemento.value = valor;
    if(valor == 'NaN') elemento.value = '';
}