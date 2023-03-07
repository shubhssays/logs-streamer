# logs-streamer

# NOTE - 

1 .env file has been added purposely just for the sake of convience.
2. server.js file is not mandatory for this project. It is placed here for testing
   purpose. You can simply start it by "pm2 start server.js --name server".


###### FEEL FREE TO USE IT ######   


STEP 1: npm i

STEP 2. create .env file and below 3 variables to it

HOST=localhost
PORT=5555
PERMITTED_IP_ADDRESS=127.0.0.1,::1
PASSWORD=fdnjasidjtfoiwekoikeio
APP_NAME=server
       

STEP 3: YOU CAN START THIS APP USING
     
      a. node log_server.js
             
             or

      b. pm2 start log_server.js

In case, if you don't have pm2, you can install by running below command on terminal 
"**npm install pm2 -g**"

STEP 4: You can add permitted ip as command separated value in .env file. Alternatively, you can connect this app with database.
        But, you need to take care that *PERMITTED_IP_ADDRESS* (**defined in log_server.js**) should be comma separated string.

        
STEP 5: If your IP is not listed *PERMITTED_IP_ADDRESS*, then to access logs you will need to enter password. You can also specify the *PASSWORD* in .env file. If password is not specified random strong password will be automatically created. 

STEP 6: Please make sure that *APP_NAME* should be already running using pm2.
        This field cannot be empty. 