export const removeDupplicate = (messageList = []) => {
    const newArr = [];
    messageList.forEach((item) => {
        const exist = newArr.find((newItem) => newItem.messageId === item.messageId);
        if (!exist) {
            newArr.push(item)
        }
    })

    return newArr;
}