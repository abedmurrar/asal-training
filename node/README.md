# Node.js User database server #
-------------
## Download Node.js for any OS ##
* Go to [Node.js Website](https://nodejs.org) and download the LTS version of Node.js
* Run the installer
* Restart your computer to be able to run Node.js
    ### If you're using Linux Terminal ###
    * If you're using __Ubuntu/Debian__, run the following commands in your terminal :
        ```sh
        curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
        sudo apt-get install -y nodejs
        ```
    * If you're using any other distribution/OS, check [Node.js downloads](https://nodejs.org/en/download/package-manager/)
------------
## How to import database configurations (MySQL) ##
* If you use phpmyadmin you can easily import it from Import button
* Using terminal/cmd
    ```sh
    cd sql/
    mysql -u root -p < asaltech.sql
    ```
* If you're using another username for MySQL change __root__ in the command to your username
* If you're using password, a password prompt will be shown then the command will be executed after you enter your password

-----------------
## How to install the server on your computer ##
* Run `npm install` (you may need to run cmd as Administrator, or use sudo command for Linux)
* To debug the server run `DEBUG=* npm start`
* If you don't want to debug use `npm start` instead
* For monitoring server use __pm2__ package, for more info check [pm2 Website](http://pm2.keymetrics.io/)

------------------
## Web Application ##
* Server is a single page application 
* Server works on port **8080**
* server can edit, delete, insert and get users
* You can use any REST client to test the server
* Admin can delete any user
* Any new registered user is considered a client, not an admin
* Passwords are encrypted into SHA-256

### API
|HTTP method| Link | Action |
|:-----:|:-----:|:-----:|
| GET | `localhost:8080/users` | Get all users (admin only)|
| GET | `localhost:8080/users/[id]` | Get user by id
| POST | `localhost:8080/users` | Insert new user, check [examples](#markdown-header-examples)
| POST | `localhost:8080/resets` | Create reset password request
| PUT | `localhost:8080/users/[id]` | Edit user, check [examples](#markdown-header-examples) (logged in user)|
| PUT | `localhost:8080/resets/[token]` | Reset password (change)
| DELETE | `localhost:8080/users/[id]` | Delete user from database (logged in user/admin)

---------
## User Characteristics ##
* A user has an id, username, password ,and email
    ### Username ###
    * A username is a unique attribute for all users meaning no two users can have the same username
    * A username can have at least 7 characters and maximum of 24 characters
    * A username can contain uppercase and lowercase letters, dot [.], underscore [_], and dash [-]
    * A username can not contain sequentially repeated special characters such as dot, underscore, and dash (for example the username 'john..doe' is not valid)
    * A username must start with a letter and end with a letter
    

    ### Email ##
    * An email will be checked for validity before the user inserted to database
    ### Password ###
    * A password must at least contain 7 characters
    ---------

* If any attribute of username,password, and email, turned out to be invalid, the user will not be inserted to database
* If a user was __edited__ with a mixture of valid and invalid attributes, only valid attributes will be changed

--------------------
## Examples ##

### POST

__POST__ is used to insert a new user into database. POST can be acheived using JSON body with the __required__ fields :
* username
* password
* email

```json
{
    "username": "john.doe",
    "password": "my123p@ssw0rd",
    "email": "john.doe@example.com"
}
```
__POST__ is also used to generate a reset password request to be sent to email, it is accomplished with the required fields:
* email
```json
{
    "email":"myemail@example.com"
}
```
If the email exists, a message will be sent to the email.

--------
### PUT ###
PUT is used to edit a user's attribute which is one of the following :
* username
* password
* email

PUT can have a missing attribute in the JSON body, for example, to change the email only :
```json
{
    "email":"new.email@example.com"
}
```

To change the username and password :
```json
{
    "username":"new_username",
    "password":"newPASS\/\/0Rd"
}
```
All fields can be edited at once too.

__PUT__ is also used with reset requests, after the user goes to the link sent to his/her email and changes his/her password with the required fields:
```json
{
    "password":"newPassWord",
    "confirmPassword":"newPassWord"
}
```
in addition of the token in the url.