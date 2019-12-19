import bcrypt from "bcrypt-nodejs";
import crypto from "crypto";
import mongoose, { Document } from "mongoose";

import { PersonnelDocument, comparePassword, UserInfo } from "./Personnel";
import { RecordBrief } from "./records/Record";

export type EmergencyPROFILE = {
    name: string;
    age: string;
    BloodType: string;
    Allergies: string;
    DiseaseHistory: string;
}


export interface UserDocument extends PersonnelDocument { 
    /* User */
    recordBriefList: RecordBrief[];
    recordList: mongoose.Types.ObjectId[];

    /* User Authorization Lists */
    holdsAuthList: UserInfo[];
    grantedAuthList: UserInfo[];

    EmergencyProfile: EmergencyPROFILE;
}



/**
 * MongoDB Schema
 */

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    usertype: String,
    name: String,
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,

    tokens: Array,

    profile: {
        name: String,
        age: String,
        gender: String,
        birthday: String,
        location: String,
        website: String,
    },

    recordBriefList: Array,
    recordList: Array,
    holdsAuthList: Array,
    grantedAuthList: Array,

    EmergencyProfile: {
        name: String,
        age: String,
        BloodType: String,
        Allergies: String,
        DiseaseHistory: String
    }

}, { timestamps: true });


/**
 * Password hash middleware.
 */

userSchema.pre("save", function save(next) {
    const user = this as UserDocument;
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = comparePassword;

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function (size: number = 200) {
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash("md5").update(this.email).digest("hex");
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

export const User = mongoose.model<UserDocument>("User", userSchema);