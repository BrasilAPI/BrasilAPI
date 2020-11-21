tests: nocache
	docker-compose -f docker-compose.test.yml up
	# docker run -p 3000:3000 brasilapi/brasilapi npm run test

run: nocache
	docker run -p 3000:3000 brasilapi/brasilapi

dev: nocache
	docker-compose up

docker: nocache
	make build
	make push

build: nocache
	docker build -t brasilapi/brasilapi . 

push: nocache
	docker push brasilapi/brasilapi

nocache:
