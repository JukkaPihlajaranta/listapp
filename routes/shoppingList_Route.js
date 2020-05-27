const router = require('express').Router();
const mongoose = require('mongoose');
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


router.put('/desharelist', async (req,res) =>{

    
    const receivedUserEmail = req.body.userEmail;
    const listId = req.body.listId;
    
    console.log("yep");
    
    try{
        const targetUser = await User.findOne({email: receivedUserEmail});
        //if user has been deleted from database
        if (!targetUser) return res.status(500).json({ msg: "No user with that email."}); 
        
        console.log("deleted user shared", targetUser.email);

        const shoppingList = await ShoppingList.findById(listId)
        for (var i = 0; i < shoppingList.listSharedWith.length; i++){
            if (shoppingList.listSharedWith[i].userEmail == receivedUserEmail){
                shoppingList.listSharedWith.splice(i, 1);
                break;
            }
        }
        
        for (var i = 0; i < targetUser.sharedLists.length; i++){
            if (targetUser.sharedLists[i].listId == listId){
                console.log(listId, " found! ")
                targetUser.sharedLists.splice(i, 1);
                break;
            }
        }
        


        

        shoppingList.save();
        targetUser.save();
        
       

        res.json('Updated');
    }
    catch(err){
        res.status(500).json({error: err.message});
    }

});

router.get('/sharedLists/:id', async (req, res) => {

    const userId = req.params.id;
    
    try{
        const user = await User.findById(userId);
        // console.log('userlists: ', user.sharedLists);

        let tempList = [];

        user.sharedLists.forEach(el => {
            tempList.push(el.listId);
        });

        
        // let objIdArray = tempList.map(s => mongoose.Types.ObjectId(s));
        // const temp = [
        //     mongoose.Types.ObjectId("5ecd653b2847f712c01a2f0f"), 
        //     mongoose.Types.ObjectId("5ece509ea4e6e82d649dce53")];
        // console.log("´temp: ", temp);
        const lists = await ShoppingList.find({_id: tempList});
        
        const payload = {
            sharedLists: lists
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