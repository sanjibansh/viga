const { Pool } = require('pg');
//const connectionString = require('./models/models');
//const connectionString = 'postgres://postgres:Password%4003@localhost:5432/postgres';
const connectionString = 'postgres://user_viga:h8CueJ9erUc4Nkj82RYiHUUUUo986Y2i@dpg-cnvvkpv79t8c73d862rg-a/postgres_viga'

class PriceService {
  async calculatePrice(zone, organization_id, total_distance, type) {
    try {
      const pool = new Pool({
        connectionString: connectionString,
      });

      // Fetch pricing details from the database  
      const query = `
    SELECT base_distance_in_km, km_price, fix_price
    FROM Pricing
    WHERE organization_id = $1 AND zone = $2 AND item_id IN (
      SELECT id FROM Item WHERE type = $3
    )
  `;
  console.log('Executing SQL query:', query);
  console.log('Parameters:', [organization_id, zone, type]);
 
      const { rows } = await pool.query(query, [organization_id, zone, type]);
      //error in this above line
      if (rows.length === 0) {
        return {
          error: "Pricing information not found for the given parameters",
        }
      }

      // Calculate total price
      const { base_distance_in_km, km_price, fix_price } = rows[0];
      let totalPrice = parseInt(fix_price) * 100;
      if (total_distance > base_distance_in_km) {
        totalPrice += (total_distance - base_distance_in_km) * km_price * 100; // Convert to cents
      }

      // Return the total price in euros
      return totalPrice / 100 ; // Convert back to euros
    } catch (error) {
      console.error("Error calculating price:", error);
      return { error: "Internal server error"};
    }
  }
}

module.exports = PriceService;