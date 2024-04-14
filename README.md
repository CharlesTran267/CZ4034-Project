CZ4034-Information Retrieval group project


# Setting up the application

## Front-end
- Follow this [guide](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) to install Node.js (>=v.16.4)
- Install the dependencies

```shell
pnpm install
```

- Change directory to `web/cz4034` and run

```shell
cd web/cz4034
pnpm run dev
```

## Back-end

- Change directory to `backend` and create a new virtual environment

```shell
python -m venv .venv
```

- Activate the virtual environment

```shell
source .venv/bin/activate
```

- Install dependencies

```shell
pip install flask flask-cors
```

- Change directory to `src` and run the flask server

```shell
flask run --debug --port=5001
```

## Solr server

- Build the docker image from the top directory

```shell
docker build -t solr_image -f solr/Dockerfile .
```

- Run the docker container 

```shell
docker run -d --name solr_container -p 8983:8983 solr_image
```

- Execute the `solr/entrypoint.sh` inside the container to create a new core and post the data

```shell
docker exec solr_container /entrypoint.sh
```
