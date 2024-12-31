# cp .env.staging .env
rm -rf .git .gitignore .eslintignore .eslintrc .circleci node_modules src typings test
rm .env.example .env.staging .editorconfig README.md

ssh root@35.232.29.208 "cd /home/roomify-api && rimraf dist"

rsync -avzP . root@35.232.29.208:/home/roomify-api

ssh root@35.232.29.208 "cd /home/roomify-api && npm install && sudo -i pm2 update && exit"

# ssh Vilagon@35.223.189.37 "cd /home/airtravel-api-staging && git pull origin staging && npm install && npm run build && pm2 update && exit"
