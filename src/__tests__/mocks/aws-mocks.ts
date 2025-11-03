import { EC2Client, DescribeInstancesCommand, StartInstancesCommand, StopInstancesCommand } from '@aws-sdk/client-ec2';
import { SSMClient, SendCommandCommand } from '@aws-sdk/client-ssm';

export const mockEC2Client = {
    send: () => Promise.resolve({}),
};

export const mockSSMClient = {
    send: () => Promise.resolve({}),
};

export const mockDescribeInstancesResponse = {
    Reservations: [
        {
            Instances: [
                {
                    InstanceId: 'i-1234567890abcdef0',
                    InstanceType: 't3.micro',
                    State: { Name: 'running' },
                    PublicDnsName: 'ec2-123-45-67-89.compute-1.amazonaws.com',
                },
                {
                    InstanceId: 'i-0987654321fedcba0',
                    InstanceType: 't3.small',
                    State: { Name: 'stopped' },
                    PublicDnsName: '',
                },
            ],
        },
        {
            Instances: [
                {
                    InstanceId: 'i-abcd1234efgh5678',
                    InstanceType: 't2.medium',
                    State: { Name: 'running' },
                    PublicDnsName: 'ec2-98-76-54-32.compute-1.amazonaws.com',
                },
            ],
        },
    ],
};

export const mockStartInstancesResponse = {
    StartingInstances: [
        {
            InstanceId: 'i-1234567890abcdef0',
            PreviousState: { Name: 'stopped' },
            CurrentState: { Name: 'pending' },
        },
    ],
};

export const mockStopInstancesResponse = {
    StoppingInstances: [
        {
            InstanceId: 'i-1234567890abcdef0',
            PreviousState: { Name: 'running' },
            CurrentState: { Name: 'stopping' },
        },
    ],
};

export const mockSendCommandResponse = {
    Command: {
        CommandId: 'cmd-1234567890abcdef0',
        InstanceIds: ['i-1234567890abcdef0'],
        Status: 'InProgress',
    },
};

export const mockErrorResponse = {
    name: 'ServiceException',
    message: 'Mock AWS Error',
    code: 'ServiceException',
};

export const createMockRequest = (body: any): Partial<Request> => ({
    json: async () => body,
    clone: () => ({
        text: async () => JSON.stringify(body),
    }) as any,
    headers: new Headers(),
});

