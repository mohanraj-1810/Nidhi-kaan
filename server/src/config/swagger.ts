import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nidhi Kaan API',
      version: '1.0.0',
      description: 'Backend API for Nidhi Kaan compliance verification system',
      contact: {
        name: 'Nidhi Kaan Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001/api/v1',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        CaseCreate: {
          type: 'object',
          required: ['project_type', 'beneficiary_contractor_id', 'claimed_stage', 'latitude', 'longitude'],
          properties: {
            project_type: {
              type: 'string',
              enum: ['Housing', 'Road', 'Bus Stand'],
              description: 'Type of project',
            },
            beneficiary_contractor_id: {
              type: 'string',
              description: 'Beneficiary or contractor identifier',
            },
            claimed_stage: {
              type: 'string',
              description: 'Current construction stage claimed',
            },
            latitude: {
              type: 'number',
              format: 'double',
              minimum: -90,
              maximum: 90,
              description: 'Latitude coordinate',
            },
            longitude: {
              type: 'number',
              format: 'double',
              minimum: -180,
              maximum: 180,
              description: 'Longitude coordinate',
            },
            invoice_number: {
              type: 'string',
              description: 'Invoice number for GST verification',
            },
          },
        },
        CaseResponse: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            project_type: { type: 'string', enum: ['Housing', 'Road', 'Bus Stand'] },
            beneficiary_contractor_id: { type: 'string' },
            claimed_stage: { type: 'string' },
            latitude: { type: 'number', nullable: true },
            longitude: { type: 'number', nullable: true },
            authenticity_status: { type: 'string', enum: ['PENDING', 'PASSED', 'FAILED'] },
            progress_status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] },
            invoice_number: { type: 'string', nullable: true },
            gst_status: { type: 'string', enum: ['PENDING', 'VALID', 'FRAUD_FLAGGED'] },
            escalation_level: { type: 'string', enum: ['LOCAL_STAFF', 'DISTRICT', 'STATE', 'CM_DASHBOARD'] },
            sla_timer_hours: { type: 'integer' },
            is_escalated: { type: 'boolean' },
            rejection_reason: { type: 'string', nullable: true },
            created_at: { type: 'string' },
            updated_at: { type: 'string' },
          },
        },
        VerifyGSTResponse: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            invoice_number: { type: 'string', nullable: true },
            gst_status: { type: 'string', enum: ['PENDING', 'VALID', 'FRAUD_FLAGGED'] },
            message: { type: 'string' },
          },
        },
        FastForwardRequest: {
          type: 'object',
          properties: {
            rejection_reason: { type: 'string' },
          },
        },
        FastForwardResponse: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            previous_escalation_level: { type: 'string', enum: ['LOCAL_STAFF', 'DISTRICT', 'STATE', 'CM_DASHBOARD'] },
            new_escalation_level: { type: 'string', enum: ['LOCAL_STAFF', 'DISTRICT', 'STATE', 'CM_DASHBOARD'] },
            is_escalated: { type: 'boolean' },
            updated_at: { type: 'string' },
          },
        },
        DashboardStatsResponse: {
          type: 'object',
          properties: {
            total_cases: { type: 'integer' },
            pending_inspections: { type: 'integer' },
            fraud_flagged_count: { type: 'integer' },
            escalated_count: { type: 'integer' },
            cases_by_escalation_level: {
              type: 'object',
              properties: {
                LOCAL_STAFF: { type: 'integer' },
                DISTRICT: { type: 'integer' },
                STATE: { type: 'integer' },
                CM_DASHBOARD: { type: 'integer' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            errors: {
              type: 'object',
              additionalProperties: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    paths: {
      '/cases/submit': {
        post: {
          tags: ['Cases'],
          summary: 'Submit a new case',
          description: 'Create a new case with mock System 1 (location) and System 2 (stage) verification',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CaseCreate' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Case created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CaseResponse' },
                },
              },
            },
            '400': {
              description: 'Validation error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ValidationError' },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/cases/{id}/verify-gst': {
        post: {
          tags: ['Cases'],
          summary: 'Verify GST/invoice for a case',
          description: 'Check if invoice contains "FAKE" to flag fraud',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' },
              description: 'Case ID',
            },
          ],
          responses: {
            '200': {
              description: 'GST verification result',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/VerifyGSTResponse' },
                },
              },
            },
            '404': {
              description: 'Case not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/cases/{id}/fast-forward': {
        post: {
          tags: ['Cases'],
          summary: 'Escalate case to next authority level',
          description: 'Increment escalation level: LOCAL_STAFF → DISTRICT → STATE → CM_DASHBOARD',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' },
              description: 'Case ID',
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/FastForwardRequest' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Case escalated successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/FastForwardResponse' },
                },
              },
            },
            '400': {
              description: 'Validation error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ValidationError' },
                },
              },
            },
            '404': {
              description: 'Case not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/dashboard/stats': {
        get: {
          tags: ['Dashboard'],
          summary: 'Get dashboard statistics',
          description: 'Returns counts of cases by status and escalation level',
          responses: {
            '200': {
              description: 'Dashboard statistics',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/DashboardStatsResponse' },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check endpoint',
          responses: {
            '200': {
              description: 'Service is healthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'ok' },
                      timestamp: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };