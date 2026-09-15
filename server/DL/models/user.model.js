import "server-only";
import mongoose from "mongoose";
import { isPasswordHash } from "@/server/security/password";

const { Schema } = mongoose;

const colorWeaknessSchema = new Schema(
  {
    background_color: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },

    font_color: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  },
);

const sizeWeaknessSchema = new Schema(
  {
    eye: {
      type: String,
      enum: ["right", "left"],
      default: "right",
    },

    fontSize: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
    },

    distance: {
      type: Number,
      required: true,
      min: 0.1,
      max: 10,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  },
);

const fieldWeaknessSchema = new Schema(
  {
    side: {
      type: String,
      enum: ["right", "left"],
      required: true,
    },

    distance: {
      type: Number,
      required: true,
      min: -30,
      max: 30,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  },
);

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    passwordHash: {
      type: String,
      select: false,
      required() { return this.isNew; },
      validate: { validator: isPasswordHash, message: "A valid password hash is required." },
    },

    // Temporary legacy field.
    // Removed automatically after a successful login.
    password: {
      type: String,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },

    colorWeaknesses: {
      type: [colorWeaknessSchema],
      default: [],
    },

    sizeWeaknesses: {
      type: [sizeWeaknessSchema],
      default: [],
    },

    fieldWeaknesses: {
      type: [fieldWeaknessSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,

    toJSON: {
      transform(_document, value) {
        delete value.password;
        delete value.passwordHash;
        return value;
      },
    },
    toObject: {
      transform(_document, value) {
        delete value.password;
        delete value.passwordHash;
        return value;
      },
    },
  },
);

userSchema.pre("validate", function rejectLegacyPasswordWrites() {
  if (this.password !== undefined && (this.isNew || this.isModified("password"))) {
    throw new Error("Writing legacy passwords is prohibited.");
  }
});

export const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);
