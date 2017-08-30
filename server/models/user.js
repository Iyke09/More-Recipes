module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    classMethods: {
      associate: () => {
        // associations can be defined here
      },
    },
  });
  return User;
};
