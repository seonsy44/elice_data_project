import { UserModel } from "../schemas/user.mjs";

class User {
  static async create({ newUser }) {
    const createdNewUser = await UserModel.create(newUser);
    return createdNewUser;
  }

  static async findByEmail({ email }) {
    const user = await UserModel.findOne({ email });
    return user;
  }

  static async findById({ id }) {
    const user = await UserModel.findOne({ id }).lean();
    return user;
  }

  static async findAll() {
    const users = await UserModel.find({});
    return users;
  }

  static async update({ id, toUpdate }) {
    const filter = { id };
    const update = toUpdate;
    const option = { returnOriginal: false };

    const updatedUser = await UserModel.findOneAndUpdate(
      filter,
      update,
      option,
    );

    return updatedUser;
  }

  static async delete({ id }) {
    const ret = await UserModel.findOneAndDelete({ id });
    return ret;
  }

  // 북마크 관련 모델
  static updateBookmark = async ({ id, restaurantId }) => {
    const filter = { id };
    const update = { $push: { bookmarks: restaurantId } };
    const option = { returnOriginal: false };

    const bookmarks = await UserModel.findOneAndUpdate(filter, update, option);
    return bookmarks;
  };

  static findBookmarks = async ({ id }) => {
    const userInfo = await UserModel.findOne({ id }).populate("bookmarks");
    return userInfo.bookmarks;
  };

  static deleteBookmark = async ({ id, restaurantId }) => {
    const filter = { id };
    const update = { $pull: { bookmarks: restaurantId } };
    const option = { returnOriginal: false };

    const bookmarks = await UserModel.findOneAndUpdate(filter, update, option);
    return bookmarks;
  };
}

export { User };
