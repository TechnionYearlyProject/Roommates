#!/bin/bash
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi
echo "************************************"
echo "MongoDB Deployment Script"
echo "************************************"
echo "Importing MongoDB keys"
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
echo "Creating a MongoDB list file"
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
echo "Updating repository"
apt-get update
echo "Installing MongoDB"
apt-get install -y --allow-unauthenticated mongodb-org
echo "Configuring MongoDB service"
unset mongoport
while [[ ! ${mongoport} =~ ^[0-9]+$ ]]; do
    echo "Insert MongoDB port (1024-60000), followed by [ENTER]:"
    read mongoport
    ! [[ ${mongoport} -ge 1024 && ${mongoport} -le 60000  ]] && unset mongoport
done
sed -i -e "s/port:.*/port: $mongoport/g" /etc/mongod.conf
read -p "Do you want to allow remote connections (y/n)?" REMOTE
if [ "$REMOTE" = "y" ]; then
 sed -i -e 's/bindIp/#bindIp/g' /etc/mongod.conf
fi
echo "Verifying installation"
service mongod start
if (( $(ps -ef | grep -v grep | grep "mongod" | wc -l) > 0 ))
then
	systemctl enable mongod.service
	echo "Installation completed successsfully. Service is running."
else
	echo "Error! could not start service"
fi
