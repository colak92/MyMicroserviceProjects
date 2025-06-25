FROM openjdk:17-jdk-alpine

RUN apk add --no-cache curl netcat-openbsd

WORKDIR /app

COPY user-service/target/*.jar app.jar
COPY ../entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 9001

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:9001/actuator/health || exit 1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]