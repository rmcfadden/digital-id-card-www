REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --recursive  --reporter $(REPORTER)


migrate:
	./db/dbutil migrate 
	./db/dbutil migrate --database  digital_id

setup:
	./db/dbutil setup 
	./db/dbutil setup --database digital_id

dev-recreate:
	./db/dev_db_recreate
start:
	supervisor app.js &

.PHONY: test migrate setup rollback start dev-recreate
