import express, {Request, Response } from "express";
import {AppInitializer} from "./services/AppInitializer";

const app: express.Application = express();
const port = 8080;

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

async function start() {
    let initializer = new AppInitializer();
    let groupId: number = await initializer.prepareInitialData()
    console.log(`App data is ready! Targer group is ${groupId}`)

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });

    app.get('/',
        async (req: Request, res: Response): Promise<Response> => {
            return res.status(200).send({
                message: "Hello World!",
            });
        }
    );
}

start()