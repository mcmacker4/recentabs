

artifact_files = manifest.json dist/ icons/

VERSION ?= unknown

build: clean install
	npm run build

artifact: build
	mkdir -p ./artifacts
	zip artifacts/recentabs-$(VERSION).zip -r $(artifact_files)
	
install:
	npm install

watch: install
	npm run watch

clean:
	rm -rf dist/ artifacts/
