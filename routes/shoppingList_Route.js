const router = require('express').Router();
// const auth = require('../middleware/auth');
const ShoppingList = require('../models/shoppinglist_model');
const User = require('../models/user_model');



//ROUTES

//GET all users' shoplists
router.get('/allshoplists/:id', (req, res) =>{

    
    const userId = req.params.id;
    
    ShoppingList.find({ownerId: userId})
    .then((data) => {
        res.json(data);
    })
    .catch((error) => {
        console.log("Error: ", error);
    });
    
});

//Create a new shoppinglist
router.post('/createShopList', (req, res) =>{
    const receivedData = {
        listName: req.body.listName,
        ownerId: req.body.userId,
        ownerName: req.body.userName,
    }

    console.log(req.body);

    const newShoplist = new ShoppingList(receivedData);

    newShoplist.save()
        .then(() => res.json('user added'))
        .catch(err => res.status(400).json('Sorry, internal server errors: ', err));
});

//Get edit page
router.get('/edit/:id', (req, res) => {
    
    ShoppingList.findById(req.params.id)
    .then((shoplist) => {
        res.json(shoplist);
        // console.log(shoplist);
    })
    .catch(err => res.status(400).json('Error: ', err))


});

//Add item to shoplist
router.put('/edit/:id', (req, res) => {
            
    
    ShoppingList.findById(req.params.id)
    .then(shoplist => {
        shoplist.shopItemList.push({itemName: `${req.body.addedItem}`});

        shoplist.save()
        .then(() => res.json(shoplist))
        // .then(() => res.json('Updated!'))
        .catch(err => res.status(400).json('Error: ', err))
    })
    .catch(err => res.status(400).json('Error: ', err))

});

//Update shoplistname
router.put('/changeShoplistName',  (req, res) => {
   
    const targetList = req.body.targetList;
    const newListName = req.body.newListName;

    ShoppingList.findById(targetList)
    .then(shoplist => {

        shoplist.listName = newListName;

        shoplist.save()
        .then( () => res.json('updated!'))
        .catch(err => res.status(400).json('Error: ', err))
    })
    .catch(err => res.status(400).json('Error: ', err))


});



//SHARE LIST FUNCTIONS
router.put('/sharelist', async (req,res) =>{

    
    const userEmail = req.body.userEmail;
    const listId = req.body.listId;
    
    
    try{
        const targetUser = await User.findOne({email: userEmail});
        if (!targetUser) return res.status(500).json({ msg: "No user with that email."});
        
        const shoppingList = await ShoppingList.findById(listId)
        shoppingList.listSharedWith.push({ userEmail: userEmail, userId: targetUser._id });
        
        targetUser.sharedLists.push({listId: listId})

        shoppingList.save();
        targetUser.save();
        
        const payload = {
            listSharedWith: shoppingList.listSharedWith,
        }
        

        res.json(payload);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }

});



//CHANGE CHECKMARKS FUNCTIONS

//Show/hide SHOPLIST - checkmark
router.put('/modifyShoplistCheckMark', (req, res) => {
    
    // let editCheckMarks;
    const targetList = req.body.targetList;

    ShoppingList.findById(targetList)
    .then(shoplist => {
        shoplist.showList = !shoplist.showList;

        shoplist.save()
        .then(() => res.json('updated!'))
        .catch(err => res.status(400).json('Error: ', err))
    })
    .catch(err => res.status(400).json('Error: ', err))

});

//Checkmarks ITEM
router.put('/modifyItemCheckMark', (req, res) => {
    
    const targetList = req.body.targetList;
    const targetItem = req.body.targetItem;
    const readyItems = req.body.readyItemsCount;

    
    ShoppingList.findById(targetList)
    .then(shoplist => {
        shoplist.readyItemsCount = readyItems;

        for (var i = 0; i < shoplist.shopItemList.length; i++){
            if (shoplist.shopItemList[i]._id == targetItem){
                shoplist.shopItemList[i].checked = !shoplist.shopItemList[i].checked;
                break;
            }
        }
        shoplist.save()
        .then(() => res.json('Updated!'))
        .catch(err => res.status(400).json('Error: ', err))
    })  
    .catch(err => res.status(400).json('Error: ', err))

});

//UnCheck all checkmarks
router.put('/uncheckall', (req, res) => {
    
    const targetList = req.body.targetList;
    
    ShoppingList.findById(targetList)
    .then(shoplist => {
        shoplist.readyItemsCount = 0;

        shoplist.shopItemList.forEach(elem => {
            elem.checked = false;
        })

        shoplist.save()
        .then(() => res.json('Updated!'))
        .catch(err => res.status(400).json('Error: ', err))
    })
    .catch(err => res.status(400).json('Error: ', err))

});


//REMOVE FUNCTIONS

//Remove an item
router.put('/deleteItem', (req, res) => {
    
    // let editShopList;
    const targetList = req.body.targetList;
    const targetItem = req.body.targetItem;

    ShoppingList.findById(targetList)
    .then(shoplist => {

        for (var i = 0; shoplist.shopItemList.length; i++){
            if (shoplist.shopItemList[i]._id == targetItem){
                shoplist.shopItemList.splice(i, 1);
                break;
            }
        }

        shoplist.save()
        .then(() => res.json('Updated!'))
        .catch(err => res.status(400).json('Error: ', err))
    })
    .catch(err => res.status(400).json('Error: ', err))

});

//Delete whole shopping list
router.delete('/deletelist', (req, res) => {
    
    // let deleteShoppingList;
    const targetList = req.body.targetList;
    // const targetItem = req.body.targetItem;

    ShoppingList.findByIdAndDelete(targetList)
    .then(() => res.json('List deleted'))
    .catch(err => res.status(400).json('Error: ' + err))

});


module.exports = router;