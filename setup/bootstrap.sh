#!/bin/bash

MYSQLPASSWORD="123!"
USER="digital_id"
USERPASSWORD="abc123"

# creat the dev user
echo $USER
sudo adduser $USER --gecos "nettools,RoomNumber,WorkPhone,HomePhone" --disabled-password
echo "$USER:$USERPASSWORD" | sudo chpasswd
usermod -a -G admin $USER

#ubuntu-desktop
#sudo apt-get -y update
#sudo apt-get -y install ubuntu-desktop
#sudo apt-get -y install linux-headers-$(uname -r)
#sudo apt-get -y update
#sudo apt-get -y upgrade


# VirtualBox support
sudo apt-get -y install virtualbox-guest-dkms virtualbox-guest-utils virtualbox-guest-x11


# chrome
#wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
#sudo sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
#sudo apt-get -y update
#sudo apt-get -y install google-chrome-stable


#git
sudo apt-get -y install libcurl4-gnutls-dev libexpat1-dev gettext libz-dev libssl-dev build-essential
sudo apt-get -y install git-core
sudo apt-get -y install git

# emacs
#sudo apt-get -y install emacs23

# Sublime editor
sudo add-apt-repository ppa:webupd8team/sublime-text-3
sudo apt-get -y update
sudo apt-get -y install sublime-text-installer

# upstart
sudo apt-get -y install upstart

# various
sudo apt-get -y install chkconfig
sudo apt-get -y install curl
sudo apt-get -y install xclip

# nginx install
sudo apt-get -y install nginx-full
sudo service nginx start

# mysql install
sudo debconf-set-selections <<< "mysql-server-5.5 mysql-server/root_password password $MYSQLPASSWORD"
sudo debconf-set-selections <<< "mysql-server-5.5 mysql-server/root_password_again password $MYSQLPASSWORD"
sudo apt-get -y install mysql-server 

# TODO: mysql admin user setup
#DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
#mysql -u root -p < $DIR/mysql_create.sql

# nodejs install
sudo apt-get -y install python-software-properties python g++ make
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get -y update
sudo apt-get -y install nodejs

# create nodeuser
sudo id -g nodejs &>/dev/null || sudo groupadd nodejs
sudo id -i nodejs &>/dev/null || sudo useradd nodejs -g nodejs

# memcached install
sudo apt-get -y install memcached

# redis-server
sudo apt-get install redis-server

# Qt creator
#sudo apt-get -y install openjdk-7-jre qtcreator build-essential

#TODO- figure out shared folders
#su -c "source /home/vagrant/myapp/vagrant/user-config.sh" nettools

