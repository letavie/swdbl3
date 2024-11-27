export const formatCurrency = (money) => {
    if (money === 0) return '0đ';
    return `${(money || 0)
        .toFixed(0) // always two decimal digits
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}đ`;
};

export const getToken = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};