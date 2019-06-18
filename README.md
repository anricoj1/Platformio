#<h1> CSC400 Project </h1>

#Dependencies
  - install npm
  - npm install express
  - npm install request-promise
  - npm install ejs
  - npm install jsdom



#We are making a social app using Nodejs
  - This will use:
      - Google/Youtube API Authentication For sign In
      - Github API v3


# Recent Changes
  - Created Base css files
  - Fonts
  - static files
  - logging in (next)
# Necessary Items
  - Github repos are stored in a DB
  - CREATE DATABASE Project

  - CREATE TABLE Git(id INT(11) PRIMARY KEY AUTO_INCREMENT, repoName VARCHAR(100), creator VARCHAR(100));


# We shouldnt need to create a User DB. The api should handle log ins since it will be through google.

#If we do need a User DB:
  - Look into my basic google info and see what is needed
  - From there If needed, I could write User Att to the User DB values
