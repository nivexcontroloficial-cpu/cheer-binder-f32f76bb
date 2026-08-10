const fs = require('fs');
const content = fs.readFileSync('src/routeTree.gen.ts', 'utf8');
const registerBlock = `
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof import('./router').getRouter>
  }
}
`;

if (!content.includes("declare module '@tanstack/react-router'")) {
  fs.writeFileSync('src/routeTree.gen.ts', content + registerBlock);
  console.log('Register block added.');
} else {
  console.log('Register block already exists.');
}
