import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { writeFileSync } from "fs"
import { join } from "path"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        {
            name: "mock-api",
            configureServer(server) {
                server.middlewares.use("/api/mock", (req, res, next) => {
                    if (req.method === "PUT") {
                        let body = ""
                        req.on("data", (chunk) => {
                            body += chunk.toString()
                        })
                        req.on("end", () => {
                            try {
                                const url = req.url || ""
                                if (url === "/liked") {
                                    const filePath = join(
                                        process.cwd(),
                                        "public",
                                        "mock",
                                        "liked.json"
                                    )
                                    writeFileSync(filePath, body, "utf-8")
                                    res.writeHead(200, {
                                        "Content-Type": "application/json",
                                    })
                                    res.end(JSON.stringify({ success: true }))
                                } else if (url === "/searchHistory") {
                                    const filePath = join(
                                        process.cwd(),
                                        "public",
                                        "mock",
                                        "searchHistory.json"
                                    )
                                    writeFileSync(filePath, body, "utf-8")
                                    res.writeHead(200, {
                                        "Content-Type": "application/json",
                                    })
                                    res.end(JSON.stringify({ success: true }))
                                } else {
                                    res.writeHead(404)
                                    res.end()
                                }
                            } catch (error) {
                                console.error("Error writing JSON file:", error)
                                res.writeHead(500)
                                res.end(
                                    JSON.stringify({
                                        error: "Failed to write file",
                                    })
                                )
                            }
                        })
                    } else {
                        next()
                    }
                })
            },
        },
    ],
})
