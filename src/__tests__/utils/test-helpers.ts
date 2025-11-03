import { describe, expect, it, beforeEach, vi } from 'vitest';
import { NextResponse } from 'next/server';

export const expectSuccessResponse = (response: NextResponse, statusCode = 200) => {
    expect(response.status).toBe(statusCode);
    expect(response.headers.get('content-type')).toContain('application/json');
};

export const expectErrorResponse = (response: NextResponse, statusCode = 500) => {
    expect(response.status).toBe(statusCode);
    expect(response.headers.get('content-type')).toContain('application/json');
};

export const createMockInstance = (overrides = {}) => ({
    id: 'i-1234567890abcdef0',
    type: 't3.micro',
    state: 'running',
    publicDns: 'ec2-123-45-67-89.compute-1.amazonaws.com',
    ...overrides,
});

export const setupTestEnv = () => {
    process.env.AWS_REGION = 'us-east-1';
    process.env.AWS_ACCESS_KEY_ID = 'test-access-key';
    process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key';
    process.env.NEXT_PUBLIC_AWS_REGION = 'us-east-1';
    process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID = 'test-access-key';
    process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY = 'test-secret-key';
};

export const cleanupTestEnv = () => {
    delete process.env.AWS_REGION;
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;
    delete process.env.NEXT_PUBLIC_AWS_REGION;
    delete process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
    delete process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
};

