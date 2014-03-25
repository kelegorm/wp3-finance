var mongoose = require('mongoose');

var PurchaseSchema = new mongoose.Schema({
    name:     { type: String},
    date:     { type: Date},
    price:     { type: Number},
    tags:     { type: [String], index: true},
    userId:    { type: String}
});
var Purchase = mongoose.model('Purchase', PurchaseSchema);

module.exports.create = function (purchase, callback) {
    var purchase = new Purchase(purchase);
    purchase.save(callback);
};

module.exports.getPurchases = function (userId, callback) {
    console.log('getPurchases(' + userId + ')');
    Purchase.find({userId:userId}, function (error, notes) {
        if (error) {
            callback(error);
        } else {
            callback(null, notes);
        }
    });
};

module.exports.deleteAll = function (userId, callback) {
    Purchase.remove({email:userId}, function (error) {
        callback(error);
    });
};

module.exports.delete = function (purchaseId, callback) {
    Purchase.findByIdAndRemove(purchaseId, callback);
};

module.exports.getPurchase = function (purchaseId, callback) {
    Purchase.findById(purchaseId, callback);
};