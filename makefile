REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --recursive  --reporter $(REPORTER)


migrate:
	./db/dbutil migrate 
	./db/dbutil migrate --database  nettools_test

setup:
	./db/dbutil setup 
	./db/dbutil setup --database nettools_test

dev-recreate:
	./db/dev_db_recreate
start:
	supervisor app.js &

.PHONY: test migrate setup rollback start dev-recreate
