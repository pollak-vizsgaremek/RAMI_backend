import e from 'express';
import cors from 'cross';

const app = e();

const corsOptions = {
    origin: "http://localhost:5173",
}





app.listen(3300, () => {
    console.log("App startedc at http://localhost:3300")
})
