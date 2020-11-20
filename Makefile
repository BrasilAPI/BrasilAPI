APP:= brasil-api
TAG:= 1.0.0

# DEV
docker-build-local:
	docker build -q -t ${APP}:${TAG}-local .

docker-run-local:
	docker run --entrypoint=ash -e ENV NODE_ENV='development' -p 3000:3000 ${APP}:${TAG}-local -c 'npm run dev'

local: docker-build-local docker-run-local

# PRD
docker-build:
	docker build -q -t ${APP}:${TAG} .

docker-run:
	docker run -p 3000:3000 ${APP}:${TAG}

docker: docker-build docker-run