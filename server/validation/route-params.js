import "server-only";

const COLOR_VALUE_PATTERN =
  /^[a-zA-Z0-9#(),.%\s-]{1,32}$/;

export function parseBlurDetail(detail) {
  const [
    fontSizeValue,
    distanceValue,
    eye,
  ] = detail.split("_");

  const fontSize =
    Number(fontSizeValue);

  const distance =
    Number(distanceValue);

  if (
    !Number.isFinite(fontSize) ||
    fontSize < 1 ||
    fontSize > 30 ||
    !Number.isFinite(distance) ||
    distance < 0.1 ||
    distance > 10 ||
    !["left", "right"].includes(eye)
  ) {
    return null;
  }

  return {
    fontSize,
    distance,
    eye,
  };
}

export function parseColorDetail(detail) {
  const separatorIndex =
    detail.indexOf("_");

  if (separatorIndex < 1) {
    return null;
  }

  const background_color =
    detail.slice(0, separatorIndex);

  const font_color =
    detail.slice(separatorIndex + 1);

  if (
    !COLOR_VALUE_PATTERN.test(
      background_color,
    ) ||
    !COLOR_VALUE_PATTERN.test(
      font_color,
    )
  ) {
    return null;
  }

  return {
    background_color,
    font_color,
  };
}

export function parseFieldDetail(detail) {
  const [side, distanceValue] =
    detail.split("_");

  const distance =
    Number(distanceValue);

  if (
    !["left", "right"].includes(side) ||
    !Number.isFinite(distance) ||
    distance < -30 ||
    distance > 30
  ) {
    return null;
  }

  return {
    side,
    distance,
  };
}