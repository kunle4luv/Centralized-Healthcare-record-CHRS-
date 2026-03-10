const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Centralized Healthcare Record System (CHRS) API',
      version: '1.0.0',
      description: 'API for managing healthcare records, patients, and notifications',
      contact: {
        name: 'API Support',
        email: 'support@chrs.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['patient', 'provider', 'admin'] },
            name: { type: 'string' },
            identifier: { type: 'string' }
          }
        },
        Patient: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nin: { type: 'string' },
            phoneNumber: { type: 'string' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            dateOfBirth: { type: 'string' },
            bloodType: { type: 'string' },
            allergies: { type: 'array', items: { type: 'string' } },
            recentVisits: { type: 'array', items: { $ref: '#/components/schemas/Visit' } }
          }
        },
        Visit: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            date: { type: 'string' },
            hospital: { type: 'string' },
            doctor: { type: 'string' },
            diagnosis: { type: 'string' },
            status: { type: 'string' },
            recordType: { type: 'string', enum: ['diagnosis', 'lab', 'prescription', 'imaging', 'procedure'] },
            notes: { type: 'string' },
            vitals: {
              type: 'object',
              properties: {
                bloodPressure: { type: 'string' },
                temperature: { type: 'number' },
                heartRate: { type: 'number' },
                weight: { type: 'number' }
              }
            },
            labResults: { type: 'object' },
            prescriptions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  drug: { type: 'string' },
                  dosage: { type: 'string' }
                }
              }
            },
            imagingFindings: { type: 'string' }
          }
        },
        Notification: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            message: { type: 'string' },
            time: { type: 'string' },
            read: { type: 'boolean' }
          }
        },
        LoginRequest: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
            role: { type: 'string', enum: ['patient', 'provider', 'admin'] },
            name: { type: 'string' },
            identifier: { type: 'string' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'role', 'name'],
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
            role: { type: 'string', enum: ['patient', 'provider', 'admin'] },
            name: { type: 'string' },
            identifier: { type: 'string' },
            phoneNumber: { type: 'string' },
            nin: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
