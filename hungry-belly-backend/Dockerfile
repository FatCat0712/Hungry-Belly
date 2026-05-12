FROM maven:3.9.11-eclipse-temurin-21 AS builder
WORKDIR /app

# Copy Maven wrapper and project metadata first to maximize Docker layer cache hits.
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -q -DskipTests dependency:go-offline

COPY src ./src
RUN ./mvnw -q -DskipTests clean package

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Run as non-root for better container security.
RUN addgroup --system spring && adduser --system --ingroup spring spring
COPY --from=builder /app/target/hungry-belly-backend-0.0.1-SNAPSHOT.jar app.jar

USER spring:spring
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

