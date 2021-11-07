# Recent Tabs direct access.

A handy extension that simply makes the recently closed tabs more accessible.

---

To build this project one needs the following:
* NodeJS 16 or later
* npm package manager (usually included with NodeJS)


These are the steps necessary to build the project:
```
npm install
npm run build
```


Or you can use the handy dandy Makefile with GNU Make, simply run the following command
```
make build
```

To create a zip file ready for upload to Firefox/Chrome add-on stores use:
```
zip artifacts/recentabs-unknown.zip -r manifest.json dist/ icons/
# OR
make artifact
```
The result should be in `artifacts/recentabs-unknown.zip`


The result will be emitted into the `dist/` folder.
