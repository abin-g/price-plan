const users = {
    'admin': { password: 'admin123', role: 'admin' },
    'user': { password: 'user123', role: 'user' },
    'general': { password: 'general123', role: 'general' }
};

const baiscAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new Error("Authrozation Failed");

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    const user = users[username];
    if (user && user.password === password) {
        req.user = { username, role: user.role }; 
        next();
    }
    
    else throw new Error("Credentials miss matching")
}

const authrizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Permission denmied' })
        }
        next();
    }
}

module.exports = { baiscAuth, authrizeRole };