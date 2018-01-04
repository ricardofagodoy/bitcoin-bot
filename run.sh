[ ! -d node_modules ] && echo 'First time running, installing dependencies...' && npm install

echo 'Make sure to configure your bot-config.json before starting!'

read -p "Enter to start..."

npm start
