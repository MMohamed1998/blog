import mongoose, { Schema, Types, model } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
    },
    urlToUpdate: String,
    photo: String,
    author: { type: Types.ObjectId, ref: "User" },
    tags: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.post("init", function (doc) {
  doc.photo = "http://localhost:3000/" + doc.photo;
});

const blogModel = mongoose.models.Blog || model("Blog", blogSchema);
blogModel.createIndexes([
  {
    title: 1,
    author: 1,
    tags: 1,
  },
]);
export default blogModel;
