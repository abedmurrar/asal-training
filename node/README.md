# Node.js User database server #
## Download Node.js for any OS ##
* go to https://nodejs.org and download the LTS version of Node.js
* run the installer
* restart your computer to be able to run Node.js
## if you're using Linux Terminal ##
### if you're using Ubuntu ###
* run `curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -`
* then run `sudo apt-get install -y nodejs`
### if you're using any other distribution ###
* check https://nodejs.org/en/download/package-manager/
## How to install the server on your computer ##
* cd to `/node` folder where `package.json` file exists
* run `npm install` if Windows (you may need to run cmd as Administrator) if Linux(use sudo command)
* then run `npm start`

## Server characteristics ##
* Server works on port 3030
* server can edit, delete, insert and get users
* you can use any REST client to test the server
* GET http://localhost:3030/users/ to get all users
* POST http://localhost:3030/users/ with JSON body of (username,email,password)
* PUT http://localhost:3030/users/[id] with JSON body of (username,email,password,id)
* HTTP PUT request can contain have a missing parameter (for example edit only email, send email only in the JSON Body), but the id parameter is essential for the process
* DELETE http://localhost:3030/users/[id] only id in the JSON body

## User Characteristics ##
* A user has an id, username, password ,and email
* A username is a unique attribute for all users meaning no two users can have the same username
* A username can have at least 7 characters and maximum of 24 characters
* A username can contain uppercase and lowercase letters, dot [.], underscore [_], and dash [-]
* A username must start with a letter and end with a letter
* A username can not contain sequentially repeated special characters such as dot, underscore, and dash (for example the username 'john..doe' is not valid)
* An email will be checked for validity before the user inserted to database
* A password must at least contain 7 characters
* If any attribute of username,password, and email, turned out to be invalid, the user will not be inserted to database
* if a user was edited with a mixture of valid and invalid attributes, only valid attributes will be changed