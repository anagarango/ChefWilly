import connection from "../mysql"
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const user_id = searchParams.get("user_id")
    const rows = await connection("SELECT * FROM cookbook WHERE user_id = ?", [user_id]);
    return NextResponse.json({rows});

  } catch (error:any) {
    return NextResponse.json({ message: error.message }, {status: 500,});
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, cookbook } = await request.json();
    const rows = await connection("INSERT INTO cookbook (user_id, recipe_id, recipe_information) VALUES (?, ?, ?)", [user_id, cookbook.id, JSON.stringify(cookbook)]);
    return NextResponse.json({ addedCookbook:true, message: {"title": "Ingredient Added!", "description":"We've added your ingredient for you.", "status": "success", "duration":6000}})
  } catch (error){
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const user_id = searchParams.get('user_id');
    const recipe_id = searchParams.get('recipe_id');

    const rows = await connection("DELETE FROM cookbook WHERE user_id = ? AND recipe_id = ?", [user_id, recipe_id]);
    return NextResponse.json(rows)
  } catch (error:any) {
    console.log(error)
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}