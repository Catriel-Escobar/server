import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/hashPassword.js';

const prisma = new PrismaClient();

async function main() {
  // Seed de productos
 const products = [
    {
      nombre: "Hamburguesa Clásica",
      descripcion: "Carne de res, lechuga, tomate, cebolla, pepinillos y salsa especial",
      precio: 12.99,
      imagenUrl: "/classic-hamburger.jpg",
      categoria: "hamburguesas",
      estado: "Disponible",
    },
    {
      nombre: "Hamburguesa BBQ",
      descripcion: "Carne de res, bacon, cebolla caramelizada, queso cheddar y salsa BBQ",
      precio: 15.99,
      imagenUrl: "/bbq-hamburger-with-bacon.jpg",
      categoria: "hamburguesas",
      estado: "Disponible",
    },
    {
      nombre: "Hamburguesa Veggie",
      descripcion: "Hamburguesa de lentejas, aguacate, tomate, lechuga y mayonesa vegana",
      precio: 11.99,
      imagenUrl: "/vegetarian-burger.png",
      categoria: "hamburguesas",
      estado: "Disponible",
    },
    {
      nombre: "Hamburguesa Doble",
      descripcion: "Doble carne de res, doble queso, bacon, lechuga y salsa especial",
      precio: 18.99,
      imagenUrl: "/double-cheeseburger.png",
      categoria: "hamburguesas",
      estado: "Disponible",
    },
    {
      nombre: "Cerveza Artesanal IPA",
      descripcion: "Cerveza India Pale Ale con notas cítricas y amargor balanceado",
      precio: 6.99,
      imagenUrl: "/cerveza-artesanal-ipa.jpg",
      categoria: "cervezas",
      estado: "Disponible",
    },
    {
      nombre: "Cerveza Lager",
      descripcion: "Cerveza rubia ligera y refrescante, perfecta para acompañar",
      precio: 4.99,
      imagenUrl: "/cerveza-lager-rubia.jpg",
      categoria: "cervezas",
      estado: "Disponible",
    },
    {
      nombre: "Cerveza Stout",
      descripcion: "Cerveza negra cremosa con notas de café y chocolate",
      precio: 7.99,
      imagenUrl: "/cerveza-stout-negra.jpg",
      categoria: "cervezas",
      estado: "Disponible",
    },
    {
      nombre: "Cerveza Sin Alcohol",
      descripcion: "Cerveza con todo el sabor pero sin alcohol, refrescante y ligera",
      precio: 3.99,
      imagenUrl: "/cerveza-sin-alcohol.jpg",
      categoria: "cervezas",
      estado: "Disponible",
    },
    {
      nombre: "Coca Cola",
      descripcion: "Lata de Coca-Cola de 300ml",
      precio: 3.99,
      imagenUrl: "/gaseosa-coca.jpg",
      categoria: "gaseosas",
      estado: "Disponible",
    },
    {
      nombre: "Sprite",
      descripcion: "Lata de Sprite de 300ml",
      precio: 3.99,
      imagenUrl: "/gaseosa-sprite.jpg",
      categoria: "gaseosas",
      estado: "Disponible",
    },
    {
      nombre: "Coca Cola Light",
      descripcion: "Lata de Coca-Cola light de 300ml",
      precio: 3.99,
      imagenUrl: "/gaseosa-coca-light.jpg",
      categoria: "gaseosas",
      estado: "Disponible",
    },
    {
      nombre: "Sprite Zero",
      descripcion: "Lata de Sprite Zero de 300ml",
      precio: 3.99,
      imagenUrl: "/gaseosa-sprite-light.jpg",
      categoria: "gaseosas",
      estado: "Disponible",
    },
    {
      nombre: "Fanta",
      descripcion: "Lata de Fanta de 300ml",
      precio: 3.99,
      imagenUrl: "/gaseosa-fanta.jpg",
      categoria: "gaseosas",
      estado: "Disponible",
    },
    {
      nombre: "Tónica",
      descripcion: "Lata de Tónica de 300ml",
      precio: 3.99,
      imagenUrl: "/gaseosa-tonica.jpg",
      categoria: "gaseosas",
      estado: "Disponible",
    },
    {
      nombre: "Papas Fritas",
      descripcion: "Plato de papas fritas crujientes",
      precio: 8.99,
      imagenUrl: "/acomp-papas-fritas.jpg",
      categoria: "acompañamientos",
      estado: "Disponible",
    },
    {
      nombre: "Ensalada",
      descripcion: "Ensalada fresca con lechuga, tomate, cebolla y aderezo",
      precio: 8.99,
      imagenUrl: "/acomp-ensalada.jpg",
      categoria: "acompañamientos",
      estado: "Disponible",
    },
  ];

  await prisma.producto.createMany({
    data: products,
    skipDuplicates: true,
  });

  console.log('✅ Seed de productos de restaurante ejecutado con éxito');

  const mesas = [
    { numero: 1, locacion: 'Interior', estado: 'HABILITADO', capacity: 4 },
    { numero: 2, locacion: 'Interior', estado: 'HABILITADO', capacity: 2 },
    { numero: 3, locacion: 'Terraza', estado: 'HABILITADO', capacity: 6 },
    { numero: 4, locacion: 'Terraza', estado: 'HABILITADO', capacity: 4 },
    { numero: 5, locacion: 'Interior', estado: 'HABILITADO', capacity: 8 },
  ];

  await prisma.mesa.createMany({
    data: mesas,
    skipDuplicates: true,
  });
  console.log('✅ Seed de mesas ejecutado con éxito');

  // Seed de usuario ADMIN
  const adminPassword = await hashPassword('admin123');
  const adminUser = {
    email: 'admin@restaurant.com',
    name: 'Administrador',
    password: adminPassword,
    role: 'ADMIN',
  };

  await prisma.user.upsert({
    where: { email: adminUser.email },
    update: adminUser,
    create: adminUser,
  });

  console.log('✅ Seed de usuario ADMIN ejecutado con éxito');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
