require('dotenv').config();
const { expect } = require('chai');

const listService = require('../src/shopping-list-service');
const knex = require('knex');

describe('listService', () => {
  let db;
  let testItems = [
    {
      id: 1,
      name: 'Fish tricks',
      price: '13.10',
      category: 'Main',
      checked: false,
      date_added: new Date('2019-10-02T22:37:21.217Z')
    },
    {
      id: 2,
      name: 'Not Dogs',
      price: '4.99',
      category: 'Snack',
      checked: true,
      date_added: new Date('2019-10-02T22:37:21.217Z')
    },
    {
      id: 3,
      name: 'Bluffalo Wings',
      price: '5.50',
      category: 'Snack',
      checked: false,
      date_added: new Date('2019-10-02T22:37:21.217Z')
    }
  ];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });

  before(() => db('shopping_test').truncate());

  afterEach(() => db('shopping_test').truncate());

  after(() => db.destroy());

  context(`Given 'shopping_test' has data`, () => {
    beforeEach(() => {
      return db.into('shopping_test').insert(testItems);
    });

    it(`getItemById() resolves an item by id from 'shopping_test' table`, () => {
      const thirdId = 3;
      const testItem = testItems[thirdId - 1];
      return listService.getItemById(db, thirdId).then(actual => {
        expect(actual).to.eql({
          id: thirdId,
          name: testItem.name,
          price: testItem.price,
          category: testItem.category,
          checked: testItem.checked,
          date_added: testItem.date_added
        });
      });
    });

    it(`UpdateItem() updates an item from the 'shopping_test' table`, () => {
      const idOfItem = 3;
      const newItemFields = {
        name: 'updated name',
        price: '5.50',
        category: 'Snack',
        checked: false,
        date_added: new Date('2019-10-02T22:37:21.217Z')
      };
      return listService
        .updateItem(db, idOfItem, newItemFields)
        .then(() => listService.getItemById(db, idOfItem))
        .then(item => {
          expect(item).to.eql({
            id: idOfItem,
            ...newItemFields
          });
        });
    });

    it(`deleteItem() removes an item by id from shopping_test table`, () => {
      const itemId = 3;
      return listService
        .deleteItem(db, itemId)
        .then(() => listService.getAllItems(db))
        .then(allItems => {
          const expected = testItems.filter(item => item.id !== itemId);
          expect(allItems).to.eql(expected);
        });
    });

    it(`resolves all items form 'shopping_list' table`, () => {
      return listService.getAllItems(db).then(actual => {
        expect(actual).to.eql(testItems);
      });
    });
  });

  context(`When shopping_test has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
      return listService.getAllItems(db).then(actual => {
        expect(actual).to.eql([]);
      });
    });
  });

  it(`insertItem() inserts a new item and resolves with id'`, () => {
    const newItem = {
      name: 'new name',
      price: '2.50',
      category: 'Snack',
      checked: false,
      date_added: new Date('2020-01-01T00:00:00.000Z')
    };
    return listService.insertItem(db, newItem).then(actual => {
      expect(actual).to.eql({
        id: 1,
        name: newItem.name,
        price: newItem.price,
        category: newItem.category, 
        checked: newItem.checked,
        date_added: newItem.date_added
      });
    });
  });
});

// before(() => {
//   return db.into('shopping_test').insert(testItems);
// });

// context(`given shopping list has data`, () => {
//   beforeEach(() => {
//     return db.into('shopping_test').insert(testItems);
//   });

//   it(`getItemById() resolves an Item by id from 'shopping_test' table`, () => {
//     const thirdId = 3;
//     const testItem = testItems[thirdId - 1];
//     return listService.getItemById(db, thirdId).then(actual => {
//       expect(actual).to.eql({
//         id: thirdId,
//         name: testItem.name,
//         price: testItem.price,
//         category: testItem.category,
//         checked: testItem.checked,
//         date_added: testItem.date_added
//       });
//     });
//   });
// });
