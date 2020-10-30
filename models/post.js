module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [1, 250]
      }
    },
    urgency: {
      type: DataTypes.STRING,
      defaultValue: "Low"
    },
    project_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: "Personal"
    }
  });
  return Post;
};