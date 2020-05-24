const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShoppingList = new Schema({
    listName: String,
    ownerId: String,
    ownerName: String,
    readyItemsCount: { type: Number, default: 0},
    showList:{ type: Boolean, default: true },
    shopItemList:[{
        itemName: String,
        itemDate: String,
        checked: {
            type: Boolean, 
            default: false}
    }]

});

module.exports = mongoose.model('Shoplist', ShoppingList);