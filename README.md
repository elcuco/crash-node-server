# crash-node-server

This is a server which can handle exceptions uploads from https://github.com/elcuco/CrashHandlerExample/

There is a main entry point - to which the mobile SDK dumps its crash session. Each dump contains
several crash session. 

The main index of the server just lists the available dumps and links to another API link to see
a single API dump.

TODO:
 - after uploading a dump, it should be processed into a DB and extract all sessions from it
 - we need to display sessions, on the main page
 - we need to be able to display data about a specific crash session
 - we need to be able to link crashes together - and see "hey, this crash looks like this one!"
 - we need to be able to display the crashes based on application 
 ... etc
 
