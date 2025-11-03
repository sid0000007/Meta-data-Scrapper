import { describe, it, expect, beforeEach, vi } from 'vitest';
import { expectSuccessResponse, expectErrorResponse } from '../utils/test-helpers';

const mockSend = vi.fn();
const mockEC2ClientInstance = { send: mockSend };

vi.mock('@aws-sdk/client-ec2', () => ({
    EC2Client: vi.fn(() => mockEC2ClientInstance),
    DescribeInstancesCommand: class { },
    StartInstancesCommand: class { },
    StopInstancesCommand: class { },
}));

import { GET, POST } from '@/app/api/ec2-instances/route';
import {
    mockDescribeInstancesResponse,
    mockStartInstancesResponse,
    mockStopInstancesResponse,
    mockErrorResponse,
    createMockRequest,
} from '../mocks/aws-mocks';

describe('EC2 Instances API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockSend.mockImplementation(async (command: any) => {
            if (command.constructor?.name === 'DescribeInstancesCommand') {
                return mockDescribeInstancesResponse;
            }
            if (command.constructor?.name === 'StartInstancesCommand') {
                return mockStartInstancesResponse;
            }
            if (command.constructor?.name === 'StopInstancesCommand') {
                return mockStopInstancesResponse;
            }
            return {};
        });
    });

    describe('GET /api/ec2-instances', () => {
        it('should successfully fetch EC2 instances', async () => {
            const response = await GET();
            const data = await response.json();

            expectSuccessResponse(response);
            expect(data).toHaveProperty('instances');
            expect(Array.isArray(data.instances)).toBe(true);
            expect(data.instances.length).toBeGreaterThan(0);
            expect(data.instances[0]).toHaveProperty('id');
            expect(data.instances[0]).toHaveProperty('type');
            expect(data.instances[0]).toHaveProperty('state');
        });

        it('should transform instance data correctly', async () => {
            const response = await GET();
            const data = await response.json();

            const expectedInstance = mockDescribeInstancesResponse.Reservations[0].Instances[0];
            const actualInstance = data.instances.find(
                (inst: any) => inst.id === expectedInstance.InstanceId
            );

            expect(actualInstance).toBeDefined();
            expect(actualInstance.id).toBe(expectedInstance.InstanceId);
            expect(actualInstance.type).toBe(expectedInstance.InstanceType);
            expect(actualInstance.state).toBe(expectedInstance.State.Name);
            expect(actualInstance.publicDns).toBe(expectedInstance.PublicDnsName);
        });

        it('should handle empty instances array', async () => {
            const emptyResponse = { Reservations: [] };
            mockSend.mockResolvedValueOnce(emptyResponse);

            const response = await GET();
            const data = await response.json();

            expectSuccessResponse(response);
            expect(data.instances).toEqual([]);
        });

        it('should flatten multiple reservations correctly', async () => {
            const response = await GET();
            const data = await response.json();

            expect(data.instances.length).toBe(3);
        });

        it('should handle instances with missing data', async () => {
            const partialResponse = {
                Reservations: [
                    {
                        Instances: [
                            {
                                InstanceId: 'i-partial',
                            },
                        ],
                    },
                ],
            };
            mockSend.mockResolvedValueOnce(partialResponse);

            const response = await GET();
            const data = await response.json();

            expectSuccessResponse(response);
            expect(data.instances[0].id).toBe('i-partial');
            expect(data.instances[0].type).toBe('');
            expect(data.instances[0].state).toBe('');
            expect(data.instances[0].publicDns).toBe('');
        });
    });

    describe('POST /api/ec2-instances', () => {
        it('should successfully start an EC2 instance', async () => {
            const mockRequest = createMockRequest({
                instanceId: 'i-1234567890abcdef0',
                action: 'start',
            }) as Request;

            const response = await POST(mockRequest);
            const data = await response.json();

            expectSuccessResponse(response);
            expect(data.success).toBe(true);
            expect(data.message).toContain('start');
        });

        it('should successfully stop an EC2 instance', async () => {
            const mockRequest = createMockRequest({
                instanceId: 'i-1234567890abcdef0',
                action: 'stop',
            }) as Request;

            const response = await POST(mockRequest);
            const data = await response.json();

            expectSuccessResponse(response);
            expect(data.success).toBe(true);
            expect(data.message).toContain('stop');
        });

        it('should return 400 when instanceId is missing', async () => {
            const mockRequest = createMockRequest({
                action: 'start',
            }) as Request;

            const response = await POST(mockRequest);
            const data = await response.json();

            expectErrorResponse(response, 400);
            expect(data.error).toContain('required');
        });

        it('should return 400 when action is missing', async () => {
            const mockRequest = createMockRequest({
                instanceId: 'i-1234567890abcdef0',
            }) as Request;

            const response = await POST(mockRequest);
            const data = await response.json();

            expectErrorResponse(response, 400);
            expect(data.error).toContain('required');
        });

        it('should return 400 for invalid action', async () => {
            const mockRequest = createMockRequest({
                instanceId: 'i-1234567890abcdef0',
                action: 'restart',
            }) as Request;

            const response = await POST(mockRequest);
            const data = await response.json();

            expectErrorResponse(response, 400);
            expect(data.error).toContain('Invalid action');
        });

        it('should return 400 for empty instanceId', async () => {
            const mockRequest = createMockRequest({
                instanceId: '',
                action: 'start',
            }) as Request;

            const response = await POST(mockRequest);
            const data = await response.json();

            expectErrorResponse(response, 400);
        });

        it('should handle AWS service errors gracefully', async () => {
            mockSend.mockRejectedValueOnce(mockErrorResponse);

            const mockRequest = createMockRequest({
                instanceId: 'i-1234567890abcdef0',
                action: 'start',
            }) as Request;

            const response = await POST(mockRequest);
            const data = await response.json();

            expectErrorResponse(response, 500);
            expect(data).toHaveProperty('error');
        });
    });
});

