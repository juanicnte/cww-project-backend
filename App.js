import express from "express";
import db from "./database/index.js";
import Pedido from "./model/Orders.js";
import controllers from "./controllers/index.js";
import cors from "cors";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago"; // Importa las clases necesarias
import { v4 as uuidv4 } from 'uuid'; // Para generar el UUID para X-Idempotency-Key
import verifyToken from "./middlewares/verifyToken.js";
import { isAdmin } from "./middlewares/verifyAdmin.js";
import ProductController from "./controllers/productControllers.js"; // Asegúrate de que la ruta sea correcta

const app = express();
const router = express.Router();

// Inicializa la configuración del cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: "TEST-1206211552846327-102400-8d55e1e6452429ca046d37f4db0c2c62-1091341662",
  options: { timeout: 5000 },
});

// Middleware para parsear JSON
app.use(cors());
app.use(express.json());

/* Rutas para Productos */

// Obtener todos los productos
app.get("/products", controllers.getProducts);

// Obtener un producto por ID
app.get("/products/:id", ProductController.show);

// Crear un nuevo producto
app.post("/products", ProductController.save); // Verifica que el usuario sea admin

// Actualizar un producto
app.put("/products/:id", ProductController.update); // Verifica que el usuario sea admin

// Eliminar un producto
app.delete("/products/:id", ProductController.remove); // Verifica que el usuario sea admin

/* Otras rutas existentes */

app.get("/products-cart", controllers.getProductsCart);
app.post("/products-cart", controllers.addProductCart);

app.post('/create-preference', async (req, res) => {
  try {
    // Crea una instancia de Preference
    const preference = new Preference(client);
    console.log(req.body);

    // Configuración de la preferencia
    const { items } = req.body; // Ahora items contendrá la estructura correcta

    const preferenceData = {
      items: items.map(item => ({
        title: item.title,
        unit_price: item.unit_price,
        quantity: item.quantity,
      })),
      back_urls: {
        success: 'http://localhost:3000/success',
        failure: 'http://localhost:3000/failure',
        pending: 'http://localhost:3000/pending',
      },
      auto_return: 'approved',
    };

    // Crea la preferencia
    const response = await preference.create({ body: preferenceData });
    res.json({ id: response.id }); // Devuelve el ID de la preferencia
  } catch (error) {
    console.error('Error creando la preferencia:', error);
    res.status(500).json({ error: 'Error creando la preferencia' });
  }
});

// Procesar el pago
app.post('/process_payment', async (req, res) => {
  const { image, transaction_amount, description, payment_method_id, payer, token, installments } = req.body;
  const userId = payer.id; // Asegúrate de que `req.user` tenga la información del usuario autenticado
  console.log(req.body);

  const payment = new Payment(client);

  const paymentData = {
    transaction_amount,
    token,
    description,
    payment_method_id,
    installments,
    payer: {
      email: payer.email,
    },
    external_reference: uuidv4(),
  };

  try {
    const response = await payment.create({ body: paymentData, requestOptions: { idempotencyKey: uuidv4() } });

    // Si el pago es exitoso, guarda el pedido en la base de datos
    if (response.status === 'approved') {
      const pedido = new Pedido({
        userId,
        items: req.body.items, 
        image: image, // Los artículos del pedido (productos del carrito)
        transaction_amount,
        status: 'completado',
      });
      await pedido.save();
      console.log(pedido);
    }

    res.json(response);
  } catch (error) {
    console.error('Error procesando el pago:', error);
    res.status(500).json({ error: 'Error procesando el pago' });
  }
});

// Obtener pedidos
app.get('/orders', verifyToken, async (req, res) => {
  console.log(req.user); // Verifica qué datos estás obteniendo

  try {
    const orders = await Pedido.find({ userId: req.user.id }); // Obtén el userId desde el token decodificado
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

app.get("/user", verifyToken, controllers.getUserById);
app.post('/register', controllers.register);
app.post('/login', controllers.login);

/* Rutas de carrito */
app.get("/products-cart", controllers.getProductsCart);
app.post("/products-cart", controllers.addProductCart);

/* PUT y DELETE */
app.put("/products-cart/:productId", controllers.putProduct);
app.delete("/products-cart/:productId", controllers.deleteProduct);

app.listen(4000, () => {
  console.log("Server funcionando en el puerto 4000");
  db();
});

export default app;
