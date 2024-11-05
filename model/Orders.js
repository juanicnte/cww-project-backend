// models/pedido.js

import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  items: [
    {
      title: String,
      unit_price: Number,
      quantity: Number,
      image: String,
    }
  ],
  transaction_amount: Number,
  status: { type: String, default: 'pendiente' }, // 'pendiente', 'completado', etc.
  createdAt: { type: Date, default: Date.now },
});

const Pedido = mongoose.model('Pedido', pedidoSchema);
export default Pedido;
