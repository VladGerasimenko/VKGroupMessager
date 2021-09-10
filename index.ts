import express, {Request, Response } from "express";
import {GroupStandInitializer} from "./services/stands/GroupStandInitializer";
import {RequestsService} from "./services/RequestsService";

const app: express.Application = express();
const port = 8080;

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

async function start() {
    let initializer = new GroupStandInitializer();
    let reqService: RequestsService = new RequestsService()
    let initData: Map<string, any> = await initializer.initGroupStand()
    console.log(`App data is ready! Target group is ${initData.get('groupId')}`)

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