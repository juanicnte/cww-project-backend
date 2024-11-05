/*CONTROLADORES DEL CARRITO*/
import getProducts from './cart/GetProducts.js';
import getProductsCart from './cart/GetProductsCart.js';
import addProductCart from './cart/AddProductCart.js';
import putProduct from './cart/PutProduct.js';
import deleteProduct from './cart/DeleteProduct.js';

/*CONTROLADORES DEL USUARIO*/
import getUserById from "./users/getUserById.js";
import login from "./users/login.js";
import register from "./users/register.js";

const controllers = {
  getProducts,
  getProductsCart,
  addProductCart,
  putProduct,
  deleteProduct,
  getUserById,
  login,
  register
};

export default controllers