import "server-only";

function serializeResult(result, fields) {
  return {
    ...Object.fromEntries(fields.map((field) => [field, result[field]])),
    _id: result._id?.toString(),
    date:
      result.date instanceof Date
        ? result.date.toISOString()
        : result.date,
  };
}

export function toSafeUserDTO(user) {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,

    colorWeaknesses: (
      user.colorWeaknesses || []
    ).map((result) => serializeResult(result, ["background_color", "font_color"])),

    sizeWeaknesses: (
      user.sizeWeaknesses || []
    ).map((result) => serializeResult(result, ["eye", "fontSize", "distance"])),

    fieldWeaknesses: (
      user.fieldWeaknesses || []
    ).map((result) => serializeResult(result, ["side", "distance"])),
  };
}

