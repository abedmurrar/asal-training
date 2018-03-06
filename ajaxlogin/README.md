# in order to access the data folder on my localhost server i did the following
* change the `apache2.conf` in `/etc/apache2/` in the Directory tag from `<Directory /var/www/ >*** AllowOverride all ***</Directory>` in order to make an .htaccess(Access File Name) for certain files/folders
* in the data file on the server i made a new file `sudo nano .htaccess`
* the data in the .htaccess file i wrote `Header set Access-Control-Allow-Origin "*"` in order to make the HTTP request allowed from the script
* i had troubles with getting a `.json` file but i solved it using a dummy data parameter with the GET request
* i used node.js server for making the GET request it was handled by apached2 server