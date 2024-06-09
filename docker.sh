docker build  -f ./Dockerfile . -t developerfauzan/aroundme:latest
docker push developerfauzan/aroundme:latest
docker compose up -d