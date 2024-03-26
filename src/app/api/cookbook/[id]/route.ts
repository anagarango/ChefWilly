import connection from "../../mysql"
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
  try {
    const user_id = params.id
    
    const searchParams = request.nextUrl.searchParams;
    const recipe_id = searchParams.get("recipe_id")
    const rows = await connection("SELECT * FROM cookbook WHERE user_id = ? AND recipe_id = ?", [user_id, recipe_id]);
    
    return NextResponse.json({"cookbookExists": rows[0]});

  } catch (error:any) {
    return NextResponse.json({ message: error.message }, {status: 500});
  }
}