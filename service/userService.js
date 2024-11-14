const pool = require("../config/config");
const bcrypt = require("bcrypt");
const { withConnection, executeQuery } = require("../config/db");

// Register a new user
async function registerUser(email, password, name, mobile, roleId = 2) {
  const connection = await new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        return reject(err);
      }
      resolve(conn);
    });
  });

  try {
    await executeQuery(connection, "START TRANSACTION", []);
    const checkRoleQuery = "SELECT id FROM roles WHERE id = ?";
    const roleResult = await executeQuery(connection, checkRoleQuery, [roleId]);

    if (roleResult.length === 0) {
      throw new Error("Role not found");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userQuery = "INSERT INTO users (name, mobile, email, password) VALUES (?, ?, ?, ?)";
    const userResult = await executeQuery(connection, userQuery, [name, mobile, email, hashedPassword]);
    const userId = userResult.insertId;
    const userRoleQuery = "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)";
    await executeQuery(connection, userRoleQuery, [userId, roleId]);
    await executeQuery(connection, "COMMIT", []);
    return { success: true, message: "User registered successfully", userId };
  } catch (err) {
    console.error(err);
    await executeQuery(connection, "ROLLBACK", []);
    throw err;
  } finally {
    connection.release();
  }
}


// Login an existing user
async function loginUser(email, password) {
  const query = `
  SELECT users.*, user_roles.role_id 
  FROM users
  JOIN user_roles ON users.id = user_roles.user_id
  JOIN roles ON user_roles.role_id = roles.id
  WHERE users.email = ?`;

  return new Promise((resolve, reject) => {
    pool.query(query, [email], async (err, results) => {
      if (err) reject(err);
      if (results === undefined || results?.length === 0) {
        return reject("User not found");
      }

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return reject("Invalid password");
      }

      resolve(user);
    });
  });
}

async function getUserData(id) {
  const userId = parseInt(id, 10);
  const query = 'SELECT name, mobile ,amount FROM users WHERE id = ?';
  return await withConnection(async (connection) => {
    const result = await executeQuery(connection, query, [userId]);
    return result;
  });
}

async function getAllUsers() {
  const query = `SELECT * FROM  users`;
  return await withConnection(async (connection) => {
    const result = await executeQuery(connection, query, []);
    return result;
  });
}

async function updateUserByAdmin(req, res) {
  const { name, mobile, id } = req.body;
  const idInt = parseInt(id, 10);

  const checkUserQuery = "SELECT *  FROM users WHERE id = ?";
  let userExists;

  await withConnection(async (connection) => {
    userExists = await executeQuery(connection, checkUserQuery, [idInt]);
  });

  if (userExists.length === 0) {
    throw new Error("User not found");
  }

  const query = `UPDATE users SET name = ?, mobile = ? WHERE id = ? `;
  return await withConnection(async (connection) => {
    const result = await executeQuery(connection, query, [name, mobile, idInt]);
    return result;
  });
}

module.exports = {
  registerUser,
  loginUser,
  getUserData,
  getAllUsers,
  updateUserByAdmin
};
