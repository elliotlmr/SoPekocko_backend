const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.get('/', auth, saucesCtrl.getAllSauces); //Tableau de toutes les sauces
router.get('/:id', auth, saucesCtrl.getOneSauce); //Renvoie une sauce spécifique en fonction de l'ID

router.post('/', auth, multer, saucesCtrl.createSauce); //Poster une nouvelle sauce.

router.put('/:id', auth, multer, saucesCtrl.modifySauce); //Modifier une sauce existante grâce à son ID.

router.delete('/:id', auth, saucesCtrl.deleteSauce); //Supprimer une sauce existante grâce à son ID.

//router.post('/:id/like', auth, saucesCtrl.modifyLike);

module.exports = router;