const btn = document.querySelector('button');

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

const cardsArea = document.querySelector('.tarjetas');

// protocolo http hypertext transfer protocol 
// html hypertext markup laguaje
let products = []

fetch('https://e-commerce-api-academlo.herokuapp.com/api/products')
.then((response) => response.json())
.then(data => {
  products = [...data];
  insertProducts(data)
});

function deleteById(id) {
  fetch(`https://e-commerce-api-academlo.herokuapp.com/api/products/${id}`, 
  {method: 'DELETE'}
  ).then(response => {
    console.log(response);
    fetch('https://e-commerce-api-academlo.herokuapp.com/api/products')
    .then((response) => response.json())
    .then(data => {
      products = [...data];
      insertProducts(data)
    });
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
    </div>
    `;
  });
  deleteItems();
}


