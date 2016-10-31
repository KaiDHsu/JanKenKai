# jankenkai


This Repo is forked from my other Project JanKen.

JanKen was created as an item for an interview. Unfortunately, the contraints of the task limited me to only using JQuery.
I did however play around with Canvas elements and decided to use them for a few of the sections in the UI.

I've decided to double back and hook it up with a NodeJS sever and MongoDB.

The Front End remains largely unchanged, for now.

Players are now able to register/login in order to keep track of scores history, or they can continue playing as a Guest.

The passwords are hashed and encrypted in node, and never stored in MongoDB, instead the hash and the encryption are (Following Standards).

A sessionToken is generated upon login and expires after 1 hour.

TODOs:
- Finish templating the History section.
- Redirect the Player back to login after sessionToken expires
