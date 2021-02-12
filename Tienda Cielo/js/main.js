//Variables Generales//

let carga = document.getElementById("carga");
let nombreDestacado = document.getElementById("nombre-destacado");
let precioDestacado = document.getElementById("precio-destacado");
let body = document.getElementById("body");
let cardRow = document.getElementById("card-row");
let templateFooter = document.getElementById("template-footer").content;
let templateCarrito = document.getElementById("template-carrito").content;
let items = document.getElementById("items");
let footer = document.getElementById("footer");
const fragment = document.createDocumentFragment();
let btnCarrito = document.getElementById("btnCarrito");
let header = document.getElementById("header");
let productosSection = document.getElementById("productos-section");
let carritoSection = document.getElementById("carrito");
let badge = document.getElementById("badge");

//Objeto Carrito, donde se va a almacenar todo lo que compre el usuario//
let carrito = {};

//Variables de los cards del inicio//
let tituloCard0 = document.getElementById("title0");
let tituloCard1 = document.getElementById("title1");
let tituloCard2 = document.getElementById("title2");
let tituloCard3 = document.getElementById("title3");
let descripcionCard0 = document.getElementById("descripcion0");
let descripcionCard1 = document.getElementById("descripcion1");
let descripcionCard2 = document.getElementById("descripcion2");
let descripcionCard3 = document.getElementById("descripcion3");
let image0 = document.getElementById("image0");
let image1 = document.getElementById("image1");
let image2 = document.getElementById("image2");
let image3 = document.getElementById("image3");
let price0 = document.getElementById("precio0");
let price1 = document.getElementById("precio1");
let price2 = document.getElementById("precio2");
let price3 = document.getElementById("precio3");

//Todos los datos de los cards que contienen la informacion tomada desde la API//
let titulos = [tituloCard0, tituloCard1, tituloCard2, tituloCard3];
let descripciones = [
  descripcionCard0,
  descripcionCard1,
  descripcionCard2,
  descripcionCard3,
];

let precios = [price0, price1, price2, price3];

let imagenes = [image0, image1, image2, image3];

//Con Fetch, tomo todos los datos de la categoria Electronics de la API//
fetch("https://fakestoreapi.com/products/category/electronics")
  .then((res) => res.json())
  .then((data) => {
    //Ya muestro en pantalla la informacion del producto recomendado//
    mostrarDestacado(data);

    //Si existte el carrito en el local storage, me lo agarro y lo pongo donde estaba antes//
    if (localStorage.getItem("carrito")) {
      //Convierto todo el texto plano en una coleccion de objetos//
      carrito = JSON.parse(localStorage.getItem("carrito"));
      pintarCarrito();
    }
  });

// Las funciones de abrir y cerrar las pantallas apretando el boton del carrito//
btnCarrito.addEventListener("click", () => {
  if (header.classList.contains("active")) {
    header.classList.replace("active", "none");
    productosSection.classList.replace("active", "none");
    carritoSection.classList.replace("none", "active");
  } else {
    header.classList.replace("none", "active");
    productosSection.classList.replace("none", "active");
    carritoSection.classList.replace("active", "none");
  }
});

//Cuando la informacion de la API ya llegó, oculto la pantalla de carga y procedo a mostrar los datos del producto destacado//
function mostrarDestacado(data) {
  carga.style.display = "none";
  body.style.overflow = "auto";
  nombreDestacado.innerHTML = data[0].title;

  precioDestacado.innerHTML = data[0].price;

  for (let i = 0; i < titulos.length; i++) {
    titulos[i].innerHTML = data[i].title;
    descripciones[i].innerHTML = data[i].description;
    imagenes[i].setAttribute("src", data[i].image);
    precios[i].innerHTML = data[i].price;
  }
}

//Me pongo a escuchar el evento de click en alguna parte de la seccion de los cards de los productos//
cardRow.addEventListener("click", (e) => {
  addCarrito(e);
});

//Detecto un evento en la pantalla, si apreto sobre algo que tenga la clase comprar, me va a ejecturar el if, que agrega productos al carrito//
const addCarrito = (e) => {
  if (e.target.classList.contains("comprar")) {
    setCarrito(e.target.parentElement);
  }
  e.stopPropagation();
};

//Creo un objeto producto, donde va a ir almacenada la informacion del card que apreté//
const setCarrito = (objeto) => {
  const producto = {
    id: objeto.querySelector(".comprar").dataset.id,
    title: objeto.querySelector("h5").textContent,
    precio: objeto.querySelector("span").textContent,
    cantidad: 1,
  };

  //Si posee un id, osea que el producto existe dentro del objeto, significa que tengo que sumarle uno  a la cantidad//
  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }

  carrito[producto.id] = { ...producto };

  pintarCarrito();
};

const pintarCarrito = () => {
  items.innerHTML = "";
  //como el carrito es un objeto, lo habilito a ser recorrido con el forEach agregandole "Object.values(carrito)" , entonces de esta forma puedo usar esa propiedad de los arrays//
  Object.values(carrito).forEach((producto) => {
    templateCarrito.querySelector("th").textContent = producto.title;
    templateCarrito.querySelectorAll("td")[0].textContent = producto.title;
    templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
    templateCarrito.querySelector("span").textContent =
      producto.cantidad * producto.precio;

    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);

  pintarFooter();

  //Me voy guardando todos los elementos que voy comprando, con esto, cuando recargo la pagina, el contenido queda guardadito//
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

const pintarFooter = () => {
  footer.innerHTML = "";
  //Si no existe nada en el carrito, me va a mostrar el mensaje de que está vacio//
  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío</th>`;
    return;
  }

  //Con estos Reduce voy acumulando tanto el precio total,como la cantidad de productos//
  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );

  const nPrecio = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  //Aprovechando el acumulador de cantidad, actualizo el contador del carrito//
  badge.innerHTML = nCantidad;
  templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
  templateFooter.querySelector("span").textContent = nPrecio;

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  const btnVaciar = document.getElementById("vaciar-carrito");
  btnVaciar.addEventListener("click", () => {
    carrito = {};

    //Reinicio el contador del carrito tambien//
    badge.innerHTML = 0;
    pintarCarrito(carrito);
  });
};
