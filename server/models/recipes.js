'use strict';
module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define('Recipe', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    category: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    favUser: DataTypes.ARRAY(DataTypes.STRING),
  });

  // Recipe.associate = (models) => {
  //   Recipe.hasMany(models.Comment, {
  //     foreignKey:'recipeId',
  //     as:'comments'
  //   })
  // };
  // Recipe.associate = (models) => {
  //   Recipe.hasMany(models.Votes,{
  //     foreignKey:'recipeId',
  //     as:'votes'
  //   })
  // };
  Recipe.associate = (models) => {
    Recipe.hasMany(models.Favorite, {
      foreignKey: 'recipeId',
      as:'favorites'
    })
  };

  Recipe.associate = (models) => {
    Recipe.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    })
  };
  return Recipe;
};