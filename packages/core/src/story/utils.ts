export const splitAtCharacter = (text: string, character: string) => {
  if (!text) {
    return;
  }

  const splitIndex = text.indexOf(character);

  if (splitIndex === -1) {
    return {
      before: text.trim().toLowerCase(),
    };
  } else {
    return {
      before: text.slice(0, splitIndex).trim().toLowerCase(),
      after: text.slice(splitIndex + 1).trim(),
    };
  }
};
