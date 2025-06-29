uses shad and cdn to bootstrap a new landing page
also uses godeploy to deploy, so needs to be configured...

Vite
Previous
Next
Install and configure shadcn/ui for Vite.

Create project
Start by creating a new React project using vite. Select the React + TypeScript template:

pnpm
npm
yarn
bun
npm create vite@latest
Copy
Add Tailwind CSS
pnpm
npm
yarn
bun
npm install tailwindcss @tailwindcss/vite
Copy
Replace everything in src/index.css with the following:

src/index.css
Copy
@import "tailwindcss";
Edit tsconfig.json file
The current version of Vite splits TypeScript configuration into three files, two of which need to be edited. Add the baseUrl and paths properties to the compilerOptions section of the tsconfig.json and tsconfig.app.json files:

tsconfig.json
Copy
{
"files": [],
"references": [
{
"path": "./tsconfig.app.json"
},
{
"path": "./tsconfig.node.json"
}
],
"compilerOptions": {
"baseUrl": ".",
"paths": {
"@/_": ["./src/_"]
}
}
}
Edit tsconfig.app.json file
Add the following code to the tsconfig.app.json file to resolve paths, for your IDE:

tsconfig.app.json
Copy
{
"compilerOptions": {
// ...
"baseUrl": ".",
"paths": {
"@/_": [
"./src/_"
]
}
// ...
}
}
Update vite.config.ts
Add the following code to the vite.config.ts so your app can resolve paths without error:

pnpm
npm
yarn
bun
npm install -D @types/node
Copy
vite.config.ts
Copy
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
plugins: [react(), tailwindcss()],
resolve: {
alias: {
"@": path.resolve(\_\_dirname, "./src"),
},
},
})
Run the CLI
Run the shadcn init command to setup your project:

pnpm
npm
yarn
bun
npx shadcn@latest init
Copy
You will be asked a few questions to configure components.json.

Copy
Which color would you like to use as base color? › Neutral
Add Components
You can now start adding components to your project.

pnpm
npm
yarn
bun
npx shadcn@latest add button
Copy
The command above will add the Button component to your project. You can then import it like this:

src/App.tsx
Copy
import { Button } from "@/components/ui/button"

function App() {
return (
<div className="flex min-h-svh flex-col items-center justify-center">
<Button>Click me</Button>
</div>
)
}

export default App
