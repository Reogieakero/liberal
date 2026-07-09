import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.mjs "<password>"');
  process.exit(1);
}

if (password.length < 8) {
  console.warn('Warning: that password is under 8 characters. Consider something longer.');
}

const SALT_ROUNDS = 12;
const hash = bcrypt.hashSync(password, SALT_ROUNDS);

console.log('\nAdd this line to your .env.local:\n');
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);