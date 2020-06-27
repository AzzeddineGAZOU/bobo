import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Address } from './src/entity/Address';
import { Ingredient } from './src/entity/Ingredient';
import { IngredientMold } from './src/entity/IngredientMold';
import { Mold } from './src/entity/Mold';
import { PartnerRecovery } from './src/entity/PartnerRecovery';
import { PartnershipRequest } from './src/entity/PartnershipRequest';
import { Recovery } from './src/entity/Recovery';
import { Role } from './src/entity/Role';
import { User } from './src/entity/User';
import { router } from './src/routes/routes';
import { Reward } from './src/entity/Reward';

const app = express();
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));
app.use(cors({ origin : true }));
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));


app.use(router);

// Connexion à la base
createConnection({
    type : 'mysql',
    host : 'localhost', 
    port : 3306,
    username : 'root',
    password : '',
    database : 'seb_test',
    synchronize : true,
    logging : false,
    entities : [
        Address,
        Role,
        User,
        PartnershipRequest,
        PartnerRecovery,
        Mold,
        IngredientMold,
        Ingredient,
        Recovery,
        Reward
    ]
}).then(async connection => {
    console.log('Connected to DB');
    // Connexion au serveur 
    app.listen(port, () => {
        console.log('Server is running');
    });
}).catch(error => console.log('TypeORM connection error: ', error));

export default app;