const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

//Info sobre la api
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API - Estrategias de Persistencia - UNAHUR",
      version: "1.0.0"
    },
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'token',
        scheme: 'token',
        in: 'token',
      },
    },
  },
  apis: ["./routes/*.js", "./models/*.js"],
};

//Documentación en formato JSON
const swaggerSpec = swaggerJSDoc(options);

//Setup para documentación
const swaggerDocs = (app, port) => {
  //Ruteo a los docs
  app.use("/apidocs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  //Para documentación disponible en formato JSON
  app.get("/apidocs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  console.log(`API corriendo en puerto ${port}...`);
  console.log(`Documentación disponible en http://localhost:${port}/apidocs`);
};

module.exports = { swaggerDocs };
