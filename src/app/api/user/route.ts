import connection from "../mysql"
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email")
    const password = searchParams.get("password")
    const connectionInstance = await connection;
    const [rows] : any[] = await connectionInstance.query("SELECT * FROM user WHERE email = ? AND password = ?", [email, password]);
    if (rows[0]) {
      return NextResponse.json({message: rows[0]});
    }
    return NextResponse.json({ error: "Email or password does not match"});

  } catch (error:any) {
    return NextResponse.json({ message: error.message }, {status: 500,});
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();
    const connectionInstance = await connection;
    const [rows] : any[] = await connectionInstance.query("SELECT * FROM user WHERE email = ?", [email]);
    if (rows[0]) {
      return NextResponse.json({error: "Email already in use"});
    }
    const result = await connectionInstance.query("INSERT INTO user VALUES ?", { username, email, password });

    return NextResponse.json({ message: "Successfully created account!"});

  } catch (error:any) {
    return NextResponse.json({ message: error.message }, {status: 500,});
  }
}