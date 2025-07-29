CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre TEXT,
    correo TEXT UNIQUE,
    clave TEXT,
    rol TEXT DEFAULT 'cliente',
    creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre TEXT,
    descripcion TEXT,
    precio DECIMAL,
    url_imagen TEXT,
    categoria TEXT
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id),
    estado TEXT DEFAULT 'Pendiente',
    creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE productos_pedidos (
    id SERIAL PRIMARY KEY,
    id_pedido INT REFERENCES pedidos(id),
    producto_id INT REFERENCES productos(id),
    cantidad INT
);
