
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

export const formatDate = (date: string) => {
    const newDate = new  Date(date);
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();
    // newDate.getTime()
    return `${day}/${month}/${year} ${newDate.getHours()}:${newDate.getMinutes()}`;
};
// export const formatDate = (date: string) => {
//     const newDate = new  Date(date); 
//     const day = newDate.getDate();
//     const month = newDate.getMonth() + 1;
//     const year = newDate.getFullYear();
//     return `${months[month-1]} ${day}, ${year}`;
// };


export const daysAgo = (date: string) => {
    const newDate = new Date(date);
    const today = Date.now();

    const diffTime = Math.abs(today - Number(newDate));

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    

    return diffDays;
};

export const timeAgo = (date: string) => {
    const newDate = new Date(date)
    const today = Date.now();

    const diffTime = Math.abs(today - Number(newDate));

    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays > 1) {
        return `${Math.floor(diffDays)} days ago`; 
    } else if (diffDays === 1) {
        return `${Math.floor(diffDays)} day ago`; 
    } else if ((diffDays * 24) > 1) {
        return `${Math.floor(diffDays * 24)} hours ago`; 
    } else if ((diffDays * 24) === 1) {
        return `${Math.floor(diffDays * 24)} hour ago`; 
    } else if ((diffDays * 24 * 60) > 1) {
        return `${Math.floor(diffDays * 24 * 60)} mins ago`; 
    } else {
        return `${Math.floor(diffDays * 24 * 60)} min ago`; 
    }

};

export const formatDate2 = (date: string) => {
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();
    // console.log("newDate", newDate, "day", day, "month", month, "year", year);
    return `${day}-${month}-${year}`;
};
  

export const formatDate3 = (date: string) => {
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();
    // console.log("newDate", newDate, "day", day, "month", month, "year", year);
    return `${year}-${month}-${day}`;
};
  

export const getTomorrowsDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const day = tomorrow.getDate();
    const month = tomorrow.getMonth() + 1; // January is 0!
    const year = tomorrow.getFullYear();

    // Formatting to ensure leading zeros if needed
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');

    return `${year}-${formattedMonth}-${formattedDay}`;
};

// export const expired = (date: number) => {
//     if (!date) return true;
    
//     const newDate = new Date(date * 1000)
//     const today = new Date();


//     if (newDate < today) {
//         return true;
//     }
//     return false;
// };
  
  