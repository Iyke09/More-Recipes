module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
      email: {
        type: DataTypes.STRING,
        unique:true,
        validation: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull:false,
        validation: {
          min: 6
        }
      },
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
      },
    },
  });
  return User;
};
