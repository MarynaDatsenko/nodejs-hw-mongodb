const parseType = (type) => {
    if (typeof type !== 'string') return;
    const isType = (type) => ['work', 'home', 'personal'].includes(type);
    if (isType(type)) return type;
  };

  const parseIsFavourite = (value) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  };

  export const parseFilterParams = (query) => {
    const { type, isFavourite } = query;

    const parsedType = parseType(type);
    const parsedIsFavourite = parseIsFavourite(isFavourite);

    console.log('Parsed filter:', {
      contactType: parsedType,
      isFavourite: parsedIsFavourite,
    });

    return {
      contactType: parsedType,
      isFavourite: parsedIsFavourite,
    };
  };
