import Product from '../model/Product.js';

const ProductController = {
    // Obtener todos los productos
    index: async (req, res) => {
        try {
            const products = await Product.find();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener productos' });
        }
    },

    // Obtener un producto por ID
    show: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el producto' });
        }
    },

    // Crear un nuevo producto
    save: async (req, res) => {
        console.log(req.body); // Para depuración, verifica que se reciban los datos correctos
        try {
            const newProduct = new Product(req.body);
            await newProduct.save();
            res.status(201).json(newProduct);
        } catch (error) {
            console.error("Error al crear el producto:", error); // Agrega un log de error para depuración
            res.status(500).json({ error: 'Error al crear el producto', details: error.message });
        }
    },


    // Actualizar un producto
    update: async (req, res) => {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedProduct) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el producto' });
        }
    },

    // Eliminar un producto
    remove: async (req, res) => {
        try {
            const deletedProduct = await Product.findByIdAndDelete(req.params.id);
            if (!deletedProduct) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json({ message: 'Producto eliminado' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    },
};

export default ProductController;
