'use strict';
module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define('Recipe', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    category: DataTypes.STRING,
    upvote: DataTypes.INTEGER,
    downvote: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  });

  Recipe.associate = (models) => {
    Recipe.belongsTo(models.User, {
      foreignKey: 'userId',
      as:'recipes'
    })
  };
  return Recipe;
};