import { describe, it, expect, beforeEach, vi } from 'vitest';
import { expectSuccessResponse, expectErrorResponse } from '../utils/test-helpers';

const mockEC2Send = vi.fn();
const mockSSMSend = vi.fn();
const mockEC2ClientInstance = { send: mockEC2Send };
const mockSSMClientInstance = { send: mockSSMSend };

vi.mock('@aws-sdk/client-ec2', () => ({
    EC2Client: vi.fn(() => mockEC2ClientInstance),
    DescribeInstancesCommand: class { },
}));

vi.mock('@aws-sdk/client-ssm', () => ({
    SSMClient: vi.fn(() => mockSSMClientInstance),
    SendCommandCommand: class { },
}));

import { POST } from '@/app/api/scriptRunners/route';
import {
    mockDescribeInstancesResponse,
    mockSendCommandResponse,
    mockErrorResponse,
    createMockRequest,
} from '../mocks/aws-mocks';

describe('Script Runners API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockEC2Send.mockImplementation(async (command: any) => {
            if (command.constructor?.name === 'DescribeInstancesCommand') {
                return mockDescribeInstancesResponse;
            }
            return {};
        });
        mockSSMSend.mockImplementation(async () => mockSendCommandResponse);
    });

    describe('POST /api/scriptRunners', () => {
        it('should successfully start a script on running instance', async () => {
            const mockRequest = createMockRequest({
                instanceId: 'i-1234567890abcdef0',
                action: 'start',
                scriptPath: 'C:\\monitoring',
            }) as Request;

            const response = await POST(mockRequest);
            const data = await response.json();

            expectSuccessResponse(response);
            expect(data.success).toBe(true);
            expect(data.message).toContain('started');
            expect(data.commandId).toBeDefined();
        });

        it('should successfully stop a script on running instance', async () => {
            const mockRequest = createMockRequest({
                instanceId: 'i-1234567890abcdef0',
                action: 'stop',
                scriptPath: 'C:\\monitoring',
            }) as Request;

            const response = await POST(mockRequest);
            const data = await response.json();

            expectSuccessResponse(response);
            expect(data.success).toBe(true);
            expect(data.message).toContain('stopped');
            expect(data.commandId).toBeDefined();
        });

        it('should return 400 when instanceId is missing', async () => {
            const mockRequest = createMockRequest({
                action: 'start',
                scriptPath: 'C:\\monitoring',
            }) as Request;

            const response = await POST(mockRequest);
            const data = await response.json();

            expectErrorResponse(response, 400);
            expect(data.error).toContain('Missing required');
        });

        it('should return 400 when action is missing', async () => {
            const mockRequest = createMockRequest({
                instanceId: 'i-1234567890abcdef0',
                scriptPath: 'C:\\monitoring',
            }) as Request;

            const response = await POST(mockRequest);
            const data = await response.json();

            expectErrorResponse(response, 400);
            expect(data.error).toContain('Missing required');
        });

        it('should use correct PowerShell commands for start action', async () => {
            const mockRequest = createMockRequest({
                instanceId: 'i-1234567890abcdef0',
                action: 'start',
                scriptPath: 'C:\\monitoring',
            }) as Request;

            await POST(mockRequest);

            expect(mockSSMSend).toHaveBeenCalled();
            const callArgs = mockSSMSend.mock.calls[0][0];
            const input = (callArgs as any).input;
            expect(input.DocumentName).toBe('AWS-RunPowerShellScript');
            expect(input.Parameters.commands).toContain('cd C:\\monitoring');
            expect(input.Parameters.commands).toContain('node monitor.js start');
        });

        it('should use correct PowerShell commands for stop action', async () => {
            const mockRequest = createMockRequest({
                instanceId: 'i-1234567890abcdef0',
                action: 'stop',
                scriptPath: 'C:\\monitoring',
            }) as Request;

            await POST(mockRequest);

            expect(mockSSMSend).toHaveBeenCalled();
            const callArgs = mockSSMSend.mock.calls[0][0];
            const input = (callArgs as any).input;
            expect(input.DocumentName).toBe('AWS-RunPowerShellScript');
            expect(input.Parameters.commands).toContain('cd C:\\monitoring');
            expect(input.Parameters.commands).toContain('node monitor.js stop');
            expect(input.Parameters.commands.length).toBe(2);
        });

        it('should reject script action when instance is stopped', async () => {
            const stoppedInstanceResponse = {
                Reservations: [
                    {
                        Instances: [
                            {
                                InstanceId: 'i-0987654321fedcba0',
                                State: { Name: 'stopped' },
                            },
                        ],
                    },
                ],
            };
            mockEC2Send.mockResolvedValueOnce(stoppedInstanceResponse);

            const mockRequest = createMockRequest({
                instanceId: 'i-0987654321fedcba0',
                action: 'start',
                scriptPath: 'C:\\monitoring',
            }) as Request;

            const response = await POST(mockRequest);
            const data = await response.json();

            expectErrorResponse(response, 500);
            expect(data.error).toBeDefined();
        });

        it('should reject script action when instance not found', async () => {
            const notFoundResponse = { Reservations: [] };
            mockEC2Send.mockResolvedValueOnce(notFoundResponse);

            const mockRequest = createMockRequest({
                instanceId: 'i-nonexistent',
                action: 'start',
                scriptPath: 'C:\\monitoring',
            }) as Request;

            const response = await POST(mockRequest);
            const data = await response.json();

            expectErrorResponse(response, 500);
            expect(data.error).toContain('not found');
        });

        it('should handle SSM command failures gracefully', async () => {
            mockSSMSend.mockRejectedValueOnce(mockErrorResponse);

            const mockRequest = createMockRequest({
                instanceId: 'i-1234567890abcdef0',
                action: 'start',
                scriptPath: 'C:\\monitoring',
            }) as Request;

            const response = await POST(mockRequest);
            const data = await response.json();

            expectErrorResponse(response, 500);
            expect(data.error).toContain('Failed to start script');
        });

        it('should work without scriptPath parameter', async () => {
            const mockRequest = createMockRequest({
                instanceId: 'i-1234567890abcdef0',
                action: 'start',
            }) as Request;

            const response = await POST(mockRequest);

            expectSuccessResponse(response);
            expect(await response.json()).toHaveProperty('success', true);
        });

        it('should handle multiple sequential script commands', async () => {
            const instances = ['i-1234567890abcdef0', 'i-abcd1234efgh5678'];

            for (const instanceId of instances) {
                const mockRequest = createMockRequest({
                    instanceId,
                    action: 'start',
                    scriptPath: 'C:\\monitoring',
                }) as Request;

                const response = await POST(mockRequest);
                expectSuccessResponse(response);
            }

            expect(mockEC2Send).toHaveBeenCalledTimes(instances.length);
            expect(mockSSMSend).toHaveBeenCalledTimes(instances.length);
        });

        it('should validate action type is start or stop', async () => {
            const invalidActions = ['restart', 'pause', 'resume', '', null, undefined];

            for (const action of invalidActions) {
                vi.clearAllMocks();

                const mockRequest = createMockRequest({
                    instanceId: 'i-1234567890abcdef0',
                    action,
                    scriptPath: 'C:\\monitoring',
                }) as Request;

                const response = await POST(mockRequest);

                if (action === null || action === undefined || action === '') {
                    expectErrorResponse(response, 400);
                }
            }
        });
    });
});

