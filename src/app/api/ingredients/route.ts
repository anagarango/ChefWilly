import connection from "../mysql"
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const user_id = searchParams.get("user_id")
    const connectionInstance = await connection;
    const [rows] = await connectionInstance.query("SELECT * FROM ingredients WHERE user_id = ?", [user_id]);
    return NextResponse.json({ingredients: rows});

  } catch (error:any) {
    return NextResponse.json({ message: error.message }, {status: 500,});
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, ingredient } = await request.json();
    const connectionInstance = await connection;
    const [rows]: any[] = await connectionInstance.query("SELECT ingredient_name FROM ingredients WHERE user_id = ? AND ingredient_name = ?", [user_id, ingredient[0].name]);
    if (rows[0]) {
      return NextResponse.json({error: {"title": "Ingredient Already Exists!", "description":"This ingrdient has already been added", "status": "error", "duration":6000}});
    }
    const result = await connectionInstance.query("INSERT INTO ingredients (user_id, ingredient_id, ingredient_name, aisle, image) VALUES (?, ?, ?, ?, ?)", [user_id, ingredient[0].id, ingredient[0].name, ingredient[0].aisle, ingredient[0].image]);
    return NextResponse.json({ message: {"title": "Ingredient Added!", "description":"We've added your ingredient for you.", "status": "success", "duration":6000}, ingredient: {"user_id": user_id, "ingredient_id":ingredient[0].id, "ingredient_name":ingredient[0].name, "aisle" : ingredient[0].aisle, "image": ingredient[0].image}});

  } catch (error:any) {
    console.log(error)
    return NextResponse.json({ message: error.message }, {status: 500,});
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const user_id = searchParams.get('user_id');
    const ingredient_id = searchParams.get('ingredient_id');

    const connectionInstance = await connection;
    const [rows]:any = await connectionInstance.query("DELETE FROM ingredients WHERE user_id = ? AND ingredient_id = ?", [user_id, ingredient_id]);
    return NextResponse.json(rows)
  } catch (error:any) {
    console.log(error)
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}