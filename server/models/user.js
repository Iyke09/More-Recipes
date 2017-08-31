module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
      email: {
        type: DataTypes.STRING,
        unique:true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull:false,
        validate: {
          min: 6
        }
      },
  });

  User.associate = (models) => {
    User.hasMany(models.Recipe, {
      foreignKey:'userId',
      as:'recipes'
    })
  };
  return User;
};

