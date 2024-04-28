module.exports = (sequelize, Sequelize) => {

    //id	name	surname	email	pass	photo	point	city	yetki	ref_id_for_point	ref_id_for_real	phone	birth_day	

    const User = sequelize.define("user", {
      
      name: {
        type: Sequelize.STRING
      },
      surname: {
        type: Sequelize.STRING
      },
      nickname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      pass: {
        type: Sequelize.STRING
      },
      photo: {
        type: Sequelize.STRING
      },
      point: {
        type: Sequelize.INTEGER
      },

      generation:{
        type: Sequelize.INTEGER
      },


      city: {
        type: Sequelize.STRING
      },
      yetki: {
        type: Sequelize.STRING
      },
      isVerified: {
        type: Sequelize.STRING
      },
      ref_id:{
        type: Sequelize.STRING
      },
      ref_id_for_point: {
        type: Sequelize.STRING
      },
      ref_id_for_real: {
        type: Sequelize.STRING
      },
      ref_id_for_link: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      birth_day: {
        type: Sequelize.DATEONLY
      },
      isGhost: {
        type: Sequelize.INTEGER
      },
      
    });
  
    return User;
  };