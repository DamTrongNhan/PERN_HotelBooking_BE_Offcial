import passport from "passport";
import passportLocal from "passport-local";
import passportJwt from "passport-jwt";
import bcrypt from "bcrypt";

import "dotenv/config";

import db from "../../models";
import { Op } from "sequelize";

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.serializeUser((req, user, done) => {
  done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
  db.users
    .findOne({
      where: { id },
    })
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

/**
 * Sign in using Email and Password.
 */
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    db.users
      .findOne({
        where: {
          email: email.toLowerCase(),
          userStatusKey: { [Op.ne]: "SU2" },
        },
        include: [
          {
            model: db.photos,
            as: "avatarData",
            attributes: ["url"],
          },
        ],
        raw: false,
        nest: true,
      })
      .then((user) => {
        if (!user) {
          return done(undefined, false, {
            message: `Email ${email} cannot be found or has been locked`,
          });
        }
        bcrypt.compare(password, user.password, (errorCompare, isMatch) => {
          if (errorCompare) {
            return done(errorCompare);
          }
          if (isMatch) {
            return done(undefined, user);
          }
          return done(undefined, false, {
            message: "Invalid email or password.",
          });
        });
      })
      .catch((err) => {
        return done(err);
      });
  })
);

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_ACCESS_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await db.users.findOne({ where: { id: jwtPayload.id } });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err);
    }
  })
);
export default passport;
