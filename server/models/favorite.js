'use strict';
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    recipeId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
  });

  Favorite.associate = (models) => {
    Favorite.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
      as:'favorites'
    })
  };

  
  return Favorite;
};