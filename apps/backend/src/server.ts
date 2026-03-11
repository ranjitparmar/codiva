// imports
import { env } from "./config/env";
import app from "./app";

const PORT = env.PORT;

app.listen(PORT, ()=>{
    console.log(`[i] Server is running on http://localhost:${PORT}/`);
});