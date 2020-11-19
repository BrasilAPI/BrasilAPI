APP:= brasil-api
TAG:= 1.0.0

docker-build:
	docker build -t ${APP}:${TAG} .

docker: docker-build
