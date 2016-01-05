create table if not exists migrations
(
	id int unsigned not null auto_increment primary key,
	uuid binary(16) not null,

	action varchar(32) not null,
	number int not null,
	is_success bool not null,
	error_message varchar(1024) not null default N'',

	date_added datetime not null,
	last_modified timestamp not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE={{engine}}
DELIMITER ;

call createindex('{{database}}','migrations','migrations_uuid_unique_index','uuid', 1)

DELIMITER ;
create table if not exists shards
(
	id int unsigned not null auto_increment primary key,
	uuid binary(16) not null,

	shard_key varchar(128) not null,
	start bigint unsigned not null,
	end bigint unsigned not null,
	connection varchar(1024) not null,
	is_active bool not null default 0,
	is_down bool not null default 0,
	is_new_supported bool not null default 0,

	date_added datetime not null,
	last_modified timestamp not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE={{engine}}
DELIMITER ;

call createindex('{{database}}','shards','shards_uuid_unique_index','uuid', 1)
DELIMITER ;
call createindex('{{database}}','shards','shards_shard_key_start_index','shard_key,start', 1)
