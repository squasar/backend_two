module.exports = (sequelize, Sequelize) => {
    const Subscriber = sequelize.define("subscriber", {
      endpoint: {
        type: Sequelize.STRING
      },
      p256dh:{
        type: Sequelize.STRING
      },
      auth:{
        type: Sequelize.STRING
      }
    });  
    return Subscriber;
  };
