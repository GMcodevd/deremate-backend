import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';


async function register(user, password) {
    try {

        const existingUser = await User.findOne({ user });
        if (existingUser) {
            return { success: false, message: 'Usuario ya registrado' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ user, password: hashedPassword });

        await newUser.save();
        console.log("Usuario guardado correctamente");

        return { success: true, message: 'Usuario registrado correctamente', user: newUser };
    } catch (error) {
        console.error(" Error dentro de register:", error);
        throw new Error(error.message);
    }
}

async function login(username, password) {
    try {

        const foundUser = await User.findOne({ user: username });
        if (!foundUser) {
            return { success: false, message: 'Error de autenticación' };
        }

        const validPassword = await bcrypt.compare(password, foundUser.password);
        if (!validPassword) {
            return { success: false, message: 'Error de autenticación' };
        }

        const secretKey = process.env.JWT_SECRET;
        const tokenExpiration = process.env.JWT_EXPIRES_IN;

        const token = jwt.sign(
            { userId: foundUser._id, user: foundUser.user },
            secretKey,
            { expiresIn: tokenExpiration }
        );

        return { success: true, message: 'Inicio de sesión exitoso', token };
    } catch (error) {
        console.error("Error en login:", error);
        throw new Error(error.message);
    }
}

export default { register, login };