import mongoose, { Types,Schema,Document, models, model } from "mongoose";
import Event from "./event.model";

export interface IBooking extends Document {
    eventId: Types.ObjectId;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: 'Event',
            required: [true, "Event ID is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            validate: {
                validator: function (v: string) {
                    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: (props: any) => `${props.value} is not a valid email address!`
            }
        },
    }, 
    {
        timestamps: true,
    }
)

BookingSchema.pre('save',async function(next){
    const booking = this as IBooking;
    if(booking.isModified('eventId') || booking.isNew) {
        try {
            const eventexists = await Event.findById(booking.eventId).select('_id');
            if(!eventexists) {
                const err = new Error('Event not found');
                err.name = 'ValidationError';
                return next(err)
            }

        } catch{
            const err = new Error('Invalid Event ID');
            err.name = 'ValidationError';
            return next(err);
        }
    }
    next();
})

BookingSchema.index({eventId:1})

BookingSchema.index({eventId:1, createdAt:-1})

BookingSchema.index({email:1})

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;