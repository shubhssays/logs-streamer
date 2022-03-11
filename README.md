# logs-streamer

STEP 1: npm i

STEP 2. create .env file and below 3 variables to it

HOST=localhost
PORT=5555
PERMITTED_IP_ADDRESS=127.0.0.1
       

STEP 3: YOU CAN START THIS APP USING
     
      a. node log_server.js
             
             or

      b. pm2 app.js

In case, if you don't have pm2, you can install by running below command on terminal 
"**npm install pm2 -g**"

STEP 4: You can add permitted ip as command separated value in .env file. Alternatively, you can connect this app with database.
        But, you need to take care that *PERMITTED_IP_ADDRESS* (**defined in log_server.js**) should be comma separated string.
