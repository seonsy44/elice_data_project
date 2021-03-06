import { ReviewModel } from "../schemas/review.mjs";

class Review {
  static async create({ newReview }) {
    const createdNewReview = await ReviewModel.create(newReview);
    return createdNewReview;
  }

  static async findById({ id }) {
    const reviewInfo = await ReviewModel.findOne({ id }).lean();
    return reviewInfo;
  }

  static async update({ id, toUpdate }) {
    const filter = { id };
    const option = { returnOriginal: false };
    const updatedReview = ReviewModel.findOneAndUpdate(
      filter,
      toUpdate,
      option,
    );

    return updatedReview;
  }

  static async delete({ id, session }) {
    const result = await ReviewModel.deleteOne({ id }).session(session);
    // returns: { "acknowledged" : true, "deletedCount" : 1 }
    const isDataDeleted = result.deletedCount === 1;
    return isDataDeleted;
  }

  static async findByUserId({ userId }) {
    const reviewlist = await ReviewModel.find({ userId }).lean();
    return reviewlist;
  }

  static async findByRestaurantId({ restaurantId }) {
    const reviewlist = await ReviewModel.find({ restaurantId })
      .lean()
      .populate("comments");
    return reviewlist;
  }

  static async updateUserName({ userId, userName, session }) {
    const filter = { userId };
    const update = { userName };
    const option = { returnOriginal: false };

    const updatedReviews = await ReviewModel.updateMany(
      filter,
      update,
      option,
    ).session(session);
    return updatedReviews;
  }

  static async deleteByUserId({ userId, commentList, session }) {
    await ReviewModel.deleteMany({ userId }).session(session);

    await ReviewModel.updateMany(
      { comments: { $in: commentList } },
      { $pull: { comments: { $in: commentList } } },
      { returnOriginal: false },
    ).session(session);

    return { status: "ok" };
  }

  static async addComment({ id, commentId }) {
    const filter = { id };
    const update = { $push: { comments: commentId } };
    const option = { returnOriginal: false };

    const updatedReview = await ReviewModel.findOneAndUpdate(
      filter,
      update,
      option,
    );
    return updatedReview;
  }

  static async deleteComment({ id, commentId, session }) {
    const filter = { id };
    const update = { $pull: { comments: commentId } };
    const option = { returnOriginal: false };

    const updatedReview = await ReviewModel.findOneAndUpdate(
      filter,
      update,
      option,
    ).session(session);
    return updatedReview;
  }
}

export { Review };
