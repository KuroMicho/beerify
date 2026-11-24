const mongoose = require('mongoose');
const path = require('path');

// Carga variables de entorno (.env.development por defecto o el que indiques con NODE_ENV)
const env = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: path.resolve(__dirname, `../../.env.${env}`) });

const User = require('../models/User');
const Beer = require('../models/Beer');

const usersData = [
  {
    name: 'Admin Cervecería',
    email: 'admin@cerveceria.com',
    password: 'Password123!',
    role: 'admin',
  },
  {
    name: 'Cliente Demo',
    email: 'cliente@cerveceria.com',
    password: 'Password123!',
    role: 'user',
  },
];

const beersData = [
  { name: 'Andina Gold', style: 'Lager', abv: 4.5, ibu: 18, price: 8500, stock: 50 },
  { name: 'Selva Lupulada', style: 'IPA', abv: 6.8, ibu: 65, price: 12000, stock: 30 },
  { name: 'Noche de Malta', style: 'Stout', abv: 7.2, ibu: 40, price: 13500, stock: 25 },
  { name: 'Roja Artesanal', style: 'Red Ale', abv: 5.4, ibu: 28, price: 10500, stock: 40 },
  { name: 'Brisa Trigo', style: 'Wheat', abv: 5.0, ibu: 15, price: 9500, stock: 35 },
];

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error(`MONGO_URI no está definida en .env.${env}`);
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`✅ Conectado a MongoDB (${mongoose.connection.name})`);
};

const importData = async () => {
  await User.create(usersData);
  await Beer.insertMany(beersData);
  console.log('🌱 Datos importados correctamente (2 usuarios, 5 cervezas)');
};

const deleteData = async () => {
  await User.deleteMany();
  await Beer.deleteMany();
  console.log('🗑️  Base de datos limpiada correctamente');
};

const run = async () => {
  try {
    await connectDB();
    const flag = process.argv[2];

    if (flag === '--import' || flag === '-i') {
      await importData();
    } else if (flag === '--delete' || flag === '-d') {
      await deleteData();
    } else if (flag === '--reset' || flag === '-r') {
      await deleteData();
      await importData();
    } else {
      console.log('Uso: node src/scripts/seed.js [--import | --delete | --reset]');
    }
  } catch (error) {
    console.error('❌ Error en el script de seed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

run();