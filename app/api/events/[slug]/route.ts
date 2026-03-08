import { Event, IEvent } from "@/database";
import connectDB from "@/lib/mongodb"
import { NextRequest, NextResponse } from "next/server"

type RouteParams = {
    params: Promise<{ slug: string }>
}

export async function GET(req:NextRequest, { params }: RouteParams) {
    try {
        await connectDB();
        const { slug } = await params;
        if(!slug || typeof slug !== 'string' || slug.trim() === '') {
            return NextResponse.json({ message: "Invalid event slug" }, { status: 400 });
        }
        const santizedSlug = slug.trim().toLowerCase();

        const event = await Event.findOne({ slug: santizedSlug }).lean();
        if(!event) {
            return NextResponse.json({ message: "Event not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Event fetched successfully", event }, { status: 200 });
    } catch (error) {
        console.error("Error fetching event:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }

}