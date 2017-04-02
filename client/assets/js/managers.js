const RubricLib = require('rubricjs');
const {EntityManager, EntityFactory, SystemManager} = RubricLib;

module.exports = {
    entityManager: new EntityManager(),
    entityFactory: new EntityFactory(),
    systemManager: new SystemManager(),
};
