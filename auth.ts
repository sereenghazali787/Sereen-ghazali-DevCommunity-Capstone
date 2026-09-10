import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import connectDB from "@/lib/db";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub, Google],

  callbacks: {
    async signIn({ user }) {
      try {
        if (!user.email) {
          return false;
        }

        await connectDB();

        const existingUser = await User.findOne({
          email: user.email.toLowerCase(),
        });

        if (!existingUser) {
          const baseUsername = user.email
            .split("@")[0]
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

          let username = baseUsername || "developer";
          let counter = 1;

          while (await User.findOne({ username })) {
            username = `${baseUsername}${counter}`;
            counter++;
          }

          await User.create({
            name: user.name || username,
            username,
            email: user.email.toLowerCase(),
            image: user.image || "",
          });
        } else {
          // Keep the profile image/name from OAuth reasonably up to date.
          existingUser.name = user.name || existingUser.name;
          existingUser.image = user.image || existingUser.image;

          await existingUser.save();
        }

        return true;
      } catch (error) {
        console.error("Sign-in database error:", error);
        return false;
      }
    },

    async jwt({ token }) {
      if (token.email) {
        await connectDB();

        const dbUser = await User.findOne({
          email: token.email.toLowerCase(),
        }).lean();

        if (dbUser) {
          token.userId = dbUser._id.toString();
          token.username = dbUser.username;
        }
      }

      return token;
    },
async session({ session, token }) {
  if (session.user && token.email) {
    await connectDB();

    const dbUser = await User.findOne({
      email: token.email.toLowerCase(),
    }).lean();

    if (dbUser) {
      session.user.id =
        dbUser._id.toString();

      session.user.username =
        dbUser.username;

      session.user.name =
        dbUser.name;

      session.user.image =
        dbUser.image || null;
    }
  }
  return session;
},
  },
});