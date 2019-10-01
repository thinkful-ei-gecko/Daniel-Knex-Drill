require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

//Selects all objects from the amazong table, in an object

// knexInstance.from('amazong_products').select('*')
//   .then(result => {
//     console.log(result)
//   })

//This is a modified version of the above that selects the identifier, name, price, and category of one product. Equivalent to:

// SELECT product_id, name, price, category
//   FROM amazong_products
// WHERE name = 'Point of view gun';

knexInstance
  .select('product_id', 'name', 'price', 'category')
  .from('amazong_products')
  .where({ name: 'Point of view gun' })
  //the first method shows only the first item found
  .first()
  .then(result => {
    console.log(result);
    //run dbdestroy in the "finally" memthod of the promise
  });


  //Search products based on work. NOtice that it's wrapped in a function so that we can "feed" in information. Also, notice that ILIKE is used. It is case-insensive version of LIKE

function searchByProduceName(searchTerm) {
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result)
    });
}

searchByProduceName('holo')



//Allow customers to paginante the amazong_products table products, 10 at a time. 
//Use the lIMIT and OFFSET operators. 
//LIMIT tells the number of items to display
//OFFSET is the starting position in the list to cout up to the limit from. 
//EXample: Page four= limit 10, offset is limit * (page -1). Page four would start at product 30 and go till product 40

function paginateProducts(page) {
  const productsPerPage = 10
  const offset = productsPerPage * (page - 1)
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result)
    })
}

paginateProducts(2)


//Filter products for products that have images. 
//Can't use image != NULL. NEed to use the IS NOT NULL operator 


function getProductsWithImages() {
  knexInstance
    .select('product_id', 'name', 'price', 'category', 'image')
    .from('amazong_products')
    .whereNotNull('image')
    .then(result => {
      console.log(result)
    })
}

getProductsWithImages()


//Build a query that allws customers to see the most popular videos by view at whopipe by reagion for the last 30 days. 

-Use the count() function to count the dates viewed
-Group by a combination of the video's name and region
-Sort by region and order by count with most popular
-Use a where to filter only results within last 30 DynamicsCompressorNode


SELECT video_name, region, count(date_viewed) AS views
FROM whopipe_video_views
  WHERE date_viewed > (now() - '30 days'::INTERVAL) <-- more than 30 days before now
GROUP BY video_name, region
ORDER BY region ASC, views DESC;

//in KNEX
function mostPopularVideosForDays(days) {
  knexInstance
    .select('video_name', 'region')
    .count('date_viewed AS views')
    .where(
      'date_viewed',
      '>',
      //KNEX doesn't have a method for the now...30day. Instead, we can use .raw() to pass in 'raw' sql as a string. Here, ?? tells knex that this is the spot in the raw sql that will contain user input. The second argment to raw is the value fo rhte user input. This is called a prepared statemtn. 
      knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
    )
    .from('whopipe_video_views')
    .groupBy('video_name', 'region')
    .orderBy([
      { column: 'region', order: 'ASC' },
      { column: 'views', order: 'DESC' },
    ])
    .then(result => {
      console.log(result)
    })
}

mostPopularVideosForDays(30)

// //Stops the connection to the database so that it doesn't hang after the query.
// db.destroy();
