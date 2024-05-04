# Frontend web server
Provides a docker build script and a npm script


### Node
Just install the dependencies for express with `npm install` and you can then run with `npm start`!

### Docker
If you really want to use docker, I recommend the docker compose file. 
This is pretty much the only command you'll need:
```sh
docker compose up --build --force-recreate --no-deps web
```
This will start up the image and link port 3000 so that you can use it.
