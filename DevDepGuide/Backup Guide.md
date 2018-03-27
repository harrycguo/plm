# Backup Guide
### Musketeers - Production Lifecycle Manager

This is a guide to setting up a backup server, running the backup script, and restoring from backups. 

#### Dependencies

This guide assumes that the server you are backing up from has sshfs installed. There are many guides available for how to install sshfs. 

This guide assumes that you have python 2.7.* installed

### To set up a remote server for use as a backup server

On the remote server: create a folder which you will mount your sshfs to

Create the following empty folders within that mount folder:
day1, day2, 
day3, day4,
day5, day6, 
day7,    
week1, week2, 
week3, week4,
month1, month2, 
month3, month4, 
month5, month6,
month7, month8, 
month9, month10, 
month11, month12

### To start the backup script and run it chronologically 

On the development hosting server: 

create a folder called "backupMount"

In the script backupmagic.py, edit the email address both calls to the function sendAnEmail toward the bottom of the script. This will send emails to the specified address. 

run:
```
sshfs remoteserverAddreess:path/to/backupLocation /path/to/backupMount/
```
Create a crontab for the script. 

To run the script every night:
Run 
```
crontab -e
```
Insert new line:
```
30 0 * * * python /path/to/backupmagic.py
```
### To restore from a backup

Due to limitations with mongodb, in order to restore from a mongo backup, you must first drop your mongo database. 

If you set up your mongodb as specified in the Deployment Guide, run 
```
mongo -u admin -p admin123 --authenticationDatabase admin
```
replacing admin and admin123 with your chosen admin username and password

Once in the mongo shell run: 
```
use plm
db.dropDatabase()
exit
```
Then run 
```
mongorestore path/to/backupMount/BACKUP
```
where BACKUP is replaced with the folder of the backup you want to restore from day1-day7, week1-week4, or month1-month12. 


