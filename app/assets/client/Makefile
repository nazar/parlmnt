compile: build

build: templates
	./node_modules/.bin/r.js -o ./app.build.js

templates:
	./node_modules/.bin/dusty --out build/templates.js widgets


test:
	./node_modules/.bin/mocha --require chai --reporter spec --ui bdd


.PHONY: compile
