import { Document, model, models, Schema } from 'mongoose';
export interface IEvent extends Document {
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: string;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxLength: [100, "Title cannot be more than 100 characters"],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            maxLength: [1000, "Description cannot be more than 1000 characters"],
        },
        overview: {
            type: String,
            required: [true, "Overview is required"],
            trim: true,
            maxLength: [500, "Overview cannot be more than 500 characters"],
        },
        image: {
            type: String,
            required: [true, "Image URL is required"],
            trim: true,
        },
        venue: {
            type: String,
            required: [true, "Venue is required"],
            trim: true,
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },
        date: {
            type: String,
            required: [true, "Date is required"],
        },
        time: {
            type: String,
            required: [true, "Time is required"],
            trim: true,
        },
        mode: {
            type: String,
            required: [true, "Mode is required"],
            enum: {
                values: ["online", "offline", "hybrid"],
                message: "Mode must be either online, offline, or hybrid",
            }
        },
        audience: {
            type: String,
            required: [true, "Audience is required"],
            trim: true,
        },
        agenda: {
            type: [String],
            required: [true, "Agenda is required"],
            validate: {
                validator: function (value: string[]) {
                    return value.length > 0;
                },
                message: "Agenda must have at least one item",
            }
        },
        organizer: {
            type: String,
            required: [true, "Organizer is required"],
            trim: true,
        },
        tags: {
            type: [String],
            required: [true, "Tags are required"],
            validate: {
                validator: function (value: string[]) {
                    return value.length > 0;
                },
                message: "Tags must have at least one item",
            }
        },
    },
    {
        timestamps: true,
    }
)

// pre-save hook
EventSchema.pre('save', async function () {
    const event = this as IEvent;
    if(event.isModified('title') || event.isNew) {
        event.slug = generateSlug(event.title);
    }
    if(event.isModified('date')) {
        event.date = normalizeDate(event.date);
    }
    if(event.isModified('time')) {
        event.time = normalizeTime(event.time);
    }
})

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') 
        .replace(/\s+/g, '-') 
        .replace(/-+/g, '-')
        .replace(/^| -$/g,'') 
}

function normalizeDate(dateString: string) : string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
    }
    return date.toISOString().split('T')[0];
}

function normalizeTime(timeString: string) : string {
    const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)?$/i;
    const match = timeString.match(timeRegex);
    if (!match) {
        throw new Error("Invalid time format");
    }
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = match[4]?.toUpperCase();
    
    if (period) {
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }
    }
    if(hours < 0 || hours > 23 || parseInt(minutes) < 0 || parseInt(minutes) > 59) {
        throw new Error("Invalid time value");
    }
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

// create unique index on slug
EventSchema.index({ slug: 1 }, { unique: true });

EventSchema.index({date:1, mode:1})

const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event