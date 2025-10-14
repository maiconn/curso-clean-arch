import express, { Request, Response } from "express";
import pgp from "pg-promise";
 import { randomUUID } from 'node:crypto'; // ES Modules

function validateName(name: string) {
    return name.trim().split(" ").length > 1;
};

function validate(name: string) {
    if(!validateName(name)){
        return "Name has been first and last name";
    }
    return undefined;
};

async function main () {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const app = express();
    app.use(express.json());
    
    app.post("/signup", async (req: Request, res: Response) => {
        const accountId = randomUUID();
        const error = validate(req.body.name);
        if (error) {
            res.json({error});
        } else {
            await connection.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [accountId, req.body.name, req.body.email, req.body.document, req.body.password]);
            res.json({
                accountId
            });
        }        
    });

    app.get("/accounts/:accountId", async (req: Request, res: Response) => {
        const [accountData] = await connection.query("select * from ccca.account where account_id = $1", [req.params.accountId]);
        res.json(accountData);
    })

    app.listen(3000);
}
main();
