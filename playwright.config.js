import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir: './tools/browser', timeout: 45000, fullyParallel: true,
 reporter: [['list'], ['html', {open:'never'}]],
 use: {baseURL:'http://127.0.0.1:4173', trace:'retain-on-failure', screenshot:'only-on-failure'},
 projects: [
  {name:'handy',use:{viewport:{width:390,height:844},isMobile:true,hasTouch:true}},
  {name:'schmal',use:{viewport:{width:320,height:720},isMobile:true,hasTouch:true}},
  {name:'desktop',use:{viewport:{width:1280,height:900}}},
 ],
 webServer:{command:'npm run dev -- --host 127.0.0.1 --port 4173 --strictPort',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI},
});
