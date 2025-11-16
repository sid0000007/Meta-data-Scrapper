import { NextResponse } from "next/server";

type ScriptStatus = "on" | "off";

// In-memory demo state for script statuses per instance
const scriptStatuses: Record<string, ScriptStatus> = {};

export async function POST(request: Request) {
  try {
    const { instanceId, action, scriptPath } = await request.json();

    if (!instanceId || !action) {
      return NextResponse.json(
        {
          error: "Missing required parameters",
        },
        { status: 400 }
      );
    }

    if (action === "start") {
      scriptStatuses[instanceId] = "on";
    } else if (action === "stop") {
      scriptStatuses[instanceId] = "off";
    } else {
      return NextResponse.json(
        {
          error: "Invalid action. Use 'start' or 'stop'",
        },
        { status: 400 }
      );
    }

    // scriptPath is ignored in demo mode but accepted for compatibility

    return NextResponse.json({
      success: true,
      commandId: "demo-command",
      message: `Script ${action}ed successfully (demo)`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: `Unexpected error: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
