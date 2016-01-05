create table if not exists time_zones
(
	id int unsigned not null auto_increment primary key,
	uuid binary(16) not null,

	name varchar(64) not null,
	display_name varchar(64) not null,
	daylight_name nvarchar(64) not null,
	utc_offset smallint not null,
	adjust_for_daylight_savings bool not null,
	daylight_savings_adjustment smallint not null,

	date_added datetime not null,
	last_modified timestamp not null DEFAULT CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP

) ENGINE={{engine}}, AUTO_INCREMENT = {{seed}};
DELIMITER ;
call createindex('{{database}}','time_zones','time_zones_uuid_unique_index','uuid', 1);
DELIMITER ;
call createindex('{{database}}','time_zones','time_zones_name_unique_index','name', 1);
DELIMITER ;
create table if not exists cultures
(
	id int unsigned not null auto_increment primary key,
	uuid binary(16) not null,

	name varchar(160) not null,
	display varchar(160) not null,
	iso639_1 varchar(2) not null,
	iso639_2 varchar(3) not null,
	is_enabled bool not null default 1,
	is_visible bool not null default 0,

	date_added datetime not null,
	last_modified timestamp not null DEFAULT CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP

) ENGINE={{engine}}, AUTO_INCREMENT = {{seed}};
DELIMITER ;
call createindex('{{database}}','cultures','cultures_uuid_unique_index','uuid', 1);
DELIMITER ;
call createindex('{{database}}','cultures','cultures_name_unique_index','name', 1);
DELIMITER ;
create table if not exists localized_string_names
(
	id int unsigned not null auto_increment primary key,
	uuid binary(16) not null,

	name varchar(128) not null,

	date_added datetime not null,
	last_modified timestamp not null DEFAULT CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP

) ENGINE={{engine}}, AUTO_INCREMENT = {{seed}};
DELIMITER ;
call createindex('{{database}}','localized_string_names','localized_string_names_uuid_unique_index','uuid', 1);
DELIMITER ;
create table if not exists localized_strings
(
	id int unsigned not null auto_increment primary key,
	uuid binary(16) not null,

	localized_string_name_id int unsigned not null,
	culture_id int unsigned not null,
	value varchar(512) not null,

	date_added datetime not null,
	last_modified timestamp not null DEFAULT CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP,
	foreign key  (culture_id) references cultures(id),
	foreign key  (localized_string_name_id) references localized_string_names(id)

) ENGINE={{engine}}, AUTO_INCREMENT = {{seed}};
DELIMITER ;
call createindex('{{database}}','localized_strings','localized_strings_uuid_unique_index','uuid', 1);
DELIMITER ;
call createindex('{{database}}','localized_strings','localized_strings_culture_id_localized_string_name_id_unique_index','culture_id,localized_string_name_id', 1);
DELIMITER ;

create table if not exists users
(
	id bigint unsigned not null auto_increment primary key,
	uuid binary(16) not null,

	email varchar(160) not null,
	type enum('anonymous','power','premium') not null default 'anonymous',	
	culture_id int unsigned not null,
	time_zone_id int unsigned not null,

	password varchar(128) not null,
	password_salt varchar(128) not null,

	is_unsubscribed bool not null default 0,
	is_active bool not null default 0,
	is_locked bool not null default 0,

	last_password_failed_time datetime not null default 0,
	number_password_failed_attempts int not null default 0,

	date_added datetime not null,
	last_modified timestamp not null DEFAULT CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP,
	foreign key  (culture_id) references cultures(id),
	foreign key  (time_zone_id) references time_zones(id)

) ENGINE={{engine}}, AUTO_INCREMENT = {{seed}};
DELIMITER ;
call createindex('{{database}}','users','users_uuid_unique_index','uuid', 1);
DELIMITER ;
call createindex('{{database}}','users','users_email_unique_index','email', 1);
DELIMITER ;
create table if not exists sessions
(
	id bigint unsigned not null auto_increment primary key,
	uuid binary(16) not null,

	user_id bigint unsigned not null,

	start_time datetime not null,
	end_time datetime not null,
	last_activity_time datetime not null,
	hit_count int not null default 0,
	ip_address bigint unsigned not null default 0,
	is_expired bool not null default 0,

	date_added datetime not null,
	last_modified timestamp not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

	foreign key  (user_id) references users(id)
) ENGINE={{engine}},  AUTO_INCREMENT = {{seed}};
DELIMITER ;
call createindex('{{database}}','sessions','sessions_uuid_unique_index','uuid', 1);
DELIMITER ;
create table if not exists user_keys
(
	id bigint unsigned not null auto_increment primary key,
	uuid binary(16) not null,

	user_id bigint unsigned not null,

	name varchar(128) not null,
	public_key varchar(4096) not null,
	key_length int unsigned not null default 2048,
	passphrase varchar(128) not null,

	is_expired bool not null default 0,

	date_added datetime not null,
	last_modified timestamp not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

	foreign key  (user_id) references users(id)
) ENGINE={{engine}},  AUTO_INCREMENT = {{seed}};
DELIMITER ;
call createindex('{{database}}','user_keys','user_keys_uuid_unique_index','uuid', 1);
DELIMITER ;
call createindex('{{database}}','user_keys','user_keys_user_id_name_unique_index','uuid', 1);
DELIMITER ;

DELIMITER ;
create table if not exists user_key_challenges
(
	id bigint unsigned not null auto_increment primary key,
	uuid binary(16) not null,

	user_key_id bigint unsigned not null,
	challenge varchar(1025) not null,

	expiry_time datetime not null,

	date_added datetime not null,
	last_modified timestamp not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

	foreign key  (user_key_id) references user_keys(id)
) ENGINE={{engine}},  AUTO_INCREMENT = {{seed}};
DELIMITER ;
call createindex('{{database}}','user_keys','user_key_challenges_uuid_unique_index','uuid', 1);
DELIMITER ;
call createindex('{{database}}','user_keys','user_key_challenges_user_key_id_index','uuid', 0);
DELIMITER ;

create table if not exists contacts
(
	id bigint unsigned not null auto_increment primary key,
	uuid binary(16) not null,

	user_id bigint unsigned not null,
	
	first_name varchar(64) not null,
	last_name varchar(64) not null,
	middle_name varchar(64) not null default N'',

	date_of_birth datetime not null,

	date_added datetime not null,
	last_modified timestamp not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

	foreign key  (user_id) references users(id)
) ENGINE={{engine}},  AUTO_INCREMENT = {{seed}};
DELIMITER ;
call createindex('{{database}}','contacts','contacts_uuid_unique_index','uuid', 1);
DELIMITER ;

create table if not exists addresses
(
	id bigint unsigned not null auto_increment primary key,
	uuid binary(16) not null,
	contact_id bigint unsigned not null,

	address_line1 varchar(64) not null default N'',
	address_line2 varchar(64) not null default  N'',
	city varchar(64) not null default  N'',

	postal_code varchar(32) not null default  N'',

	date_added datetime not null,
	last_modified timestamp not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

	foreign key  (contact_id) references contacts(id)
) ENGINE={{engine}},  AUTO_INCREMENT = {{seed}};

DELIMITER ;
call createindex('{{database}}','addresses','addresses_uuid_unique_index','uuid', 1);
DELIMITER ;

create table  if not exists social_network_mappings
(
	id bigint unsigned not null auto_increment primary key,
	uuid binary(16) not null,
	user_id bigint unsigned not null,

	network enum('facebook','google') not null default 'facebook',
	remote_id bigint not null,
	access_token varchar(256) not null default N'',

	date_added datetime not null,
	last_modified timestamp not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

	foreign key  (user_id) references users(id)
) ENGINE={{engine}},   AUTO_INCREMENT = {{seed}};


DELIMITER ;
call createindex('{{database}}','social_network_mappings','social_network_mappings_uuid_unique_index','uuid', 1);
DELIMITER ;

create table  if not exists roles
(
	id int unsigned not null auto_increment primary key,
	uuid binary(16) not null,

	name varchar(256) not null,

	date_added datetime not null,
	last_modified timestamp not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE={{engine}},  AUTO_INCREMENT = {{seed}};


DELIMITER ;
call createindex('{{database}}','roles','roles_uuid_unique_index','uuid', 1);
DELIMITER ;
	
create table if not exists users_roles
(
	id bigint unsigned not null auto_increment primary key,
	uuid binary(16) not null,

	user_id bigint unsigned not null,
	role_id int unsigned not null,

	date_added datetime not null,
	last_modified timestamp not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

	foreign key  (user_id) references users(id),
	foreign key  (role_id) references roles(id)

) ENGINE={{engine}},   AUTO_INCREMENT = {{seed}};
DELIMITER ;
call createindex('{{database}}','users_roles','users_roles_uuid_unique_index','uuid', 1);
DELIMITER ;
call createindex('{{database}}','users_roles','users_roles_user_id_roles_unique_index','user_id,role_id', 1);
DELIMITER ;


create table if not exists configs
(
	id int unsigned not null auto_increment primary key,
	uuid binary(16) not null,

	name varchar(128) not null,
	value varchar(1025) not null default '',

	date_added datetime not null,
	last_modified timestamp not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP


) ENGINE={{engine}},   AUTO_INCREMENT = {{seed}};
DELIMITER ;
call createindex('{{database}}','configs','configs_uuid_unique_index','uuid', 1);
DELIMITER ;
call createindex('{{database}}','configs','configs_name_unique_index','name', 1);


DELIMITER ;
insert ignore into roles (id, uuid,name, date_added) values(1, uuid(), 'admin', UTC_TIMESTAMP());
DELIMITER ;
insert ignore into roles (id, uuid,name, date_added) values(2, uuid(), 'support', UTC_TIMESTAMP());

DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(1,uuid(),'Greenwich Standard Time','(GMT) Casablanca, Monrovia, Reykjavik','Greenwich Daylight Time',0,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(2,uuid(),'GMT Standard Time','(GMT) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London','GMT Daylight Time',0,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(3,uuid(),'W. Europe Standard Time','(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna','W. Europe Daylight Time',60,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(4,uuid(),'Central Europe Standard Time','(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague','Central Europe Daylight Time',60,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(5,uuid(),'Romance Standard Time','(GMT+01:00) Brussels, Copenhagen, Madrid, Paris','Romance Daylight Time',60,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(6,uuid(),'Central European Standard Time','(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb','Central European Daylight Time',60,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(7,uuid(),'W. Central Africa Standard Time','(GMT+01:00) West Central Africa','W. Central Africa Daylight Time',60,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(8,uuid(),'Jordan Standard Time','(GMT+02:00) Amman','Jordan Daylight Time',120,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(9,uuid(),'GTB Standard Time','(GMT+02:00) Athens, Bucharest, Istanbul','GTB Daylight Time',120,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(10,uuid(),'Middle East Standard Time','(GMT+02:00) Beirut','Middle East Daylight Time',120,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(11,uuid(),'Egypt Standard Time','(GMT+02:00) Cairo','Egypt Daylight Time',120,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(12,uuid(),'South Africa Standard Time','(GMT+02:00) Harare, Pretoria','South Africa Daylight Time',120,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(13,uuid(),'FLE Standard Time','(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius','FLE Daylight Time',120,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(14,uuid(),'Jerusalem Standard Time','(GMT+02:00) Jerusalem','Jerusalem Daylight Time',120,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(15,uuid(),'E. Europe Standard Time','(GMT+02:00) Minsk','E. Europe Daylight Time',120,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(16,uuid(),'Namibia Standard Time','(GMT+02:00) Windhoek','Namibia Daylight Time',120,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(17,uuid(),'Arabic Standard Time','(GMT+03:00) Baghdad','Arabic Daylight Time',180,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(18,uuid(),'Arab Standard Time','(GMT+03:00) Kuwait, Riyadh','Arab Daylight Time',180,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(19,uuid(),'Russian Standard Time','(GMT+03:00) Moscow, St. Petersburg, Volgograd','Russian Daylight Time',180,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(20,uuid(),'E. Africa Standard Time','(GMT+03:00) Nairobi','E. Africa Daylight Time',180,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(21,uuid(),'Georgian Standard Time','(GMT+03:00) Tbilisi','Georgian Daylight Time',180,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(22,uuid(),'Iran Standard Time','(GMT+03:30) Tehran','Iran Daylight Time',210,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(23,uuid(),'Arabian Standard Time','(GMT+04:00) Abu Dhabi, Muscat','Arabian Daylight Time',240,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(24,uuid(),'Azerbaijan Standard Time','(GMT+04:00) Baku','Azerbaijan Daylight Time',240,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(25,uuid(),'Caucasus Standard Time','(GMT+04:00) Caucasus Standard Time','Caucasus Daylight Time',240,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(26,uuid(),'Armenian Standard Time','(GMT+04:00) Yerevan','Armenian Daylight Time',240,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(27,uuid(),'Afghanistan Standard Time','(GMT+04:30) Kabul','Afghanistan Daylight Time',270,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(28,uuid(),'Ekaterinburg Standard Time','(GMT+05:00) Ekaterinburg','Ekaterinburg Daylight Time',300,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(29,uuid(),'West Asia Standard Time','(GMT+05:00) Islamabad, Karachi, Tashkent','West Asia Daylight Time',300,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(30,uuid(),'India Standard Time','(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi','India Daylight Time',330,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(31,uuid(),'Sri Lanka Standard Time','(GMT+05:30) Sri Jayawardenepura','Sri Lanka Daylight Time',330,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(32,uuid(),'Nepal Standard Time','(GMT+05:45) Kathmandu','Nepal Daylight Time',345,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(33,uuid(),'N. Central Asia Standard Time','(GMT+06:00) Almaty, Novosibirsk','N. Central Asia Daylight Time',360,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(34,uuid(),'Central Asia Standard Time','(GMT+06:00) Astana, Dhaka','Central Asia Daylight Time',360,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(35,uuid(),'Myanmar Standard Time','(GMT+06:30) Yangon (Rangoon)','Myanmar Daylight Time',390,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(36,uuid(),'SE Asia Standard Time','(GMT+07:00) Bangkok, Hanoi, Jakarta','SE Asia Daylight Time',420,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(37,uuid(),'North Asia Standard Time','(GMT+07:00) Krasnoyarsk','North Asia Daylight Time',420,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(38,uuid(),'China Standard Time','(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi','China Daylight Time',480,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(39,uuid(),'North Asia East Standard Time','(GMT+08:00) Irkutsk, Ulaan Bataar','North Asia East Daylight Time',480,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(40,uuid(),'Malay Peninsula Standard Time','(GMT+08:00) Kuala Lumpur, Singapore','Malay Peninsula Daylight Time',480,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(41,uuid(),'W. Australia Standard Time','(GMT+08:00) Perth','W. Australia Daylight Time',480,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(42,uuid(),'Taipei Standard Time','(GMT+08:00) Taipei','Taipei Daylight Time',480,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(43,uuid(),'Tokyo Standard Time','(GMT+09:00) Osaka, Sapporo, Tokyo','Tokyo Daylight Time',540,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(44,uuid(),'Korea Standard Time','(GMT+09:00) Seoul','Korea Daylight Time',540,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(45,uuid(),'Yakutsk Standard Time','(GMT+09:00) Yakutsk','Yakutsk Daylight Time',540,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(46,uuid(),'Cen. Australia Standard Time','(GMT+09:30) Adelaide','Cen. Australia Daylight Time',570,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(47,uuid(),'AUS Central Standard Time','(GMT+09:30) Darwin','AUS Central Daylight Time',570,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(48,uuid(),'E. Australia Standard Time','(GMT+10:00) Brisbane','E. Australia Daylight Time',600,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(49,uuid(),'AUS Eastern Standard Time','(GMT+10:00) Canberra, Melbourne, Sydney','AUS Eastern Daylight Time',600,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(50,uuid(),'West Pacific Standard Time','(GMT+10:00) Guam, Port Moresby','West Pacific Daylight Time',600,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(51,uuid(),'Tasmania Standard Time','(GMT+10:00) Hobart','Tasmania Daylight Time',600,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(52,uuid(),'Vladivostok Standard Time','(GMT+10:00) Vladivostok','Vladivostok Daylight Time',600,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(53,uuid(),'Central Pacific Standard Time','(GMT+11:00) Magadan, Solomon Is., New Caledonia','Central Pacific Daylight Time',660,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(54,uuid(),'New Zealand Standard Time','(GMT+12:00) Auckland, Wellington','New Zealand Daylight Time',720,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(55,uuid(),'Fiji Standard Time','(GMT+12:00) Fiji, Kamchatka, Marshall Is.','Fiji Daylight Time',720,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(56,uuid(),'Tonga Standard Time','(GMT+13:00) Nuku''alofa','Tonga Daylight Time',780,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(57,uuid(),'Azores Standard Time','(GMT-01:00) Azores','Azores Daylight Time',-60,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(58,uuid(),'Cape Verde Standard Time','(GMT-01:00) Cape Verde Is.','Cape Verde Daylight Time',-60,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(59,uuid(),'Mid-Atlantic Standard Time','(GMT-02:00) Mid-Atlantic','Mid-Atlantic Daylight Time',-120,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(60,uuid(),'E. South America Standard Time','(GMT-03:00) Brasilia','E. South America Daylight Time',-180,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(61,uuid(),'SA Eastern Standard Time','(GMT-03:00) Buenos Aires, Georgetown','SA Eastern Daylight Time',-180,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(62,uuid(),'Greenland Standard Time','(GMT-03:00) Greenland','Greenland Daylight Time',-180,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(63,uuid(),'Montevideo Standard Time','(GMT-03:00) Montevideo','Montevideo Daylight Time',-180,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(64,uuid(),'Newfoundland Standard Time','(GMT-03:30) Newfoundland','Newfoundland Daylight Time',-210,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(65,uuid(),'Atlantic Standard Time','(GMT-04:00) Atlantic Time (Canada)','Atlantic Daylight Time',-240,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(66,uuid(),'SA Western Standard Time','(GMT-04:00) La Paz','SA Western Daylight Time',-240,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(67,uuid(),'Central Brazilian Standard Time','(GMT-04:00) Manaus','Central Brazilian Daylight Time',-240,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(68,uuid(),'Pacific SA Standard Time','(GMT-04:00) Santiago','Pacific SA Daylight Time',-240,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(69,uuid(),'Venezuela Standard Time','(GMT-04:30) Caracas','Venezuela Daylight Time',-270,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(70,uuid(),'SA Pacific Standard Time','(GMT-05:00) Bogota, Lima, Quito, Rio Branco','SA Pacific Daylight Time',-300,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(71,uuid(),'Eastern Standard Time','(GMT-05:00) Eastern Time (US & Canada)','Eastern Daylight Time',-300,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(72,uuid(),'US Eastern Standard Time','(GMT-05:00) Indiana (East)','US Eastern Daylight Time',-300,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(73,uuid(),'Central America Standard Time','(GMT-06:00) Central America','Central America Daylight Time',-360,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(74,uuid(),'Central Standard Time','(GMT-06:00) Central Time (US & Canada)','Central Daylight Time',-360,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(75,uuid(),'Central Standard Time (Mexico)','(GMT-06:00) Guadalajara, Mexico City, Monterrey - New','Central Daylight Time (Mexico)',-360,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(76,uuid(),'Mexico Standard Time','(GMT-06:00) Guadalajara, Mexico City, Monterrey - Old','Mexico Daylight Time',-360,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(77,uuid(),'Canada Central Standard Time','(GMT-06:00) Saskatchewan','Canada Central Daylight Time',-360,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(78,uuid(),'US Mountain Standard Time','(GMT-07:00) Arizona','US Mountain Daylight Time',-420,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(79,uuid(),'Mountain Standard Time (Mexico)','(GMT-07:00) Chihuahua, La Paz, Mazatlan - New','Mountain Daylight Time (Mexico)',-420,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(80,uuid(),'Mexico Standard Time 2','(GMT-07:00) Chihuahua, La Paz, Mazatlan - Old','Mexico Daylight Time 2',-420,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(81,uuid(),'Mountain Standard Time','(GMT-07:00) Mountain Time (US & Canada)','Mountain Daylight Time',-420,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(82,uuid(),'Pacific Standard Time','(GMT-08:00) Pacific Time (US & Canada)','Pacific Daylight Time',-480,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(83,uuid(),'Pacific Standard Time (Mexico)','(GMT-08:00) Tijuana, Baja California','Pacific Daylight Time (Mexico)',-480,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(84,uuid(),'Alaskan Standard Time','(GMT-09:00) Alaska','Alaskan Daylight Time',-540,1,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(85,uuid(),'Hawaiian Standard Time','(GMT-10:00) Hawaii','Hawaiian Daylight Time',-600,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(86,uuid(),'Samoa Standard Time','(GMT-11:00) Midway Island, Samoa','Samoa Daylight Time',-660,0,60,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into time_zones (id, uuid, name, display_name, daylight_name, utc_offset, adjust_for_daylight_savings, daylight_savings_adjustment, date_added) values(87,uuid(),'Dateline Standard Time','(GMT-12:00) International Date Line West','Dateline Daylight Time',-720,0,60,UTC_TIMESTAMP())
DELIMITER ;

insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(1,uuid(),'Abkhaz','аҧсуа бызшәа, аҧсшәа','ab','abk',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(2,uuid(),'Afar','Afaraf','aa','aar',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(3,uuid(),'Afrikaans','Afrikaans','af','afr',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(4,uuid(),'Akan','Akan','ak','aka',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(5,uuid(),'Albanian','gjuha shqipe','sq','sqi',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(6,uuid(),'Amharic','አማርኛ','am','amh',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(7,uuid(),'Arabic','العربية','ar','ara',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(8,uuid(),'Aragonese','aragonés','an','arg',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(9,uuid(),'Armenian','Հայերեն','hy','hye',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(10,uuid(),'Assamese','অসমীয়া','as','asm',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(11,uuid(),'Avaric','авар мацӀ, магӀарул мацӀ','av','ava',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(12,uuid(),'Avestan','avesta','ae','ave',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(13,uuid(),'Aymara','aymar aru','ay','aym',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(14,uuid(),'Azerbaijani','azərbaycan dili','az','aze',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(15,uuid(),'Bambara','bamanankan','bm','bam',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(16,uuid(),'Bashkir','башҡорт теле','ba','bak',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(17,uuid(),'Basque','euskara, euskera','eu','eus',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(18,uuid(),'Belarusian','беларуская мова','be','bel',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(19,uuid(),'Bengali; Bangla','বাংলা','bn','ben',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(20,uuid(),'Bihari','भोजपुरी','bh','bih',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(21,uuid(),'Bislama','Bislama','bi','bis',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(22,uuid(),'Bosnian','bosanski jezik','bs','bos',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(23,uuid(),'Breton','brezhoneg','br','bre',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(24,uuid(),'Bulgarian','български език','bg','bul',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(25,uuid(),'Burmese','Burmese','my','mya',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(26,uuid(),'Catalan; Valencian','català, valencià','ca','cat',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(27,uuid(),'Chamorro','Chamoru','ch','cha',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(28,uuid(),'Chechen','нохчийн мотт','ce','che',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(29,uuid(),'Chichewa; Chewa; Nyanja','chiCheŵa, chinyanja','ny','nya',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(30,uuid(),'Chinese','中文 (Zhōngwén), 汉语, 漢語','zh','zho',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(31,uuid(),'Chuvash','чӑваш чӗлхи','cv','chv',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(32,uuid(),'Cornish','Kernewek','kw','cor',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(33,uuid(),'Corsican','corsu, lingua corsa','co','cos',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(34,uuid(),'Cree','ᓀᐦᐃᔭᐍᐏᐣ','cr','cre',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(35,uuid(),'Croatian','hrvatski jezik','hr','hrv',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(36,uuid(),'Czech','čeština, český jazyk','cs','ces',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(37,uuid(),'Danish','dansk','da','dan',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(38,uuid(),'Divehi; Dhivehi; Maldivian;','ދިވެހި','dv','div',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(39,uuid(),'Dutch','Nederlands, Vlaams','nl','nld',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(40,uuid(),'Dzongkha','རྫོང་ཁ','dz','dzo',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(41,uuid(),'English','English','en','eng',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(42,uuid(),'Esperanto','Esperanto','eo','epo',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(43,uuid(),'Estonian','eesti, eesti keel','et','est',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(44,uuid(),'Ewe','Eʋegbe','ee','ewe',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(45,uuid(),'Faroese','føroyskt','fo','fao',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(46,uuid(),'Fijian','vosa Vakaviti','fj','fij',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(47,uuid(),'Finnish','suomi, suomen kieli','fi','fin',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(48,uuid(),'French','français, langue française','fr','fra',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(49,uuid(),'Fula; Fulah; Pulaar; Pular','Fulfulde, Pulaar, Pular','ff','ful',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(50,uuid(),'Galician','galego','gl','glg',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(51,uuid(),'Georgian','ქართული','ka','kat',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(52,uuid(),'German','Deutsch','de','deu',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(53,uuid(),'Greek, Modern','ελληνικά','el','ell',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(54,uuid(),'Guaraní','Avañe','gn','grn',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(55,uuid(),'Gujarati','ગુજરાતી','gu','guj',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(56,uuid(),'Haitian; Haitian Creole','Kreyòl ayisyen','ht','hat',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(57,uuid(),'Hausa','(Hausa) هَوُسَ','ha','hau',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(58,uuid(),'Hebrew (modern)','עברית','he','heb',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(59,uuid(),'Herero','Otjiherero','hz','her',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(60,uuid(),'Hindi','हिन्दी, हिंदी','hi','hin',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(61,uuid(),'Hiri Motu','Hiri Motu','ho','hmo',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(62,uuid(),'Hungarian','magyar','hu','hun',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(63,uuid(),'Interlingua','Interlingua','ia','ina',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(64,uuid(),'Indonesian','Bahasa Indonesia','id','ind',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(65,uuid(),'Interlingue','Originally called Occidental; then Interlingue after WWII','ie','ile',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(66,uuid(),'Irish','Gaeilge','ga','gle',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(67,uuid(),'Igbo','Asụsụ Igbo','ig','ibo',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(68,uuid(),'Inupiaq','Iñupiaq, Iñupiatun','ik','ipk',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(69,uuid(),'Ido','Ido','io','ido',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(70,uuid(),'Icelandic','Íslenska','is','isl',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(71,uuid(),'Italian','italiano','it','ita',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(72,uuid(),'Inuktitut','ᐃᓄᒃᑎᑐᑦ','iu','iku',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(73,uuid(),'Japanese','日本語 (にほんご)','ja','jpn',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(74,uuid(),'Javanese','basa Jawa','jv','jav',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(75,uuid(),'Kalaallisut, Greenlandic','kalaallisut, kalaallit oqaasii','kl','kal',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(76,uuid(),'Kannada','ಕನ್ನಡ','kn','kan',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(77,uuid(),'Kanuri','Kanuri','kr','kau',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(78,uuid(),'Kashmiri','कश्मीरी, كشميري‎','ks','kas',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(79,uuid(),'Kazakh','қазақ тілі','kk','kaz',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(80,uuid(),'Khmer','ខ្មែរ, ខេមរភាសា, ភាសាខ្មែរ','km','khm',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(81,uuid(),'Kikuyu, Gikuyu','Gĩkũyũ','ki','kik',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(82,uuid(),'Kinyarwanda','Ikinyarwanda','rw','kin',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(83,uuid(),'Kyrgyz','Кыргызча, Кыргыз тили','ky','kir',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(84,uuid(),'Komi','коми кыв','kv','kom',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(85,uuid(),'Kongo','KiKongo','kg','kon',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(86,uuid(),'Korean','한국어, 조선어','ko','kor',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(87,uuid(),'Kurdish','Kurdî, كوردی‎','ku','kur',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(88,uuid(),'Kwanyama, Kuanyama','Kuanyama','kj','kua',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(89,uuid(),'Latin','latine, lingua latina','la','lat',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(90,uuid(),'Luxembourgish, Letzeburgesch','Lëtzebuergesch','lb','ltz',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(91,uuid(),'Ganda','Luganda','lg','lug',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(92,uuid(),'Limburgish, Limburgan, Limburger','Limburgs','li','lim',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(93,uuid(),'Lingala','Lingála','ln','lin',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(94,uuid(),'Lao','ພາສາລາວ','lo','lao',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(95,uuid(),'Lithuanian','lietuvių kalba','lt','lit',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(96,uuid(),'Luba-Katanga','Tshiluba','lu','lub',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(97,uuid(),'Latvian','latviešu valoda','lv','lav',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(98,uuid(),'Manx','Gaelg, Gailck','gv','glv',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(99,uuid(),'Macedonian','македонски јазик','mk','mkd',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(100,uuid(),'Malagasy','fiteny malagasy','mg','mlg',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(101,uuid(),'Malay','bahasa Melayu, بهاس ملايو‎','ms','msa',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(102,uuid(),'Malayalam','മലയാളം','ml','mal',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(103,uuid(),'Maltese','Malti','mt','mlt',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(104,uuid(),'Māori','te reo Māori','mi','mri',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(105,uuid(),'Marathi (Marāṭhī)','मराठी','mr','mar',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(106,uuid(),'Marshallese','Kajin M̧ajeļ','mh','mah',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(107,uuid(),'Mongolian','монгол','mn','mon',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(108,uuid(),'Nauru','Ekakairũ Naoero','na','nau',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(109,uuid(),'Navajo, Navaho','Diné bizaad, Dinékʼehǰí','nv','nav',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(110,uuid(),'Norwegian Bokmål','Norsk bokmål','nb','nob',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(111,uuid(),'North Ndebele','isiNdebele','nd','nde',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(112,uuid(),'Nepali','नेपाली','ne','nep',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(113,uuid(),'Ndonga','Owambo','ng','ndo',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(114,uuid(),'Norwegian Nynorsk','Norsk nynorsk','nn','nno',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(115,uuid(),'Norwegian','Norsk','no','nor',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(116,uuid(),'Nuosu','Nuosuhxop','ii','iii',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(117,uuid(),'South Ndebele','isiNdebele','nr','nbl',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(118,uuid(),'Occitan','occitan, lenga d''òc','oc','oci',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(119,uuid(),'Ojibwe, Ojibwa','ᐊᓂᔑᓈᐯᒧᐎᓐ','oj','oji',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(120,uuid(),'Old Church Slavonic, Church Slavonic, Old Bulgarian','ѩзыкъ словѣньскъ','cu','chu',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(121,uuid(),'Oromo','Afaan Oromoo','om','orm',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(122,uuid(),'Oriya','ଓଡ଼ିଆ','or','ori',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(123,uuid(),'Ossetian, Ossetic','ирон æвзаг','os','oss',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(124,uuid(),'Panjabi, Punjabi','ਪੰਜਾਬੀ, پنجابی‎','pa','pan',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(125,uuid(),'Pāli','पाऴि','pi','pli',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(126,uuid(),'Persian (Farsi)','فارسی','fa','fas',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(127,uuid(),'Polish','język polski, polszczyzna','pl','pol',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(128,uuid(),'Pashto, Pushto','پښتو','ps','pus',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(129,uuid(),'Portuguese','português','pt','por',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(130,uuid(),'Quechua','Runa Simi, Kichwa','qu','que',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(131,uuid(),'Romansh','rumantsch grischun','rm','roh',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(132,uuid(),'Kirundi','Ikirundi','rn','run',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(133,uuid(),'Romanian','limba română','ro','ron',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(134,uuid(),'Russian','русский язык','ru','rus',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(135,uuid(),'Sanskrit (Saṁskṛta)','संस्कृतम्','sa','san',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(136,uuid(),'Sardinian','sardu','sc','srd',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(137,uuid(),'Sindhi','सिन्धी, سنڌي، سندھی‎','sd','snd',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(138,uuid(),'Northern Sami','Davvisámegiella','se','sme',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(139,uuid(),'Samoan','gagana fa''a Samoa','sm','smo',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(140,uuid(),'Sango','yângâ tî sängö','sg','sag',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(141,uuid(),'Serbian','српски језик','sr','srp',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(142,uuid(),'Scottish Gaelic; Gaelic','Gàidhlig','gd','gla',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(143,uuid(),'Shona','chiShona','sn','sna',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(144,uuid(),'Sinhala, Sinhalese','සිංහල','si','sin',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(145,uuid(),'Slovak','slovenčina, slovenský jazyk','sk','slk',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(146,uuid(),'Slovene','slovenski jezik, slovenščina','sl','slv',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(147,uuid(),'Somali','Soomaaliga, af Soomaali','so','som',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(148,uuid(),'Southern Sotho','Sesotho','st','sot',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(149,uuid(),'South Azerbaijani','تورکجه‎','az','azb',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(150,uuid(),'Spanish','español','es','spa',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(151,uuid(),'Sundanese','Basa Sunda','su','sun',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(152,uuid(),'Swahili','Kiswahili','sw','swa',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(153,uuid(),'Swati','SiSwati','ss','ssw',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(154,uuid(),'Swedish','Svenska','sv','swe',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(155,uuid(),'Tamil','தமிழ்','ta','tam',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(156,uuid(),'Telugu','తెలుగు','te','tel',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(157,uuid(),'Tajik','тоҷикӣ, toğikī, تاجیکی‎','tg','tgk',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(158,uuid(),'Thai','ไทย','th','tha',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(159,uuid(),'Tigrinya','ትግርኛ','ti','tir',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(160,uuid(),'Tibetan Standard, Tibetan, Central','བོད་ཡིག','bo','bod',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(161,uuid(),'Turkmen','Türkmen, Түркмен','tk','tuk',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(162,uuid(),'Tagalog','Wikang Tagalog, Tagalog','Wikang Tagalog','tl',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(163,uuid(),'Tswana','Setswana','tn','tsn',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(164,uuid(),'Tonga (Tonga Islands)','faka Tonga','to','ton',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(165,uuid(),'Turkish','Türkçe','tr','tur',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(166,uuid(),'Tsonga','Xitsonga','ts','tso',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(167,uuid(),'Tatar','татар теле, tatar tele','tt','tat',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(168,uuid(),'Twi','Twi','tw','twi',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(169,uuid(),'Tahitian','Reo Tahiti','ty','tah',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(170,uuid(),'Uyghur, Uighur','Uyƣurqə, ئۇيغۇرچە‎','ug','uig',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(171,uuid(),'Ukrainian','українська мова','uk','ukr',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(172,uuid(),'Urdu','اردو','ur','urd',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(173,uuid(),'Uzbek','O‘zbek, Ўзбек, أۇزبېك‎','uz','uzb',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(174,uuid(),'Venda','Tshivenḓa','ve','ven',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(175,uuid(),'Vietnamese','Tiếng Việt','vi','vie',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(176,uuid(),'Volapük','Volapük','vo','vol',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(177,uuid(),'Walloon','walon','wa','wln',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(178,uuid(),'Welsh','Cymraeg','cy','cym',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(179,uuid(),'Wolof','Wollof','wo','wol',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(180,uuid(),'Western Frisian','Frysk','fy','fry',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(181,uuid(),'Xhosa','isiXhosa','xh','xho',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(182,uuid(),'Yiddish','ייִדיש','yi','yid',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(183,uuid(),'Yoruba','Yorùbá','yo','yor',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(184,uuid(),'Zhuang, Chuang','Saɯ cueŋƅ, Saw cuengh','za','zha',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into cultures (id, uuid, name, display, iso639_1, iso639_2, is_enabled, is_visible, date_added) values(185,uuid(),'Zulu','isiZulu','zu','zul',1,0,UTC_TIMESTAMP())
DELIMITER ;
insert ignore into localized_string_names (id, uuid,name, date_added) values(1, uuid(), 'test', UTC_TIMESTAMP());
DELIMITER ;
insert ignore into localized_string_names (id, uuid,name, date_added) values(2, uuid(), 'email', UTC_TIMESTAMP());

DELIMITER ;
insert ignore into localized_strings (id, uuid,localized_string_name_id, culture_id, value, date_added) values(1, uuid(), 1, 41, 'test', UTC_TIMESTAMP());
DELIMITER ;
insert ignore into localized_strings (id, uuid,localized_string_name_id, culture_id, value, date_added) values(2, uuid(), 1, 41, 'email', UTC_TIMESTAMP());
