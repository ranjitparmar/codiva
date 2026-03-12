// imports
import { env } from "./config/env";
import app from "./app";

// worker
import { startGenerationWorker } from "./workers/generation.worker";
startGenerationWorker();
console.log("[worker] generation worker started");

const PORT = env.PORT;

app.listen(PORT, ()=>{
    console.log(`[i] Server is running on http://localhost:${PORT}/`);
});