const jwt = require("jsonwebtoken");
const db = require("../data/db");

const auth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        console.log(authorization);
        //Est-ce qu'on a un JWT avec la requête
        if (authorization) {
            // Ex: jeton = "Bearer klsjdflksjdlfkj33lkjlkjfslkdjdsfkjlsdf"
            const jetonAValider = authorization.split(" ")[1];
            const jetonDecode = jwt.verify(jetonAValider, process.env.JWT_SECRET);

            const utilisateurVerifie = await db.collection("utilisateurs").doc(jetonDecode.id).get();
            console.log(utilisateurVerifie.exists);
            if (utilisateurVerifie.exists) {
                next();
            } else {
                throw new Error("Non autorisé");
            }
        } else {
            // res.statusCode =
            // return res.json({ message: "Non autorisé" });
            throw new Error("Non autorisé");
        }
        //On valide le jeton
        //On récupère l'utilisateur dans le jeton et vérifie si existe
        //Si oui, next()
        //Si non, on retourne une erreur non autorisées
    } catch (erreur) {
        res.statusCode = 403;
        return res.json({ message: erreur.message });
    }
};

module.exports = auth;
