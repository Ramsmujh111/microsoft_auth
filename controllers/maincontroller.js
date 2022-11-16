const mongoose = require('mongoose');
const Schema = mongoose.Schema;
exports.getHomePage = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;
    const username = req.session.account ? req.session.account.username : '';
    res.render('home', { isAuthenticated: isAuthenticated, username: username });
}

exports.getIdPage =async (req, res, next) => {
    try {
        const isAuthenticated = req.session.isAuthenticated;

        const claims = {
        name: req.session.account.idTokenClaims.name,
        preferred_username: req.session.account.idTokenClaims.preferred_username,
        oid: req.session.account.idTokenClaims.oid,
        sub: req.session.account.idTokenClaims.sub
        };
        // data base connection
        const defaultSchema = new Schema({} , {strict:false});
        const defaultCollections = mongoose.model('userData' , defaultSchema);

        const saveCollectionData = defaultCollections(claims);
        await saveCollectionData.save();

       res.render('id', {isAuthenticated: isAuthenticated, claims: claims});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            status:false,
            message:error.message
        })
    }
}
