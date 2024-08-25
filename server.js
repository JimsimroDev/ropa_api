import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

// Obtener el directorio del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de CORS
app.use(cors());

// Configuración para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración para parsear JSON
app.use(express.json());

// Configuración de la base de datos
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Ingeniero20',
  database: 'ropa_api',
});

const promisePool = pool.promise();

// Crear tabla de productos si no existe
const createProductosTable = async () => {
  const query = `
        CREATE TABLE IF NOT EXISTS productos (
            id INT PRIMARY KEY,
            title VARCHAR(255),
            description TEXT,
            price DECIMAL(10, 2),
            image VARCHAR(255)
        )
    `;
  await promisePool.query(query);
};

// Crear tabla de usuarios si no existe
const createUsuariosTable = async () => {
  const query = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            password VARCHAR(255)
        )
    `;
  await promisePool.query(query);
};

// Inicializar tablas
const initializeDatabase = async () => {
  await createProductosTable();
  await createUsuariosTable();
};

initializeDatabase();

// Endpoint para obtener productos desde la API externa
/*app.get('/api/productos', async (req, res) => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const productos = await response.json();

    // Guardar productos en la base de datos
    for (const producto of productos) {
      await promisePool.query(
        'INSERT INTO productos (id, title, description, price, image) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title=?, description=?, price=?, image=?',
        [producto.id, producto.title, producto.description, producto.price, producto.image, producto.title, producto.description, producto.price, producto.image]
      );
    }

    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});*/


//obtener usuarios
app.get('/api/usuarios', async (req, res) =>{
  try{
    const [usuarioEncotrado] = await pool.query('SELECT * FROM usuarios');
    res.json(usuarioEncotrado);
    console.log(usuarioEncotrado);
    alert(usuarioEncotrado)
  }catch(error){
console.error('Error al obtener usuarios: ', error);
res.status(500).json({erro: 'error al obtener usuarios '})
  }

});

// Endpoint para obtener un producto específico
app.get('/api/productos/:id', async (req, res) => {
  const productoId = parseInt(req.params.id);

  try {
    const [rows] = await promisePool.query('SELECT * FROM productos WHERE id = ?', [productoId]);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// Endpoint para manejar el registro de usuarios
app.post('/api/registro', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son necesarios' });
  }

  try {
    // Aquí deberías hacer un hash de la contraseña antes de guardarla
    const [result] = await promisePool.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
      [nombre, email, password]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Servir el archivo estático index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
