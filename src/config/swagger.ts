import path from 'path'

import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition: swaggerJSDoc.SwaggerDefinition = {
  openapi: '3.1.0',
  info: {
    title: 'reserva.bp API',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html'
    }
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT ?? 3000}`,
      description: 'Development server'
    }
  ]
}

const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: [
    path.resolve(__dirname, '../modules/**/*.ts'),
    path.resolve(__dirname, '../modules/**/*.js')
  ]
}

export const swaggerSpec = swaggerJSDoc(options)
