require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const http = require('http');
const { Server } = require('socket.io');
const expressLayouts = require('express-ejs-layouts');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const validator = require('validator');

const connectDB = require('./config/db');
const config = require('./config'); 

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.BASE_URL || 'http://localhost:5173', credentials: true }
});

const PORT = Number(process.env.PORT) || 3000;

(async () => {
  await connectDB(process.env.MONGO_URI);

   app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.use(expressLayouts);
  app.set('layout', 'layout');

  app.use(helmet());
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(express.json({ limit: '10kb' }));
  app.use(express.static(path.join(__dirname, 'public')));

    app.use(cors({ origin: process.env.BASE_URL || 'http://localhost:5173', credentials: true }));

    const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax'
    }
  });
  app.use(sessionMiddleware);

    app.use((req, res, next) => {
    if (req.session && req.session.userId) {
      res.locals.user = {
        id: String(req.session.userId),
        username: req.session.username || 'Usuario',
        role: req.session.userRole || 'user'
      };
    } else {
      res.locals.user = null;
    }
    next();
  });

   const authLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });
  app.use('/auth/login', authLimiter);
  app.use('/auth/register', authLimiter);

    const authRoutes = require('./routes/auth');
  const productRoutes = require('./routes/products');
  const indexRoutes = require('./routes/index');
  const apiProductRoutes = require('./routes/api/products');
  const apiCategoryRoutes = require('./routes/api/categories');

  app.use('/auth', authRoutes);
  app.use('/products', productRoutes);
  app.use('/', indexRoutes);
  app.use('/api/products', apiProductRoutes);
  app.use('/api/categories', apiCategoryRoutes);

    app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) return next(err);

  try {
    return res.status(err.status || 500).render('error', { message: err.message, error: process.env.NODE_ENV === 'development' ? err : {} });
  } catch (renderErr) {
    console.error('Error rendering error view:', renderErr);
    res.status(err.status || 500).send(`Error: ${err.message || 'Interno'}`);
  }
});


    const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
  io.use(wrap(sessionMiddleware));

  io.use((socket, next) => {
    const req = socket.request;
    if (!req.session || !req.session.userId) {
      return next(new Error('NO_SESSION'));
    }
        return next();
  });

  io.on('connection', (socket) => {
    const sess = socket.request.session || {};
    const username = sess.username || 'Anon';
    const userId = sess.userId || null;
    console.log('Socket conectado', socket.id, 'user=', username);

    socket.broadcast.emit('system', { text: `${username} se ha conectado`, createdAt: Date.now() });

    socket.on('chatMessage', (payload) => {
      try {
        const text = payload && payload.text ? String(payload.text).trim() : '';
        if (!text) return;
        if (text.length > 2000) return;
        const safeText = validator.escape(text);
        const message = { user: username, userId, text: safeText, createdAt: Date.now() };
        io.emit('chatMessage', message);
      } catch (err) {
        console.error('chatMessage error:', err);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket desconectado', socket.id, reason);
      socket.broadcast.emit('system', { text: `${username} se ha desconectado`, createdAt: Date.now() });
    });
  });

    server.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));

    const shutdown = async () => {
    console.log('Iniciando shutdown...');
    try {
      io.close();
      server.close(() => console.log('HTTP server cerrado'));
      const mongoose = require('mongoose');
      await mongoose.connection.close(false);
      console.log('Conexión MongoDB cerrada');
      process.exit(0);
    } catch (err) {
      console.error('Error en shutdown:', err);
      process.exit(1);
    }
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
})();
