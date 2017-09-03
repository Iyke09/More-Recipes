'use strict';
module.exports = (sequelize, DataTypes) => {
  const Votes = sequelize.define('Votes', {
    recipeId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    votes: DataTypes.BOOLEAN,
  });

  Votes.associate = (models) => {
    Votes.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
      as:'Votes'
    })
  };
  return Votes;
};