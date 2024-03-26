import connection from "../mysql"
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email")
    const password = searchParams.get("password")
    const rows = await connection("SELECT * FROM user WHERE email = ? AND password = ?", [email, password]);
    if (rows) {
      return NextResponse.json({rows});
    }
    return NextResponse.json({ error: "Email or password does not match"});

  } catch (error:any) {
    return NextResponse.json({ message: error.message }, {status: 500,});
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();
    const rows = await connection("SELECT * FROM user WHERE email = ?", [email]);
    if (rows) {
      return NextResponse.json({error: "Email already in use"});
    }
    const result = await connection("INSERT INTO user (username, email, password) VALUES (?, ?, ?)",[username, email, password]);
    const user = await connection("SELECT * FROM user WHERE email = ?", [email]);

    return NextResponse.json({ message: user});

  } catch (error:any) {
    return NextResponse.json({ message: error }, {status: 500});
  }
}