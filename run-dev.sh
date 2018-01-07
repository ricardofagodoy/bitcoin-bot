[ ! -d node_modules ] && echo 'First time running, installing dependencies...' && npm install && npm run build

npm start