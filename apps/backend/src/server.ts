// load env
import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`[i] Server is running on http://localhost:${PORT}/`);
});