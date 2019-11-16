# Welcome To Platform.io (v1.1)

# Dependencies
  - chmod u+x node-packs.sh
  - ./node-packs.sh

# Recent Changes
  - User Sidebar
  - Notifications (Webpush)
  - Upload Photos (multer)
  - Follow Users

# In Progress
  - Realtime Feed (Pusher)
  - Profile Page Completion
  - Account Setup / Dashboard

# Due Nov 23, 2019
  - For this date:
    - Deployed on GCP
  - Features Needed For Launch:
    - Link Accounts (IP)
    - Upload Photos (Complete)
    - Follow User (Complete)
    - Push Notifications (Complete)
    - Realtime Feed

Once realtime feed is done, focus on fetching more data and completing
user profile. The deploy the site and write documentation.    

# Notifications
  - Make Notification Route
  - $.getJSON of that data
  - make script to send as
  - Web-Push / Pusher

# Extra Notes
  - Avoid undefined error!!
    - if rows.length
        - do stuff with api
    - else (this user has not linked this account yet)
        - send it as null


# Tables
CREATE TABLE User (id VARCHAR(200) PRIMARY KEY, token VARCHAR(200), email VARCHAR(200), name VARCHAR(200), password VARCHAR(200), banner VARCHAR(200), avi VARCHAR(200));

CREATE TABLE Followers (followNum INT(11) PRIMARY KEY AUTO_INCREMENT, userID VARCHAR(200), paramID VARCHAR(200), following TINYINT(1));

CREATE TABLE Github (gitID VARCHAR(200) PRIMARY KEY, user_id VARCHAR(200), git_name VARCHAR(200), followersURL VARCHAR(300), followingURL VARCHAR(300), reposURL VARCHAR(300));

CREATE TABLE Twitch (twitchID VARCHAR(200) PRIMARY KEY, user_id VARCHAR(200), display_name VARCHAR(200));

CREATE TABLE Twitter (twitterID VARCHAR(200) PRIMARY KEY, user_id VARCHAR(200), screen_name VARCHAR(200));

CREATE TABLE Posts (postID VARCHAR(200) PRIMARY KEY, user_id VARCHAR(200), user_name VARCHAR(200), status VARCHAR(200), date_time VARCHAR(200));



# Needed Functions
function followUser(id, user) {

}

function wasFollower(user_id) {

}

function unfollowUser(id, user) {

}

function makePost() {

}

function likePost(post_id) {

}

function commentPost(post_id, user) {

}

function goPrivate(id) {

}

function goPublic(id) {

}
