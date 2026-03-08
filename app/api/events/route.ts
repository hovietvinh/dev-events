import {v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import {Event} from "@/database/index";

export async function POST (req: NextRequest, res: NextResponse) {
    try {
        await connectDB();
        const formData = await req.formData();
        let event;
        try {
            event = Object.fromEntries(formData.entries());
            

        } catch (error) {
            console.error("Error parsing form data:", error);
            return NextResponse.json({ message: "Invalid json data" }, { status: 400 });
        }

        const file = formData.get('image') as File ;
        if(!file) {
            return NextResponse.json({ message: "Image file is required" }, { status: 400 });
        }
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder:"dev_events" }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            }).end(buffer);
        })
        
        let tags = JSON.parse(formData.get('tags') as string);
        let agenda = JSON.parse(formData.get('agenda') as string);
        event.image = (uploadResult as {secure_url: string}).secure_url;

        const createEvent = await Event.create({
            ...event,
            tags:tags,
            agenda:agenda
        });
        return NextResponse.json({ message: "Event created successfully", event: createEvent }, { status: 201 });
    } catch (error) {
        console.error("Error creating booking:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }

}


export async function GET (req: NextRequest, res: NextResponse) {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json({ messages:"Events fetched successfully", events }, { status: 200 });
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

