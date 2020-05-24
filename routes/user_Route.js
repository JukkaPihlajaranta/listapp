const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const User = require('../models/user_model');
const ShoppingList = require('../models/shoppinglist_model');

router.post('/register', async (req, res) => {

    try{
        let { email, password, passwordCheck, displayName } = req.body;

        //validate

        if (!email || !password || !passwordCheck) return res.status(400).json({ msg: "Not all field filled in."})
        
        const existingUser = await User.findOne({ email: email})
        if (existingUser)  return res.status(400).json({ msg: "User with this account already exists. Try again.", errorMessage: res.error});

        if (password !== passwordCheck) return res.status(400).json({ msg: "Passwords don't match. Try again."})

        if (!displayName) displayName = email;

        email = email.toLowerCase();
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: passwordHash,
            displayName
        });

        const savedUser = await newUser.save();
        res.json(savedUser);
        

    } catch (err){
        res.status(500).json({error: err.message});
    }

});

router.post('/login', async (req, res) => {

    console.log(req.body);

    try{
        let { email, password} = req.body;

        //validate
        if (!email || !password) return res.status(400).json({ msg: "Not all field filled in."});
        
        email = email.toLowerCase();

        const user = await User.findOne({email: email});
        if (!user) return res.status(400).json({ msg: "No user account with that email found."});

        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ msg: "Invalid credentials."});
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const lastLoggedIn = currentDate.getHours() +":" + currentDate.getMinutes() + "  " +
        currentDate.getDate() + "." + month + "." + currentDate.getFullYear();

        user.lastLoggedIn = lastLoggedIn;
        
        user.save();
        
        res.json({
            token,
            user:{
                id: user._id,
                displayName: user.displayName,
                email: user.email,
                lastLoggedIn: lastLoggedIn,
                admin: user.admin
            },
            
        });

    }
    catch (err){
        res.status(500).json({err: err.message});
    }
});



//admin
router.get('/userlist', async (req,res) => {

    try{
        const allUserList = await User.find({});
        const allShoplists = await ShoppingList.find({});

        const payload = {
            users: allUserList,
            shoplists: allShoplists
        }

        res.json(payload);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
    
});

//Admin reset password
router.put('/resetPassword', async (req, res) => {

    const newPassword = req.body.password;
    const userId = req.body.userId;

    try{
        const targetUser = await User.findById(userId);
                
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(newPassword, salt);
        
        targetUser.password = passwordHash;
        targetUser.save();
        
        res.json('updated!');
    }
    catch(err){
        res.status(500).json({error: err.message});
    }

});


router.delete('/delete', auth, async (req,res) => {

    try{
        const deletedUser = await User.findByIdAndDelete(req.user)
        res.json(deletedUser);
    }
    catch (err){
        res.status(500).json({error: err.message});
    }
});

router.post('/tokenIsValid', async (req, res) => {

    try{
        const token = req.header('x-auth-token');

        // console.log("token valid or not: ", token);
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    }
    catch (err){
        res.status(500).json({error: err.message});
    }
});


router.get('/users', auth, async (req, res) => {
    const user = await User.findById(req.user);

    // console.log("in users route: ", req.user);

    res.json({
        displayName: user.displayName,
        id: user._id,
        admin: user.admin
    });
})

module.exports = router;