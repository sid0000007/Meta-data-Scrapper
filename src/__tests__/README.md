# Test Suite Documentation

## Overview

This test suite provides comprehensive unit tests for the VM Script Monitor backend API routes. All tests are designed to run **without requiring actual AWS EC2 instances** by using mocked AWS SDK clients.

## Test Structure

```
src/__tests__/
├── api/                          # API route tests
│   ├── ec2-instances.test.ts    # EC2 instance management tests
│   └── scriptRunners.test.ts    # Script execution tests
├── business-logic/               # Business logic validation tests
│   └── validation.test.ts       # Input validation and data transformation tests
├── mocks/                        # Mock implementations
│   └── aws-mocks.ts             # AWS SDK mocks
├── utils/                        # Test utilities
│   └── test-helpers.ts          # Helper functions
└── README.md                     # This file
```

## Running Tests

### Install Dependencies

```bash
npm install
```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Generate Coverage Report

```bash
npm run test:coverage
```

## Test Coverage

### 1. EC2 Instances API Tests (`ec2-instances.test.ts`)

**GET /api/ec2-instances:**

- ✓ Successfully fetch EC2 instances
- ✓ Transform instance data correctly
- ✓ Handle empty instances array
- ✓ Flatten multiple reservations correctly
- ✓ Handle instances with missing data

**POST /api/ec2-instances:**

- ✓ Successfully start an EC2 instance
- ✓ Successfully stop an EC2 instance
- ✓ Return 400 when instanceId is missing
- ✓ Return 400 when action is missing
- ✓ Return 400 for invalid action
- ✓ Return 400 for empty instanceId
- ✓ Handle AWS service errors gracefully

### 2. Script Runners API Tests (`scriptRunners.test.ts`)

**POST /api/scriptRunners:**

- ✓ Successfully start a script on running instance
- ✓ Successfully stop a script on running instance
- ✓ Return 400 when instanceId is missing
- ✓ Return 400 when action is missing
- ✓ Use correct PowerShell commands for start action
- ✓ Use correct PowerShell commands for stop action
- ✓ Reject script action when instance is stopped
- ✓ Reject script action when instance not found
- ✓ Handle SSM command failures gracefully
- ✓ Work without scriptPath parameter
- ✓ Handle multiple sequential script commands
- ✓ Validate action type is start or stop

### 3. Business Logic Validation Tests (`validation.test.ts`)

**Instance ID Validation:**

- ✓ Validate correct EC2 instance ID format
- ✓ Reject invalid instance ID formats

**Action Validation:**

- ✓ Accept valid action types (start/stop)
- ✓ Reject invalid action types

**Command Mapping Validation:**

- ✓ Generate correct start commands
- ✓ Generate correct stop commands
- ✓ Use correct SSM document for Windows

**Instance State Validation:**

- ✓ Accept running state for script execution
- ✓ Reject non-running states for script execution
- ✓ Handle all valid EC2 instance states

**Response Format Validation:**

- ✓ Have correct success response structure
- ✓ Have correct error response structure
- ✓ Have correct script success response structure

**Instance Data Transformation:**

- ✓ Transform AWS instance to API response format
- ✓ Handle missing optional fields gracefully

**Request Parameter Validation:**

- ✓ Require instanceId parameter
- ✓ Require action parameter
- ✓ Validate scriptPath is optional

## Testing Philosophy

### No AWS Required

All tests use mocked AWS SDK clients, so you can run the entire test suite locally without:

- AWS credentials
- Active EC2 instances
- Network connectivity to AWS services

### Mock Strategy

1. **AWS SDK Mocking**: We mock `EC2Client` and `SSMClient` at the module level
2. **Response Mocking**: Predefined mock responses simulate various AWS API responses
3. **Error Simulation**: Mock error responses test error handling paths

### Test Categories

1. **Happy Path Tests**: Verify successful API operations
2. **Validation Tests**: Check input validation and error responses
3. **Edge Case Tests**: Handle missing data, empty arrays, etc.
4. **Error Handling**: Test error scenarios and error responses

## Example Test

```typescript
it("should successfully fetch EC2 instances", async () => {
  const response = await GET();
  const data = await response.json();

  expectSuccessResponse(response);
  expect(data).toHaveProperty("instances");
  expect(Array.isArray(data.instances)).toBe(true);
  expect(data.instances.length).toBeGreaterThan(0);
});
```

## Adding New Tests

When adding new tests:

1. Use the mock data from `aws-mocks.ts`
2. Follow the existing test patterns
3. Use helper functions from `test-helpers.ts`
4. Mock AWS clients appropriately
5. Cover both success and error cases

## Continuous Integration

These tests are designed to run in CI/CD pipelines without requiring AWS infrastructure or credentials. Simply run:

```bash
npm ci
npm test
```

## Test Mock Data

### Sample EC2 Instance Data

```typescript
{
  InstanceId: 'i-1234567890abcdef0',
  InstanceType: 't3.micro',
  State: { Name: 'running' },
  PublicDnsName: 'ec2-123-45-67-89.compute-1.amazonaws.com'
}
```

### Sample SSM Command Response

```typescript
{
  Command: {
    CommandId: 'cmd-1234567890abcdef0',
    InstanceIds: ['i-1234567890abcdef0'],
    Status: 'InProgress'
  }
}
```

## Notes

- Tests use Vitest as the test runner
- All tests are TypeScript files
- Path aliases (`@/`) are configured for imports
- Tests run in Node.js environment (not browser)
