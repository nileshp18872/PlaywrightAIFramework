  @echo off
echo ==========================================
echo Starting Project Dependencies Installation
echo ==========================================

call npm install dotenv
call npm install @faker-js/faker
call npm install luxon
call npm install ajv csv-parse xlsx
call npm install @axe-core/playwright
call npm install allure-playwright
call npm install -D @types/node
call npx playwright install
call npm install mysql2

echo ==========================================
echo All dependencies installed successfully!
echo ==========================================
pause