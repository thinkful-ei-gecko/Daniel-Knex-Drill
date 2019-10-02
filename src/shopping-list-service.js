const listService = {
  getAllItems(knex) {
    return knex.select('*').from('shopping_test');
  },
  insertItem(knex, newItem) {
    return knex
      .insert(newItem)
      .into('shopping_test')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  getItemById(knex, id) {
    return knex
      .from('shopping_test')
      .select('*')
      .where('id', id)
      .first();
  },
  deleteItem(knex, id) {
    return knex('shopping_test')
      .where({ id })
      .delete();
  },
  updateItem(knex, id, newItemFields) {
    return knex('shopping_test')
      .where({ id })
      .update(newItemFields);
  }
};

module.exports = listService;
