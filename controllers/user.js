const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
const TOKEN_KEY ="NTVp3QKaCu0i5wsG2cX+vvkIzmiLx7hCA6nHwXzp5YWlniKtvYe8+HsqjOoClC7to2hmtQl";

// User Register
const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, gender, status, date } =req.body;
    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    db.query(
      "SELECT COUNT(*) AS cnt FROM users WHERE email = ? ",
      req.body.email.toLowerCase(),
      function (err, data) {
        if (err) {
          console.log(err);
        } else {
          if (data[0].cnt > 0) {
            // Already exist
            return res
              .status(409)
              .send("User already exists. Please login to continue.");
          } else {
            db.query(
              "INSERT INTO users (firstname, lastname, email, password, gender, status, date) VALUES (?,?,?,?,?,?,?)",
              [
                first_name,
                last_name,
                email.toLowerCase(),
                encryptedPassword,
                gender,
                status,
                date,
              ],
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  return res
                    .status(201)
                    .json("Registered successfully. Please do login.");
                }
              }
            );
          }
        }
      }
    );
  } catch (err) {
    res.status(409).send(err);
  }
};

// User Login
const loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    db.query(
      "SELECT * FROM users WHERE email = ? ",
      [email],
      function (error, results, fields) {
        if (error) throw error;
        else {
          if (results.length > 0) {
            bcrypt.compare(
              req.body.password,
              results[0].password,
              function (err, result) {
                if (result) {
                  //Creating jwt token
                  const token = jwt.sign(
                    { user_id: results[0].id, email: results[0].email },
                    TOKEN_KEY,
                    {
                      expiresIn: "2h",
                    }
                  );

                  const usertokenExp = 7200;
                  const userObj = results[0];

                  res.status(200).json({ token, usertokenExp, userObj });
                } else {
                  // return res.status(400).send({ message: "Invalid Password" });
                  res.status(409).send("Invalid Credentials");
                }
              }
            );
          } else {
            // return res.status(400).send({ message: "Invalid Email" });
            res.status(409).send("Email not registered. Please Signup! ");
          }
        }
      }
    );
  } catch (err) {
    res.status(409).send(err);
  }
};

// Update User
const updateUser = async (req, res) => {
  db.query(
    "UPDATE users SET  firstname=?,lastname=?,gender=?,status=?,date=? WHERE id = ?",
    [
      req.body.first_name,
      req.body.last_name,
      req.body.gender,
      req.body.status,
      req.body.date,
      req.params.id,
    ],
    (err, result) => {
      if (err) {
        res.status(409).send("Something went wrong.try again");
      } else {
        db.query(
          "SELECT * FROM users WHERE email = ? ",
          [req.body.email],
          function (error, results, fields) {
            if (error) throw error;
            else {
              if (results.length > 0) {
                const userObj = results[0];
                res.status(200).json({ userObj });
              }
            }
          }
        );
      }
    }
  );
};

// Delete User
const deleteUser = async (req, res) => {
  db.query(
    "DELETE FROM users WHERE id = ?",
    [req.params.id],
    function (error, rows, fields) {
      if (!error) {
        return res.status(201).json("User deleted successfully");
      } else {
        console.log("Error in deleting");
      }
    }
  );
};

// Reset Password without (Update password from profile page)
const resetPasswordFromProfile = async (req, res, next) => {
  encryptedPassword = await bcrypt.hash(req.body.password, 10);

  db.query(
    "UPDATE users SET  password=? WHERE email = ?",
    [encryptedPassword, req.body.email],
    (err, result) => {
      if (err) {
        res.status(409).send("Something went wrong.try again");
      } else {
        res
          .status(201)
          .json("Your password has been updated. Use it for your next login.");
      }
    }
  );
};

module.exports = {
  loginUser,
  createUser,
  updateUser,
  deleteUser,
  resetPasswordFromProfile,
};
