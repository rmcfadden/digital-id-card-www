create database if not exists {{database}} character set 'utf8'

DELIMITER ;

grant all on `{{database}}`.* to `{{user}}`@`localhost` identified by '{{password}}'

DELIMITER ;

GRANT SELECT ON {{database}}. * TO '{{user}}'@'localhost';
DELIMITER ;
GRANT CREATE ON {{database}}. * TO '{{user}}'@'localhost';
DELIMITER ;
GRANT UPDATE ON {{database}}. * TO '{{user}}'@'localhost';
DELIMITER ;
GRANT DELETE ON {{database}}. * TO '{{user}}'@'localhost';
DELIMITER ;
FLUSH PRIVILEGES;
DELIMITER ;

DROP PROCEDURE IF EXISTS {{database}}.CreateIndex

DELIMITER ;

CREATE PROCEDURE {{database}}.CreateIndex
(
    given_database VARCHAR(64),
    given_table    VARCHAR(64),
    given_index    VARCHAR(64),
    given_columns  VARCHAR(64),
    is_unique bool
)
BEGIN

    DECLARE IndexIsThere INTEGER;

	declare UniqueText varchar(10);
	set UniqueText = '';


    SELECT COUNT(1) INTO IndexIsThere
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE table_schema = given_database
    AND   table_name   = given_table
    AND   index_name   = given_index;

    IF IndexIsThere = 0 THEN
	
	IF is_unique = 1 Then
		set UniqueText = 'unique';
	end if;


        SET @sqlstmt = CONCAT('create ', UniqueText, ' index ' ,given_index,' on ',
        given_database,'.',given_table,' (',given_columns,')');
        PREPARE st FROM @sqlstmt;
        EXECUTE st;
        DEALLOCATE PREPARE st;
    ELSE
        SELECT CONCAT('Index ',given_index,' already exists on Table ',
        given_database,'.',given_table) CreateindexErrorMessage;   
    END IF;

END

DELIMITER ;

