FROM openjdk:17-jdk-alpine

RUN apk add --no-cache curl netcat-openbsd

WORKDIR /app

COPY gateway-server/target/*.jar app.jar
COPY ../entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 9000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:9000/actuator/health || exit 1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]