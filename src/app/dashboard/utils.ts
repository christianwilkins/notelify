
type DataType = {
    [key: string]: {
        cards: {
            title: string;
            description: string;
        }[];
    };
};

export let data: DataType = {
    "Yesterday": {
        "cards": [
            {"title": "Intro To Floating Point", "description": "We know how to convert this number into binary. Each binary digit is worth two to the I, where I is the digit number, starting at zero. So, seventeen is two to the fourth plus two to the zero; sixteen plus one."},
            {"title": "Understanding Arrays", "description": "An array is a data structure that contains a group of elements. Typically these elements are all of the same data type, such as an integer or string."}
        ]
    },
    "Past 7 Days": {
        "cards": [
            {"title": "Intro To Floating Point", "description": "We know how to convert this number into binary. Each binary digit is worth two to the I, where I is the digit number, starting at zero. So, seventeen is two to the fourth plus two to the zero; sixteen plus one."},
            {"title": "Learning Python", "description": "Python is a high-level, interpreted, interactive and object-oriented scripting language. Python is designed to be highly readable."},
            {"title": "JavaScript Basics", "description": "JavaScript is a text-based programming language used both on the client-side and server-side that allows you to make web pages interactive."}
        ]
    },
    "Past 30 Days": {
        "cards": [
            {"title": "Intro To Floating Point", "description": "We know how to convert this number into binary. Each binary digit is worth two to the I, where I is the digit number, starting at zero. So, seventeen is two to the fourth plus two to the zero; sixteen plus one."},
            {"title": "Data Structures", "description": "A data structure is a particular way of organizing data in a computer so that it can be used effectively."},
            {"title": "Algorithms", "description": "An algorithm is a set of instructions designed to perform a specific task."},
            {"title": "Web Development", "description": "Web development is the work involved in developing a website for the Internet or an intranet."},
            {"title": "Machine Learning", "description": "Machine learning is an application of artificial intelligence (AI) that provides systems the ability to automatically learn and improve from experience without being explicitly programmed."}
        ]
    }
};
