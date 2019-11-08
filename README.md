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
