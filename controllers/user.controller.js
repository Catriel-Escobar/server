import userService from '../services/user.service.js';

// Controlador para usuarios
const userController = {
  // Obtener todos los usuarios
  getAllUsers: async (req, res, next) => {
    try {
      const users = await userService.getAllUsers();

      return res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      next(error);
    }
  },

  // Obtener un usuario por ID
  getUserById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      return res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      next(error);
    }
  },

  // Crear un nuevo usuario
  createUser: async (req, res, next) => {
    try {
      const userData = req.body;
      const newUser = await userService.createUser(userData);

      return res.status(201).json({
        success: true,
        data: newUser,
        message: 'Usuario creado exitosamente',
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      next(error);
    }
  },

  // Actualizar un usuario
  updateUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userData = req.body;
      const updatedUser = await userService.updateUser(id, userData);

      return res.json({
        success: true,
        data: updatedUser,
        message: 'Usuario actualizado exitosamente',
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      next(error);
    }
  },

  // Eliminar un usuario
  deleteUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await userService.deleteUser(id);

      return res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      next(error);
    }
  },

  // Obtener usuario por email
  getUserByEmail: async (req, res, next) => {
    try {
      const { email } = req.params;
      const user = await userService.getUserByEmail(email);

      return res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Error al obtener usuario por email:', error);
      next(error);
    }
  },

  // Login de usuario
  loginUser: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Validar que se proporcionen email y password
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos',
        });
      }

      const result = await userService.loginUser(email, password);

      // Configurar cookie con el token
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
      });

      return res.json({
        success: true,
        data: {
          user: result.user,
          token: result.token,
        },
        message: 'Login exitoso',
      });
    } catch (error) {
      console.error('Error al hacer login:', error);
      next(error);
    }
  },

  // Logout de usuario
  logoutUser: async (req, res, next) => {
    try {
      // Limpiar la cookie del token
      res.clearCookie('token');

      return res.json({
        success: true,
        message: 'Logout exitoso',
      });
    } catch (error) {
      console.error('Error al hacer logout:', error);
      next(error);
    }
  },
};

export default userController;
