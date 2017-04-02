const RubricLib = require('rubricjs');
const {
    EntityManager,
    EntityFactory,
    SystemManager,
    // TimerManager
} = RubricLib;

module.exports = {
    entityManager: new EntityManager(),
    entityFactory: new EntityFactory(),
    systemManager: new SystemManager(),
    // Unnecessary for our demo
    // timerManager: new TimerManager(),
};
