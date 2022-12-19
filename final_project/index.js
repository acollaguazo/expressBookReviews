import express, { json } from 'express';
import { verify } from 'jsonwebtoken';
import session from 'express-session';
import { authenticated as customer_routes } from './router/auth_users.js';
import { general as genl_routes } from './router/general.js';

const app = express();

app.use(json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
if (req.session.authorization) {
    // get the session token
    token = req.session.authorization['accessToken'];
    // verify the token
    verify(token, "access", (err, user) => {
        if (!err) {
            // cache the user object in the request
            req.user = user;
            next();
        }
        // the token has expired or is invalid
        else {
            return res.status(403).json({message: "User not authenticated"})
        }
    });
}
// there has not been a log in even in this session
else {
    return res.status(403).json({message: "User not logged in"})
}
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
