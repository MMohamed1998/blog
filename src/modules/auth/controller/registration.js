import { compare, hash } from "../../../../utils/HashAndCompare.js";
import userModel from "../../../../database/models/User.model.js";
import { generateToken}from "../../../../utils/GenerateAndVerifyToken.js";
import { asyncHandler } from "../../../../utils/errorHandling.js";




export const getAllUsers=asyncHandler(async(req,res,next)=>{
  const users = await userModel.find();
  if(!users){
    return next(new Error("No User Found", { cause: 409 }));
  }
  res.status(201).json({success:true , data :users});
})
export const getOneUser=asyncHandler(async(req,res,next)=>{
  const userId = req.params.userId;

  const user = await userModel.findById(userId);
  if(!user){
    return next(new Error("No User Found", { cause: 409 }));
  }
  res.status(201).json({success:true , data :user});
})

export const signup = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, gender, password,cPassword } = req.body;
  const userName = `${firstName} ${lastName}`;
  const checkUser = await userModel.findOne({ email });
  if (checkUser) {
    return next(new Error("email exist", { cause: 409 }));
  }
  if(!cPassword==password){
    return next(new Error('Passwords do not match',{cause : 420}))

  }
  
  const hashPassword = hash({ plaintext: password });
  const { _id } = await userModel.create({
    userName,
    email,
    gender,
    password: hashPassword,
    confirmEmail: true
  });
  res
    .status(200)
    .json({ message:"User created successfully!",userId: _id});
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("not registered email", { cause: 404 }));
  }
  if (!user.confirmEmail) {
    return next(new Error("please confirm your email first", { cause: 400 }));
  }
  if (user.status == "blocked") {
    return next(
      new Error(
        "your account has been blocked by admin please contact with our support team"
      )
    );
  }
  if (!compare({ plaintext: password, hashValue: user.password })) {
    return next(new Error("invalid email or password", { cause: 400 }));
  }
  const access_token = generateToken({
    payload: { id: user._id, role: user.role, status: user.status },
    expiresIn: 60 * 30,
  });
  const refresh_token = generateToken({
    payload: { id: user._id, role: user.role, status: user.status },
    expiresIn: 60 * 60 * 24 * 365,
  });
  user.status = "online";
  await user.save();
  res.status(200).json({
    message: "User login successfully!",
    access_token,
    refresh_token,
    user,
  });
});

export const addFollower = asyncHandler(async (req, res, next) => {
  const followingId = req.params.followingId;
  const userId =req.user
  const followed=await userModel.findById(followingId)
  const follower=await userModel.findById(userId)
  if(followed.followers.includes(userId)){
    return next(new Error("you follow this user exactly", { cause: 400 }));

  }
  if(follower.following.includes(followingId)){
    return next(new Error("this user are following by you", { cause: 400 }));

  }
  await userModel.findOneAndUpdate(
    { _id: followingId },
    { $push: { followers: userId } },
    { returnOriginal: false })
    
    await userModel.findOneAndUpdate(
      { _id: userId },
      { $push: { following: followingId } },
      { returnOriginal: false })
  res.status(200).json({message:"followed successfully"})

});

export const deleteFollower = asyncHandler(async (req, res, next) => {
  const followingId = req.params.followingId;
  const userId =req.user
  const followed=await userModel.findById(followingId)
  const follower=await userModel.findById(userId)
  if(!followed.followers.includes(userId)){
    return next(new Error("you are not follow this user", { cause: 400 }));

  }
  if(!follower.following.includes(followingId)){
    return next(new Error("this user are not following by you", { cause: 400 }));

  }
  await userModel.findOneAndUpdate(
    { _id: followingId },
    { $pull: { followers: userId } },
    { returnOriginal: false })
    
    await userModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { following: followingId } },
      { returnOriginal: false })
  res.status(200).json({message:"unFollowed successfully"})

});


