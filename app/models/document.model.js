module.exports = (sequelize, Sequelize) => {
    const Document = sequelize.define("document", {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      doc: {
        type: Sequelize.STRING
      }
    });
  
    return Document;
  };