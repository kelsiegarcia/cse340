const pool = require('../database/');

/* ****************************************
 *  get reviews by inventory id
 * *************************************** */

async function getReviewsByInventoryId(inv_id) {
  const query = {
    text: `SELECT r.review_id, r.review_text, r.review_date, a.account_firstname, a.account_lastname
            FROM public.review r
            JOIN public.account a ON r.account_id = a.account_id
            WHERE r.inv_id = $1
            ORDER BY r.review_date DESC`,
    values: [inv_id],
  };

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error('Error fetching reviews:', err);
    return [];
  }
}

async function addReview(inv_id, account_id, review_text) {
  const query = {
    text: `INSERT INTO review (inv_id, account_id, review_text)
						VALUES ($1, $2, $3)`,
    values: [inv_id, account_id, review_text],
  };

  try {
    await pool.query(query);
    return 'success';
  } catch (err) {
    return err;
  }
}

/* ****************************************
 *  get review by review id
 * *************************************** */
async function getReviewById(review_id) {
  const query = {
    text: `SELECT r.review_id, r.review_text, r.review_date, a.account_firstname, a.account_lastname
						FROM public.review r
						JOIN public.account a ON r.account_id = a.account_id
						WHERE r.review_id = $1`,
    values: [review_id],
  };

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error('Error fetching review:', err);
    return [];
  }
}

/* ****************************************
 *  get review by account id
 * *************************************** */

async function getReviewByAccountId(account_id) {
  const query = {
    text: `SELECT r.review_id, r.review_text, r.review_date, a.account_firstname, a.account_lastname, 
									v.inv_make, v.inv_model, v.inv_year
					 FROM public.review r
					 JOIN public.account a ON r.account_id = a.account_id
					 JOIN public.inventory v ON r.inv_id = v.inv_id
					 WHERE r.account_id = $1`,
    values: [account_id],
  };

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error('Error fetching review:', err);
    return [];
  }
}

// /* ****************************************
//  *  edit review by review id
//  * *************************************** */

async function editReview(review_id) {
  const query = {
    text: `SELECT r.review_id, r.review_text, r.review_date, a.account_firstname, a.account_lastname
						FROM public.review r
						JOIN public.account a ON r.account_id = a.account_id
						WHERE r.review_id = $1`,
    values: [review_id],
  };

  try {
    const result = await pool.query(query);
    return result.rows[0];
  } catch (err) {
    console.error('Error fetching review:', err);
    return [];
  }
}

// /* ****************************************
//  *  update review by review id
//  * *************************************** */
async function updateReview(review_id, review_text) {
  const query = {
    text: `UPDATE public.review
						SET review_text = $1
						WHERE review_id = $2`,
    values: [review_text, review_id],
  };

  try {
    const data = await pool.query(query);
    return 'Review updated successfully';
  } catch (err) {
    return err;
  }
}
// /* ****************************************
//  *  delete review by review id
//  * *************************************** */

async function deleteReview(review_id) {
  const query = {
    text: `DELETE FROM public.review
						WHERE review_id = $1`,
    values: [review_id],
  };

  try {
    const result = await pool.query(query);
    return result.rowCount > 0; // Return true if a row was deleted
  } catch (err) {
    console.error('Error deleting review:', err);
    return false; // Return false if an error occurred
  }
}
module.exports = {
  getReviewsByInventoryId,
  addReview,
  getReviewById,
  editReview,
  updateReview,
  getReviewByAccountId,
  deleteReview,
};
