import { NextResponse } from "next/server";

type MockInstanceState = "running" | "stopped" | "pending" | "stopping";

interface MockEC2Instance {
  id: string;
  type: string;
  state: MockInstanceState;
  publicDns: string;
  os: string;
}

// In-memory demo data for EC2 instances
let mockInstances: MockEC2Instance[] = [
  {
    id: "i-0123demo1",
    type: "t3.micro",
    state: "running",
    publicDns: "ec2-3-120-45-10.compute-1.amazonaws.com",
    os: "Windows 11",
  },
  {
    id: "i-0456demo2",
    type: "t3.medium",
    state: "stopped",
    publicDns: "ec2-18-204-11-22.compute-1.amazonaws.com",
    os: "Windows 8",
  },
  {
    id: "i-0789demo3",
    type: "t3.large",
    state: "running",
    publicDns: "ec2-54-91-32-98.compute-1.amazonaws.com",
    os: "macOS 14",
  },
  {
    id: "i-1011demo4",
    type: "t3.small",
    state: "running",
    publicDns: "ec2-35-174-210-5.compute-1.amazonaws.com",
    os: "Ubuntu 22.04",
  },
  {
    id: "i-1213demo5",
    type: "t3.medium",
    state: "stopped",
    publicDns: "ec2-44-201-77-89.compute-1.amazonaws.com",
    os: "Linux (Amazon Linux 2)",
  },
  {
    id: "i-1415demo6",
    type: "t3.large",
    state: "pending",
    publicDns: "ec2-52-70-143-200.compute-1.amazonaws.com",
    os: "Windows 11",
  },
  {
    id: "i-1617demo7",
    type: "t3.micro",
    state: "stopping",
    publicDns: "ec2-3-91-204-33.compute-1.amazonaws.com",
    os: "Ubuntu 20.04",
  },
];

export async function GET() {
  return NextResponse.json({ instances: mockInstances });
}

export async function POST(request: Request) {
  const { instanceId, action } = await request.json();

  if (!instanceId || !action) {
    return NextResponse.json(
      { error: "Instance ID and action are required" },
      { status: 400 }
    );
  }

  const instance = mockInstances.find((i) => i.id === instanceId);

  if (!instance) {
    return NextResponse.json(
      { error: "Instance not found in demo data" },
      { status: 404 }
    );
  }

  if (action === "start") {
    instance.state = "running";
  } else if (action === "stop") {
    instance.state = "stopped";
  } else {
    return NextResponse.json(
      { error: "Invalid action. Use 'start' or 'stop'" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Instance ${action}ed (demo)`,
  });
}
