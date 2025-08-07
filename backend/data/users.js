import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    role: 'candidate',
  },
  {
    name: 'Jane Smith (Recruiter)',
    email: 'jane.smith@example.com',
    password: 'password123',
    role: 'recruiter',
  },
];

// We need to hash passwords before insertion
const hashedUsers = users.map(user => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(user.password, salt);
    return { ...user, password: hashedPassword };
});

export default hashedUsers;