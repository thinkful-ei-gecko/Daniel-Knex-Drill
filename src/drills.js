require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

// 1. Get all items that contain Text.

// function getItemsWithText(searchTerm) {
//   knexInstance
//     .select('name')
//     .from('shopping_list')
//     .where('name', 'ILIKE', `%${searchTerm}%`)
//     .then(result => {
//       console.log(result)
//     })
//     .finally(()=>knexInstance.destroy());
// }

// getItemsWithText('b')

// 2. Get all items paginated

// function getPaged(pageNumber) {
//   const perPage = 6
//   const offset = perPage * (pageNumber -1)
//   knexInstance
//     .select('name', 'price', 'category')
//     .from('shopping_list')
//     .limit(perPage)
//     .offset(offset)
//     .then(result => {
//       console.log(result)
//     })
//     .finally(() => knexInstance.destroy())
// }

// getPaged(1)

//3. Get all idems added after date.

// function getByDate(daysAgo) {
//   knexInstance
//     .select('name', 'date_added')
//     .where('date_added', '>', knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo))
//     .from('shopping_list')
//     .orderBy([
//       {column: 'date_added', order: 'ASC'}
//     ])
//     .then(result => {
//       console.log(result)
//     })
//     .finally(() => knexInstance.destroy());
// }

// getByDate(2);

//4. Get the total costs for each category.

function totalCosts() {
  knexInstance
    .select('category')
    .sum('price')
    .from('shopping_list')
    .groupBy('category')
    .then(res => {
      console.log(res);
    })
    .finally(() => knexInstance.destroy());
}

totalCosts();