import connection from "../mysql"
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email")
    const password = searchParams.get("password")
    const rows:any[] = await connection("SELECT * FROM user WHERE email = ? AND password = ?", [email, password]);
    
    if (rows[0].length) {
      return NextResponse.json(rows[0]);
    }
    return NextResponse.json({ message: {"title": "Email or password does not match.", "description":"Either one of the inputs are wrong or no account was found", "status": "error", "duration":5000}});

  } catch (error:any) {
    return NextResponse.json({ message: error.message }, {status: 500,});
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();
    const rows: any[] = await connection("SELECT * FROM user WHERE email = ?", [email]);
    if (rows[0].length) {
      return NextResponse.json({message: {"title": "Email already in use.", "description":"An account is already using this email address", "status": "error", "duration":5000}});
    }
    const result = await connection("INSERT INTO user (username, email, password) VALUES (?, ?, ?)",[username, email, password]);
    const user = await connection("SELECT * FROM user WHERE email = ?", [email]);

    return NextResponse.json(user[0]);

  } catch (error:any) {
    return NextResponse.json({ message: error }, {status: 500});
  }
}