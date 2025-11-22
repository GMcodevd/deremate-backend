import authService from '../service/user.service.js'



async function loginController(req, res) {
    try {
        const { user, password } = req.body;
        const result = await authService.login(user, password);

        if (result.success) {
            res.status(200).json({ token: result.token });
        } else {
            res.status(401).json({ error: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error', mensaje: error.message });
    }
}


async function registerController(req, res) {
    try {
        const { user, password } = req.body;
        const userRegistered = await authService.register(user, password);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado correctamente',
            user: userRegistered,
        });

    } catch (error) {
        res.status(500).json({
            error: 'Registration error',
            message: error.message
        });
    }
}


export default { registerController, loginController }