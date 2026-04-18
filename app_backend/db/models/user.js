module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      first_name: {
        type: DataTypes.STRING(80),
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING(80),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
      },
      phone_number: {
        type: DataTypes.STRING(25),
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fcm_token: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      device_token: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      is_email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      email_verification_otp: {
        type: DataTypes.STRING(6),
        allowNull: true
      },
      email_verification_otp_expires_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      password_reset_otp: {
        type: DataTypes.STRING(6),
        allowNull: true
      },
      password_reset_otp_expires_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      last_login_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true
      }
    },
    {
      tableName: "users",
      underscored: true
    }
  );

  return User;
};
