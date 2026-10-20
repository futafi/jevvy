import { Schema } from "effect";
export declare const ReviewSnapshot: Schema.Struct<{
    readonly enabled: Schema.Boolean;
}>;
export interface ReviewSnapshot extends Schema.Schema.Type<typeof ReviewSnapshot> {
}
