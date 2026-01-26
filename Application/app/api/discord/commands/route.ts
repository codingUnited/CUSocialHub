import { NextResponse } from "next/server";
const allowed = ["create", "update", "delete"];

export const POST = (req, { params }) => {
  const { operations } = params;
  if (!allowed.includes(operations)) {
    return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
  }
  switch (operations) {
    case "create":
      // Handle create operation
      return NextResponse.json(
        { message: "Create operation successful" },
        { status: 200 }
      );
    case "update":
      // Handle update operation
      return NextResponse.json(
        { message: "Update operation successful" },
        { status: 200 }
      );
    case "delete":
      // Handle delete operation
      return NextResponse.json(
        { message: "Delete operation successful" },
        { status: 200 }
      );
    default:
      return NextResponse.json(
        { error: "Unhandled operation" },
        { status: 400 }
      );
  }
};
