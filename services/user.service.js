import prisma from '../config/prisma.js';
import authUtils from '../utils/auth.js';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/errors.js';

// Servicio para usuarios
const userService = {
  // Obtener todos los usuarios
  getAllUsers: async () => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return users;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw new InternalServerError(
        'Error al obtener usuarios',
        'USERS_FETCH_ERROR'
      );
    }
  },

  // Obtener un usuario por ID
  getUserById: async (id) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new NotFoundError('Usuario no encontrado', 'USER_NOT_FOUND');
      }

      return user;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Error al obtener usuario', 'USER_FETCH_ERROR');
    }
  },

  // Crear un nuevo usuario
  createUser: async (userData) => {
    try {
      const { email, name, password, role } = userData;

      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictError(
          'El usuario con este email ya existe',
          'USER_ALREADY_EXISTS'
        );
      }

      // Hash de la contraseña
      const hashedPassword = await authUtils.hashPassword(password);

      // Crear el usuario
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: role || 'USER',
        },
      });

      // Excluir la contraseña de la respuesta
      const { password: _, ...userWithoutPassword } = newUser;

      return userWithoutPassword;
    } catch (error) {
      if (error instanceof ConflictError) {
        throw error;
      } else {
        throw new InternalServerError(
          `Error al crear usuario: ${error.message}`,
          'USER_CREATION_ERROR'
        );
      }
    }
  },

  // Actualizar un usuario
  updateUser: async (id, userData) => {
    try {
      const { email, name, role, password } = userData;

      // Preparar los datos para actualizar
      const updateData = {};

      if (email) updateData.email = email;
      if (name) updateData.name = name;
      if (role) updateData.role = role;
      if (password) updateData.password = await authUtils.hashPassword(password);

      // Actualizar el usuario
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: updateData,
      });

      // Excluir la contraseña de la respuesta
      const { password: _, ...userWithoutPassword } = updatedUser;

      return userWithoutPassword;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundError('Usuario no encontrado', 'USER_NOT_FOUND');
      } else if (error.code === 'P2002') {
        throw new ConflictError(
          'El email ya está en uso por otro usuario',
          'EMAIL_ALREADY_EXISTS'
        );
      } else {
        throw new InternalServerError(
          `Error al actualizar usuario: ${error.message}`,
          'USER_UPDATE_ERROR'
        );
      }
    }
  },

  // Eliminar un usuario
  deleteUser: async (id) => {
    try {
      // Verificar si el usuario existe
      const existingUser = await prisma.user.findUnique({
        where: { id: Number(id) },
      });

      if (!existingUser) {
        throw new NotFoundError('Usuario no encontrado', 'USER_NOT_FOUND');
      }

      // Eliminar el usuario
      await prisma.user.delete({
        where: { id: Number(id) },
      });

      return { message: 'Usuario eliminado exitosamente' };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      } else {
        throw new InternalServerError(
          `Error al eliminar usuario: ${error.message}`,
          'USER_DELETE_ERROR'
        );
      }
    }
  },

  // Obtener usuario por email
  getUserByEmail: async (email) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          password: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new NotFoundError('Usuario no encontrado', 'USER_NOT_FOUND');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError(
        'Error al obtener usuario por email',
        'USER_FETCH_BY_EMAIL_ERROR'
      );
    }
  },

  // Login de usuario
  loginUser: async (email, password) => {
    try {
      // Buscar usuario por email
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          password: true,
        },
      });

      if (!user) {
        throw new UnauthorizedError('Credenciales inválidas', 'INVALID_CREDENTIALS');
      }

      // Verificar contraseña
      const isPasswordValid = await authUtils.verifyPassword(
        password,
        user.password
      );

      if (!isPasswordValid) {
        throw new UnauthorizedError('Credenciales inválidas', 'INVALID_CREDENTIALS');
      }

      // Generar token JWT
      const tokenPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      const token = authUtils.generateToken(tokenPayload);

      // Excluir la contraseña de la respuesta
      const { password: _, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      throw new InternalServerError(
        `Error al hacer login: ${error.message}`,
        'LOGIN_ERROR'
      );
    }
  },
};

export default userService;
