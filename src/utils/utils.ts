export const ParseConversationId = (array: string[]) => {
    const newArray = [...array];
    return newArray.sort().join('-');
}
