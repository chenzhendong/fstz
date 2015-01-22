nohup mongod --bind_ip=0.0.0.0 --dbpath=`pwd`/data --nojournal --rest "$@" > mongod.log 2>&1 &


#mongod --dbpath `pwd`/data --repair --repairpath `pwd`/data