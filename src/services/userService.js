const User = require('../models/User');

const userService = {
    getAllUsers: async () => await User.find(),
    
    getUserById: async (id) => {
        const user = await User.findById(id);
        if (!user) throw new Error('Recurso no encontrado');
        return user;
    },
    
    updateUser: async (id, data) => {
        const updated = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!updated) throw new Error('Recurso no encontrado');
        return updated;
    },
    
    deleteUser: async (id) => {
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) throw new Error('Recurso no encontrado');
        return deleted;
    }
};

module.exports = userService;