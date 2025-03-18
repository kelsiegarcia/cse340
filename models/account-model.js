const pool = require('../database/');

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 *   Login to account
 * *************************** */

async function loginAccount(account_email, account_password) {
  try {
    const sql =
      'SELECT * FROM account WHERE account_email = $1 AND account_password = $2';
    return await pool.query(sql, [account_email, account_password]);
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */

async function checkExistingEmail(account_email) {
  try {
    const sql = 'SELECT * FROM account WHERE account_email = $1';
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error('No matching email found');
  }
}

// get account by id
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    return new Error('No matching email found');
  }
}

/* *****************************
 *   Update Account information
 * ***************************** */
async function updateAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_id
) {
  try {
    const sql =
      'UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *';

    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);
    return data.rows[0];
  } catch {
    console.error('updateAccount error: ' + error);
  }
}

/* *****************************
 *   Update Account Password
 * ***************************** */
async function updatePassword(account_password, account_id) {
  try {
    const sql =
      'UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING account_firstname';
    const result = await pool.query(sql, [account_password, account_id]);
    return result.rowCount;
  } catch (error) {
    console.error('Error updating password: ' + error.message);
    return 0;
  }
}

/* *****************************
 *   find by id and Check for existing password
 * ***************************** */

async function checkExistingPassword(account_password) {
  try {
    const sql = 'SELECT * FROM account WHERE account_password = $1';
    const password = await pool.query(sql, [account_password]);
    return password.rowCount;
  } catch (error) {
    return error.message;
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  loginAccount,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
  checkExistingPassword,
};
