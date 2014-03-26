var Purchase = require('../model/Purchase');

module.exports = function (app) {

    app.get('/purchases', function (req, res) {
        var userId = req.session.email;

        console.log('GET /purchases: ');
        Purchase.getPurchases(userId, function (error, purchases) {
            if (error) {
                console.log('GET /purchases: error: ' + error);
                res.send(500, error);
            } else {
                res.send(purchases);
            }
        });
    });

//    app.get('/purchase/:id', app.access.free, function (req, res) {
//        var nodeId = req.param('id', null);
//        if (null == nodeId) {
//            return res.send(400);
//        }
//
//        Purchase.getPurchases(nodeId, function(error, doc) {
//            if (error) {
//                console.log('GET purchase/:id - error: ' + error);
//                return res.send(500);
//            }
//
//            res.render('purchase', doc);
//        });
//    });

//    app.post('/purchases/deleteAll', function (req, res) {
//        var confirmed = req.param('confirmed', 'no');
//        if (confirmed !== 'yes') {
//            res.send(400);
//            return;
//        }
//
//        var email = req.session.email;
//        console.log('POST purchases/deleteAll - validated');
//
//        Purchase.deleteAll(email, function (error) {
//            if (error) {
//                res.send(500, error);
//                console.log('POST purchases/deleteAll - error: ' + error);
//            } else {
//                res.send(200);
//                console.log('POST purchases/deleteAll - ok');
//            }
//        });
//    });

    app.post('/purchase', function(req, res) {
        var name = req.param('name', null);
        var price = req.param('price', null);
        var date = req.param('date', null);
        var tags = req.param('tags', null);

        console.log(req.body);
        if ( null === name || name.length < 1 ) {
            res.send(400);
            return;
        }
        if (price == null) {
            res.send(400);
            return;
        }

        console.log('POST purchase - validated');

        var purchaseObject = {
            name: name,
            price:price,
            userId:req.session.email,
            date:date
        };
        if (tags) {
            purchaseObject.tags = tags;
        }

        Purchase.create(purchaseObject, function(error, doc) {
            if (error) {
                console.log("purchase creating error:" + name);
                res.send(401, "purchase creating error");
            } else {
                console.log('Created new doc: ', doc);
                res.send(200, doc._id);
            }
        });
    });

    app.del('/purchase/:id', function (req, res) {
        var purchaseId = req.param('id', null);
        if (null == purchaseId) {
            return res.send(400);
        }

        Purchase.delete(purchaseId, function(error) {
            if (error) {
                console.log('DELETE purchase/:id - error: ' + error);
                res.send(500);
            } else {
                res.send(200);
            }
        });
    });
}