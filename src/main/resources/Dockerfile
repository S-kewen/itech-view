FROM java:8

MAINTAINER skwen<sgh@iskwen.com>

COPY *.jar /app.jar

CMD ["--server.port=443"]
EXPOSE 443

ENTRYPOINT ["java","-jar","/app.jar"]