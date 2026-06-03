import express, { Request, Response } from 'express'
import { initializeController } from './infraestructura/controllers/index'
import { ExceptionHandler } from './infraestructura/middlewares/ExceptionHandler'
import methodOverride from 'method-override'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './infraestructura/swagger/swagger.config'

const app = express()

app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 

app.use(methodOverride())

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { 
  swaggerOptions: {
    persistAuthorization: true,
  }
}))

// Descargar especificación OpenAPI en JSON
app.get('/api-docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Content-Disposition', 'attachment; filename="api-docs.json"')
  res.send(swaggerSpec)
})

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
})

initializeController(app);

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000')
  console.log('Documentacion en http://localhost:3000/api-docs')
})