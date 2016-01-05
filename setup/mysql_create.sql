create user 'admin'@'localhost' identified by 'abc123!';

grant all privileges on *.* to 'admin'@'localhost' with grant option;

flush privileges;