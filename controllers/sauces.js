const Sauce = require('../models/Sauce');
const User = require('../models/User');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    // Control validation -------------------------------------------
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces)) //sauces ou Sauces ?
        .catch(error => res.status(400).json({ error }));
};

exports.modifyLike = (req, res, next) => {
    const liked = req.body.like;
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (liked == 1 || liked == -1) {
                sauce[liked == 1 ? likes : dislikes] += 1;
                sauce[liked == 1 ? usersLiked : userDisliked].push(req.body.userId);
                if (sauce.usersLiked.includes(req.body.userId)) {
                    sauce.userLiked.remove(req.body.userId);
                    sauce.likes -= 1;
                }
                if (sauce.usersDisiked.includes(req.body.userId)) {
                    sauce.userDisliked.remove(req.body.userId);
                    sauce.dislikes -= 1;
                }
            } else {
                sauce[usersLiked.includes(req.body.userId) ? likes : dislikes] -= 1;
                sauce[usersLiked.includes(req.body.userId) ? usersLiked : usersDisiked].remove(req.body.userId);
            };
            Sauce.updateOne({ _id: req.params.id }, sauce)
                .then(() => res.status(200).json({ message: 'Objet modifié like/dislike !' }))
                .catch(error => res.status(400).json({ message: 'Impossible de modifier les likes' }));
        })
        .catch(error => res.status(400).json({ message: 'Impossible de like/dislike' }));
};
/*exports.modifyLike = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id },
        (err, doc) => {
            if (err) console.log(err)
            const alreadyLiked = sauceObject.usersLiked.some(x => x._id == req.user.id);
            const alreadyDisliked = sauceObject.usersDisliked.some(x => x._id == req.user.id);

            if (alreadyLiked) {
                User.updateOne({
                    'sauces._id': req.params.id
                },
                    {
                        $inc: { 'sauces.$.likes': 0 },
                        $pull: { 'sauces.$.usersLiked': { _id: req.user.id } }
                    },
                    err => {
                        if (err) console.log(err)
                        res.send('nomoreliked');
                    });
            } else {
                User.updateOne({
                    'sauces._id': req.params.id
                },
                    {
                        $inc: { 'sauces.$.likes': 1 },
                        $push: { 'posts.$.usersLiked': { _id: req.user.id } }
                    },
                    err => {
                        if (err) console.log(err)
                        res.send('liked');
                    });
            };
            alreadyLiked.save()
                .then(() => res.status(201).json({ message: 'Objet modifié (like/dislike) !' }))
                .catch(error => res.status(400).json({ error }));

            if (alreadyDisliked) {
                User.updateOne({
                    'sauces._id': req.params.id
                    },
                    {
                        $inc: { 'sauces.$.dislikes': 0 },
                        $pull: { 'sauces.$.usersDisliked': { _id: req.user.id } }
                    },
                    err => {
                        if (err) console.log(err)
                        res.send('nomoredisliked');
                    });
            } else {
                User.updateOne({
                    'sauces._id': req.params.id
                    },
                    {
                        $inc: { 'sauces.$.dislikes': 1 },
                        $push: { 'posts.$.usersDisliked': { _id: req.user.id } }
                    },
                    err => {
                        if (err) console.log(err)
                        res.send('disliked');
                    });
            };
            alreadyDisliked.save()
                .then(() => res.status(201).json({ message: 'Objet modifié (like/dislike) !' }))
                .catch(error => res.status(400).json({ error }));
        });
};*/