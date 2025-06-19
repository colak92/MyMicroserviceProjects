# Use a base Java image
FROM openjdk:17-jdk-alpine

# Set working directory in container
WORKDIR /app

# Copy the built JAR file into the image
COPY eureka-server/target/*.jar app.jar

# Expose the app's port (match the server.port in application.properties)
EXPOSE 8070

# Command to run the app
ENTRYPOINT ["java", "-Xms128m", "-Xmx256m", "-jar", "app.jar"]