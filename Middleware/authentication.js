const { getuser } = require('../services/auth');


function checkauthentication(){
    return (req, res, next)=> {
        const token = req.cookies?.token;
        if (!token) {
            req.user = null;
            return next(); 
        }

        try {
            const payload = getuser(token);
            req.user = payload; 
        } catch (error) {
            console.log("Error decoding token:", error);
            req.user = null; 
        }

        return next(); 
    }
}



module.exports = {
    checkauthentication,
};