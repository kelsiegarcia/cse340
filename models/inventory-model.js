const pool = require('../database/');

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    'SELECT * FROM public.classification ORDER BY classification_name;'
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    // console.log('data.rows:', data.rows);
    return data.rows;
  } catch (error) {
    console.error('getclassificationsbyid error ' + error);
  }
}

// Get all inventory items and classification_name by inv_id
async function getInventoryById(inv_id) {
  try {
    let dataVehicle = await pool.query(
      'SELECT * FROM public.inventory WHERE inv_id = $1',
      [inv_id]
    );
    return dataVehicle.rows[0];
  } catch (error) {
    console.error('getInventoryById error ' + error);
  }
}

// add new classification
// inventory management
/* ***************************
 *  Add new classification
 * ************************** */

async function addClassification(classification_name) {
  try {
    const result = await pool.query(
      'INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *',
      [classification_name]
    );
    return result.rows[0];
  } catch (error) {
    console.error('addClassification error: ' + error);
  }
}

/* ***************************
 *  check for existing classification
 * ************************** */

async function checkExistingClassification(classification_name) {
  try {
    const sql =
      'SELECT * FROM public.classification WHERE classification_name = $1';
    const classification = await pool.query(sql, [classification_name]);
    return classification.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  insert new vehicle information into table and also selected classification table
 * ************************** */

async function addVehicle(vehicle) {
  try {
    const result = await pool.query(
      'INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_year, inv_color, inv_price, inv_miles, inv_image, inv_description, inv_thumbnail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [
        vehicle.classification_id,
        vehicle.inv_make,
        vehicle.inv_model,
        vehicle.inv_year,
        vehicle.inv_color,
        vehicle.inv_price,
        vehicle.inv_miles,
        vehicle.inv_image,
        vehicle.inv_description,
        vehicle.inv_thumbnail,
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('addVehicle error: ' + error);
    return null;
  }
}

/* ***************************
 *  update vehicle information
 * ************************** */

async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      'UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *';
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error('model error: ' + error);
  }
}

/* ***************************
 *  delete vehicle information
 * ************************** */

async function deleteSingleVehicle(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1';
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    console.error('Delete Inventory Error');
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  checkExistingClassification,
  addVehicle,
  updateInventory,
  deleteSingleVehicle,
};
