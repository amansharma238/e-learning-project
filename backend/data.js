import bcrypt from 'bcryptjs';
const data = {
    users: [
        {
            name: 'Aman',
            email: 'amansharma122000@gmail.com',
            password: bcrypt.hashSync('Aman1234'),
            isAdmin: true,
        },
        {
            name: 'Sam',
            email: 'user@example.com',
            password: bcrypt.hashSync('12345678'),
            isAdmin: false,
        }
    ],

    courses: [
        {
            // id: 1,
            name: "Build a fullstack Netflix Clone",
            category: "computer science",
            hours: 56,
            price: 9,
            image: '/images/p1.jpg',
            numberofpurchase: 10,
            rating: 4.5,
            numReviews: 5,
            Instructor: "Arnav Sharma",
            description: 'React,firebase,Redux comes together to create this beautiful Netflix clone',
        },
        {
            // id: 2,
            name: "3D Earth - WebGl in action",
            category: "Physics",
            hours: 50,
            price: 1.9,
            image: '/images/p1.jpg',
            numberofpurchase: 8,
            rating: 4.1,
            numReviews: 2,
            Instructor: "Sumit Kumar",
            description: 'Using WebG',
        },
        {
            // id: 3,
            name: "Build a Amazon like website",
            category: "computer science",
            hours: 48,
            price: 3,
            image: '/images/p1.jpg',
            numberofpurchase: 10,
            rating: 4.7,
            numReviews: 5,
            Instructor: "Ravi Sharma",
            description: 'React,firebase,Redux comes together to create this beautiful Netflix clone',
        },
        {
            // id: 4,
            name: "Machine Learning Bootcamp",
            category: "computer science",
            hours: 36,
            price: 2,
            image: '/images/p1.jpg',
            numberofpurchase: 99,
            rating: 4.2,
            numReviews: 10,
            Instructor: "Arnav Sharma",
            description: 'Python, Deep Learning and Artificial Intelligence',
        },
    ]
}

export default data;