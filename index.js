const btn = document.querySelector('button');
const addBtn = document.querySelector('.add');
const productForm = document.querySelector('form');

console.log('trabajando con local storage');

// const saveLocal = [1, 2, 3, 4, 5];

// const saveObj = {name: 'Ian', id: 5}

// localStorage.setItem('nombre', saveLocal);
// localStorage.setItem('user', JSON.stringify(saveObj));
// localStorage.setItem('age', 45);

if(localStorage.getItem('theme') === '') {
  localStorage.setItem('theme', 'light');
}

const themeUsed = localStorage.getItem('theme');

if (themeUsed === 'dark') {
  document.body.style.background = '#2c2c2c';
  btn.textContent = 'Modo Claro';
} else {
  document.body.style.background = '#e3e3e3';
  btn.textContent = 'Modo Oscuro'
}



const cardsArea = document.querySelector('.tarjetas');

// protocolo http hypertext transfer protocol 
// html hypertext markup laguaje
let products = []
let isEditing = false;
let editingId = null;

function getProdcuts() {
  fetch('https://e-commerce-api-academlo.herokuapp.com/api/products')
  .then((response) => response.json())
  .then(data => {
    products = [...data];
    insertProducts(data)
  });
}

getProdcuts();

function addProduct(product) {
  fetch('https://e-commerce-api-academlo.herokuapp.com/api/products', 
  {
    method: 'POST', 
    body: JSON.stringify(product),
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(response => {
    console.log(response)
    getProdcuts();
  })
  .catch(error => console.error('Error:', error))
}

function edit(product, id) {
  fetch(`https://e-commerce-api-academlo.herokuapp.com/api/products/${id}`, 
  {
    method: 'PUT', 
    body: JSON.stringify(product),
    headers:{
      'Content-Type': 'application/json'
    }
  }
  ).then( response => {
    console.log(response);
    getProdcuts();
  })
}

function deleteById(id) {
  fetch(`https://e-commerce-api-academlo.herokuapp.com/api/products/${id}`, 
  {method: 'DELETE'}
  ).then(response => {
    console.log(response);
    getProdcuts();
  })
  .catch(error => console.log(error));
}

function deleteItems() {
  const deleteBtns = document.querySelectorAll('.eliminar');
  deleteBtns.forEach((button, i) => {
    button.addEventListener('click', () => {
      console.log(products[i].id);
      deleteById(products[i].id);
    })
  })
}

function editProduct() {
  const editButtons = document.querySelectorAll('.editar');
  editButtons.forEach((button, i) => {
    button.addEventListener('click', (e) => {
      isEditing = true;
      e.target.parentElement.parentElement.previousElementSibling.style.display = 'block';
      editingId = products[i].id;
      productForm.children[0].value = products[i].name;
      productForm.children[1].value = products[i].price;
      productForm.children[2].value = products[i].image;
    })
  })
}

function insertProducts(products) {
  cardsArea.innerHTML = products.map((product) => {
    const {image, name, price} = product
    return `
    <div class="tarjeta">
      <div class="img">
        <img src=${image} alt="">
      </div>
      <div class="contenido">
        <p class="categoria">Audífonos</p>
        <h3>${name}</h3>
        <p class="precio">$${price}</p>
      </div>
      <button class="eliminar">Eliminar</button>
      <button class="editar">Editar producto</button>
    </div>
    `;
  });
  deleteItems();
  editProduct();
}

productForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputs = [...e.target.children].filter((input) => input.value !== "agregar producto");
  const values = inputs.map((input) => input.value);
  const product = {name: values[0], price: values[1], image: values[2]}
  isEditing ? edit(product, editingId) : addProduct(product);
  isEditing = false;
  productForm.reset();
  e.target.parentElement.style.display = 'none';
})

addBtn.addEventListener('click', (e) => {
  const form = e.target.parentElement.nextElementSibling;
  const displayForm = document.defaultView.getComputedStyle(form).display;
  if(displayForm === 'none') {
    form.style.display = 'block';
  } else {
    form.style.display = 'none';
  }
})

btn.addEventListener('click', () => {
  const themeUsed = localStorage.getItem('theme');

  if (themeUsed === 'dark') {
    localStorage.setItem('theme', 'light'); 
    document.body.style.background = '#e3e3e3';
    btn.textContent = 'Modo Oscuro'
  } else {
    localStorage.setItem('theme', 'dark');
    document.body.style.background = '#2c2c2c'
    btn.textContent = 'Modo Claro'
  }
});


