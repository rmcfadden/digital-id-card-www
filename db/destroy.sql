drop procedure if exists {{database}}.CreateIndex

DELIMITER ;

drop table if exists {{database}}.migrations

DELIMITER ;

drop table if exists {{database}}.shards

DELIMITER ;

drop database if exists  {{database}};
