console.log('hola desde js');
const cards=document.getElementById('cards');
const items=document.getElementById('items');
const footer=document.getElementById('footer');
const template=document.getElementById('template-card').content;
const templateFooter=document.getElementById('template-footer').content;
const templateCarrito=document.getElementById('template-carrito').content;
const fragment=document.createDocumentFragment();
let carrito={};

document.addEventListener('DOMContentLoaded', ()=>{
    request_frutas();
    if(localStorage.getItem('carrito')){
        carrito=JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click', (e)=>{
    addtoCart(e);
})

items.addEventListener('click', (e)=>{
    btnAccion(e)
})

const request_frutas= async()=>{

    try {
        const data=await fetch('frutas.json');
        const res=await data.json()
        pintarCards(res);
    } catch (error) {
        console.log(error)
    }

}

const pintarCards=data=>{
    data.forEach(producto => {
        template.querySelector('h5').textContent=producto.title;
        template.querySelector('p').textContent=producto.precio;
        template.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        template.querySelector('.btn-dark').dataset.id=producto.id
        const clone = template.cloneNode(true)

        fragment.appendChild(clone);
    })
    cards.appendChild(fragment);

}

const addtoCart = (e)=>{
   
    if(e.target.classList.contains('btn-dark')){
       setCarrito(e.target.parentElement)
    }
    e.stopPropagation();
}

const setCarrito = objeto =>{

    const producto={
        id: objeto.querySelector('button').dataset.id,
        name: objeto.querySelector('h5').textContent,
        cost: objeto.querySelector('p').textContent,
        quantity: 1
    }
    //console.log(producto)

    if(carrito.hasOwnProperty(producto.id)){
        producto.quantity= carrito[producto.id].quantity + 1
    }

    carrito[producto.id]={...producto}
    pintarCarrito();

}

const pintarCarrito = () =>{
    items.innerHTML=''
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector('th').textContent=producto.id;
        templateCarrito.querySelectorAll('td')[0].textContent=producto.name
        templateCarrito.querySelectorAll('td')[1].textContent=producto.quantity
        templateCarrito.querySelector('.btn-info').dataset.id=producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id=producto.id
        templateCarrito.querySelector('span').textContent=producto.quantity * producto.cost

        const clone= templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    })
    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter=()=>{
    footer.innerHTML=''
    if(Object.keys(carrito).length===0){
        footer.innerHTML=`
            <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }

    const totalCantidad= Object.values(carrito).reduce((acc, {quantity})=>acc+quantity, 0)
    const totalPagar= Object.values(carrito).reduce((acc, {cost, quantity})=>acc+quantity*cost, 0)
    templateFooter.querySelectorAll('td')[0].textContent=totalCantidad
    templateFooter.querySelector('span').textContent=totalPagar

    const clone= templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar= document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', ()=>{
        carrito={}
        pintarCarrito();
    })
}

const btnAccion=(e)=>{
    
    if(e.target.classList.contains('btn-info')){
        
        const producto= carrito[e.target.dataset.id]
        producto.quantity++
        carrito[e.target.dataset.id]={...producto}
        pintarCarrito()
    }

    if(e.target.classList.contains('btn-danger')){
        
        const producto= carrito[e.target.dataset.id]
        producto.quantity--
        if(producto.quantity===0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }

    e.stopPropagation()
}
